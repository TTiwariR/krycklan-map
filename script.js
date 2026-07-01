// ===================== MAP =====================
const map = L.map('map').setView([64.245, 19.80], 12);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap'
}).addTo(map);

// ===================== PANES =====================
map.createPane('streamsPane');
map.getPane('streamsPane').style.zIndex = 300;

map.createPane('catchmentsPane');
map.getPane('catchmentsPane').style.zIndex = 400;

map.createPane('sitesPane');
map.getPane('sitesPane').style.zIndex = 650;

// ===================== SITE DATA =====================
const sites = [
  {SiteNo:1, ShortName:"C1", FullName:"Risbäcken", Lat:64.248430, Lon:19.808109, Catchment Stream order:"2"},
  {SiteNo:2, ShortName:"C2", FullName:"Västrabäcken", Lat:64.252650, Lon:19.775942, Catchment Stream order:"1"},
  {SiteNo:4, ShortName:"C4", FullName:"Kallkällsmyren", Lat:64.259443, Lon:19.773903, Catchment Stream order:"1"},
  {SiteNo:5, ShortName:"C5", FullName:"Stortjärnen Outlet", Lat:64.260802, Lon:19.760566, Catchment:"1"},
  {SiteNo:6, ShortName:"C6", FullName:"Stortjärnbäcken", Lat:64.250850, Lon:19.773082, Catchment Stream order:"1"},
  {SiteNo:7, ShortName:"C7", FullName:"Kallkällsbäcken", Lat:64.251721, Lon:19.776738, Catchment Stream order:"2"},
  {SiteNo:9, ShortName:"C9", FullName:"Nyängesbäcken", Lat:64.237584, Lon:19.791428, Catchment Stream order:"3"},
  {SiteNo:10, ShortName:"C10", FullName:"Stormyrbäcken", Lat:64.256904, Lon:19.786635, Catchment Stream order:"2"},
  {SiteNo:12, ShortName:"C12", FullName:"Nymyrbäcken", Lat:64.240791, Lon:19.815406, Catchment Stream order:"3"},
  {SiteNo:13, ShortName:"C13", FullName:"Långbäcken", Lat:64.233016, Lon:19.787323, Catchment Stream order:"3"},
  {SiteNo:14, ShortName:"C14", FullName:"Åhedbäcken", Lat:64.225857, Lon:19.771106, Catchment Stream order:"3"},
  {SiteNo:15, ShortName:"C15", FullName:"Övre Krycklan", Lat:64.246823, Lon:19.838748, Catchment Stream order:"4"},
  {SiteNo:16, ShortName:"C16", FullName:"Krycklan", Lat:64.198353, Lon:19.868897, Catchment Stream order:"4"},
  {SiteNo:20, ShortName:"C20", FullName:"Site 20", Lat:64.220317, Lon:19.757769, Catchment Stream order:"1"},
  {SiteNo:21, ShortName:"C21", FullName:"Site 21", Lat:64.224195, Lon:19.767814, Catchment Stream order:"1"},
  {SiteNo:22, ShortName:"C22", FullName:"Site 22", Lat:64.277492, Lon:19.817616, Catchment Stream order:"2"}
];


// ===================== STATE =====================
let selectedSite = null;
window.catchmentStats = null;

// ===================== COLORS =====================
function getColor(catchment) {
  return {
    Upper: "#1f78b4",
    Middle: "#33a02c",
    Lower: "#e31a1c"
  }[catchment] || "#666";
}

// ===================== PANEL =====================
function updatePanel(site) {
  const panel = document.getElementById("infoPanel");
  if (!panel) return;

  panel.innerHTML = `
    <h3>${site.ShortName}</h3>
    <p><b>Name:</b> ${site.FullName}</p>
    <p><b>Catchment:</b> ${site.Catchment}</p>
  `;
}

// ===================== DASHBOARD =====================
function renderChart(site) {

  console.log("renderChart fired:", site);

  const container = document.getElementById("chartContainer");
  const title = document.getElementById("dashTitle");

  if (!container || !title) {
    console.warn("Dashboard missing in HTML");
    return;
  }

  const stats = window.catchmentStats?.[`C${site.SiteNo}`];

  console.log("stats:", stats);

  if (!stats) {
    container.innerHTML = "<b>No stats found for this site</b>";
    return;
  }

  title.innerHTML = `${site.ShortName} — Land Cover Composition`;

  container.innerHTML = `
    <b>Forest:</b> ${stats.Forest_y}%<br>
    <b>Lake:</b> ${stats.Lake_y}%<br>
    <b>Peat:</b> ${stats.Peat_s}%<br>
    <b>Till:</b> ${stats.TillThin}%<br>
    <b>Sorted Sediment:</b> ${stats.SortedSed_s}%<br>
  `;
}

// ===================== SITE CLICK =====================
function selectSite(site) {
  selectedSite = site;
  updatePanel(site);
  map.panTo([site.Lat, site.Lon]);
  renderChart(site);
}

// ===================== SITE LAYER =====================
const siteLayer = L.layerGroup().addTo(map);

// ===================== DRAW SITES =====================
function drawSites(filter = "all") {

  siteLayer.clearLayers();

  sites.forEach(site => {

    if (filter !== "all" && site.Catchment !== filter) return;

    const marker = L.circleMarker([site.Lat, site.Lon], {
      radius: 7,
      color: "#000",
      weight: 1,
      fillColor: getColor(site.Catchment),
      fillOpacity: 0.9,
      pane: 'sitesPane'
    });

    marker.on("click", () => selectSite(site));

    const stats = window.catchmentStats?.[`C${site.SiteNo}`];

    const dominant = stats
      ? Object.entries({
          Forest: stats.Forest_y,
          Lake: stats.Lake_y,
          Peat: stats.Peat_s,
          Till: stats.TillThin
        }).sort((a, b) => b[1] - a[1])[0][0]
      : "N/A";

    marker.bindPopup(`
      <b>${site.ShortName}</b><br>
      ${site.FullName}<br><br>

      <b>Catchment:</b> ${site.Catchment}<br>
      <b>Dominant:</b> ${dominant}<br><br>

      🌲 Forest: ${stats?.Forest_y ?? "N/A"}%<br>
      💧 Lake: ${stats?.Lake_y ?? "N/A"}%<br>
      🪵 Peat: ${stats?.Peat_s ?? "N/A"}%<br>
      🪨 Till: ${stats?.TillThin ?? "N/A"}%
    `);

    marker.addTo(siteLayer);
  });
}

// ===================== FILTER =====================
document.getElementById("catchmentFilter")
  .addEventListener("change", (e) => {
    drawSites(e.target.value);
  });

// ===================== LOAD DATA =====================
fetch('data/catchmentStats.json')
  .then(r => r.json())
  .then(stats => {
    window.catchmentStats = stats;
    console.log("Stats loaded");
    drawSites("all");
  })
  .catch(err => console.error("Stats error:", err));

// ===================== CATCHMENTS =====================
fetch('data/regular_catchments.geojson')
  .then(r => r.json())
  .then(data => {

    L.geoJSON(data, {
      pane: 'catchmentsPane',
      style: {
        color: "#444",
        weight: 1,
        fillColor: "#6baed6",
        fillOpacity: 0.15
      }
    }).addTo(map);

  });

// ===================== STREAMS =====================
fetch('data/streams.geojson')
  .then(r => r.json())
  .then(data => {

    const streamLayer = L.geoJSON(data, {
      pane: 'streamsPane',
      style: {
        color: "#2171b5",
        weight: 2,
        opacity: 0.8
      }
    }).addTo(map);

    map.fitBounds(streamLayer.getBounds());
  });
