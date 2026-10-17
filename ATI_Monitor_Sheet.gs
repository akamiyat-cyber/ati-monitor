/**
 * ATI Water Monitor - shared Google Sheet script (Apps Script, container-bound)
 *
 * Put this code into the Google Sheet made from ATI_Monitor_Shared_TEMPLATE.xlsx
 * (Extensions > Apps Script), then Deploy > New deployment > Web app:
 *   Execute as: Me      Who has access: Anyone
 * Copy the web app URL into the app (Share > Google Sheet connection).
 *
 * The app sends the data of one ATI each time a student saves (doPost),
 * and reads the data of all ATIs for the dashboard and Compare tab (doGet).
 *
 * Tabs:
 *   Data   : readable daily results of all ATIs (one block of rows per ATI, replaced on every save)
 *   ATIs   : one summary row per ATI
 *   _Store : machine copy used by the app (hidden, do not edit)
 */
var HEAD_DATA = ['ATI', 'Upload', 'Type', 'Date', 'DAT', 'Plot', 'Water level (cm)', 'Irrigated', 'Irrigation (mm)', 'Cumulative irrigation (mm)', 'Daily decrease (mm)', 'Tillers per hill', 'Item', 'Amount (kg)', 'Note'];
var HEAD_ATIS = ['ATI', 'Place', 'Sowing date', 'Last entry', 'Days of data', 'FP irrigation (mm)', '3F4D+MD irrigation (mm)', 'Saving (mm)', 'Saving (%)', 'Last updated (UTC)'];
var HEAD_STORE = ['ATI', 'Updated', 'Data'];

function onOpen() {
  SpreadsheetApp.getUi().createMenu('ATI Monitor')
    .addItem('Show web app URL', 'showUrl')
    .addItem('Check sheets', 'checkSheets')
    .addSeparator()
    .addItem('Delete ALL ATI data', 'clearAll')
    .addToUi();
}

function ensure_(name, head, hide) {
  var ss = SpreadsheetApp.getActive(), s = ss.getSheetByName(name);
  if (!s) s = ss.insertSheet(name);
  if (s.getLastRow() === 0) {
    s.getRange(1, 1, 1, head.length).setValues([head]).setFontWeight('bold').setBackground('#e8eef5');
    s.setFrozenRows(1);
  }
  if (hide && !s.isSheetHidden()) s.hideSheet();
  return s;
}
function sheets_() {
  return {data: ensure_('Data', HEAD_DATA), atis: ensure_('ATIs', HEAD_ATIS), store: ensure_('_Store', HEAD_STORE, true)};
}
function checkSheets() {
  sheets_();
  SpreadsheetApp.getUi().alert('The tabs Data, ATIs and _Store are ready.');
}
function showUrl() {
  var u = ''; try { u = ScriptApp.getService().getUrl(); } catch (e) {}
  SpreadsheetApp.getUi().alert(u ? 'Web app URL:\n\n' + u + '\n\nIf you change the code: Deploy > Manage deployments > Edit > New version.' :
    'The web app is not deployed yet.\nDeploy > New deployment > Web app (Execute as: Me, Who has access: Anyone).');
}
function clearAll() {
  var ui = SpreadsheetApp.getUi();
  if (ui.alert('Delete all ATI data?', 'This removes every ATI from Data, ATIs and the app store.', ui.ButtonSet.YES_NO) !== ui.Button.YES) return;
  var s = sheets_();
  [s.data, s.atis, s.store].forEach(function (sh) { if (sh.getLastRow() > 1) sh.getRange(2, 1, sh.getLastRow() - 1, sh.getMaxColumns()).clearContent(); });
}

/* ---------------------------------------------------------------- web app */
function json_(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }

function doGet(e) {
  try {
    var a = (e && e.parameter && e.parameter.action) || 'ping';
    if (a === 'ping') return json_({ok: true, app: 'ati-monitor', v: 2});
    if (a === 'list') return json_({ok: true, atis: readStore_()});
    return json_({ok: false, error: 'unknown action'});
  } catch (err) { return json_({ok: false, error: String(err)}); }
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(25000);
    var b = JSON.parse(e.postData.contents);
    if (b.action === 'push') return json_(push_(b));
    return json_({ok: false, error: 'unknown action'});
  } catch (err) { return json_({ok: false, error: String(err)}); }
  finally { try { lock.releaseLock(); } catch (x) {} }
}

function readStore_() {
  var s = ensure_('_Store', HEAD_STORE, true), out = [];
  if (s.getLastRow() < 2) return out;
  s.getRange(2, 1, s.getLastRow() - 1, 3).getValues().forEach(function (r) {
    if (r[0] !== '' && r[2] !== '') out.push({ati: String(r[0]), rev: String(r[1]), data: String(r[2])});
  });
  return out;
}

// replace all rows of one ATI in a sheet (first column = ATI name); rows = new rows of that ATI
function replaceRows_(sheet, ati, rows, width) {
  var last = sheet.getLastRow(), keep = [];
  if (last > 1) {
    var vals = sheet.getRange(2, 1, last - 1, width).getValues();
    keep = vals.filter(function (r) { return r[0] !== '' && String(r[0]) !== ati; });
    sheet.getRange(2, 1, last - 1, width).clearContent();
  }
  var all = keep.concat(rows.map(function (r) { r = r.slice(0, width); while (r.length < width) r.push(''); return r; }));
  if (all.length) {
    if (sheet.getMaxRows() < all.length + 1) sheet.insertRowsAfter(sheet.getMaxRows(), all.length + 1 - sheet.getMaxRows());
    sheet.getRange(2, 1, all.length, width).setValues(all);
  }
}

function push_(b) {
  var ati = String(b.ati || '').trim();
  if (!ati) return {ok: false, error: 'ATI name is empty'};
  var snap = String(b.snap || '');
  if (snap.indexOf('v1.') !== 0 || snap.length > 45000) return {ok: false, error: 'bad data'};
  var s = sheets_(), now = new Date().toISOString(), rev = String(b.rev || '');
  replaceRows_(s.store, ati, [[ati, rev, snap]], 3);
  var sm = b.summary || {};
  replaceRows_(s.atis, ati, [[ati, sm.place || '', sm.sow || '', sm.last || '', sm.days == null ? '' : sm.days, sm.fp == null ? '' : sm.fp, sm.md == null ? '' : sm.md,
    sm.save == null ? '' : sm.save, sm.pct == null ? '' : sm.pct, now]], 10);
  var rows = (b.rows || []).map(function (r) { return [ati].concat(r.slice(1)); });
  replaceRows_(s.data, ati, rows, 15);
  return {ok: true, ati: ati, rev: rev, updated: now, rows: rows.length};
}
