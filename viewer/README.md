# 3F4D Site Viewer

Graphs of several sites that use the **3F4D Water Monitor sheet version** (Google Sheet).
Read-only: the viewer never writes to the sheets.

Online: https://akamiyat-cyber.github.io/ati-monitor/viewer/

## For each site (once)
1. The site uses its own Google Sheet made from `3F4D_Water_Monitor_Sheet_TEMPLATE.xlsx` (the version with the tab **Viewer_export**).
2. Share > General access > **Anyone with the link > Viewer**, and send the link to the coordinator.

## For the coordinator
1. Open the viewer, paste each site's link, press **Add site**.
2. **Load / refresh all** reads the newest data.
3. **Compare sites**: all sites in the same graphs (total irrigation and saving, cumulative irrigation, water level, tillers).
   **Each site**: water level with MD / Pitan / 3F4D periods and rain, cumulative irrigation, tillers.
4. **Share this list** makes a link that opens the same list on another computer. **Download data (CSV)** saves the data of all sites in one table.
5. **Try demo** shows three example sites.

The data are read from the tab `Viewer_export` (all text, so Google keeps every value). Older sheets without that tab are read from `Data_Farmer`.

## Offline
The viewer works without internet after the first visit (service worker). The data of the last successful load of each site are kept on the device and shown with the mark "Offline". Install it as an app from the browser menu ("Add to Home screen" / "Install app").

Files: `index.html` (the viewer), `plotly.min.js` (graphs, offline copy), `sw.js` (offline), `manifest.webmanifest` and `icon*.png` / `icon.svg` / `apple-touch-icon.png` (app icon), `3F4D_Water_Monitor_Sheet_TEMPLATE.xlsx` (the sheet template for the sites).

Template download: https://akamiyat-cyber.github.io/ati-monitor/viewer/3F4D_Water_Monitor_Sheet_TEMPLATE.xlsx
