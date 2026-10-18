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

Files: `index.html` (the viewer), `plotly.min.js` (graphs, offline copy), `3F4D_Water_Monitor_Sheet_TEMPLATE.xlsx` (the sheet template for the sites).

Template download: https://akamiyat-cyber.github.io/ati-monitor/viewer/3F4D_Water_Monitor_Sheet_TEMPLATE.xlsx
