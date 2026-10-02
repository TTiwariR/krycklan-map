// VERSION TEST 2026-10-02
// ===================== MAP =====================

const map = L.map("map").setView(
  [64.245, 19.80],
  12
);

L.tileLayer(
  "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
  {
    attribution: "© OpenStreetMap"
  }
).addTo(map);


// ===================== PANES =====================

map.createPane("streamsPane");
map.getPane("streamsPane").style.zIndex = 300;

map.createPane("catchmentsPane");
map.getPane("catchmentsPane").style.zIndex = 400;

map.createPane("sitesPane");
map.getPane("sitesPane").style.zIndex = 650;


// ===================== SITE DATA =====================

const sites = [
  {
    SiteNo: 1,
    ShortName: "C1",
    FullName: "Risbäcken",
    Lat: 64.248430,
    Lon: 19.808109,
    StreamOrder: 2
  },
  {
    SiteNo: 2,
    ShortName: "C2",
    FullName: "Västrabäcken",
    Lat: 64.252650,
    Lon: 19.775942,
    StreamOrder: 1
  },
  {
    SiteNo: 4,
    ShortName: "C4",
    FullName: "Kallkällsmyren",
    Lat: 64.259443,
    Lon: 19.773903,
    StreamOrder: 1
  },
  {
    SiteNo: 5,
    ShortName: "C5",
    FullName: "Stortjärnen Outlet",
    Lat: 64.260802,
    Lon: 19.760566,
    StreamOrder: 1
  },
  {
    SiteNo: 6,
    ShortName: "C6",
    FullName: "Stortjärnbäcken",
    Lat: 64.250850,
    Lon: 19.773082,
    StreamOrder: 1
  },
  {
    SiteNo: 7,
    ShortName: "C7",
    FullName: "Kallkällsbäcken",
    Lat: 64.251721,
    Lon: 19.776738,
    StreamOrder: 2
  },
  {
    SiteNo: 9,
    ShortName: "C9",
    FullName: "Nyängesbäcken",
    Lat: 64.237584,
    Lon: 19.791428,
    StreamOrder: 3
  },
  {
    SiteNo: 10,
    ShortName: "C10",
    FullName: "Stormyrbäcken",
    Lat: 64.256904,
    Lon: 19.786635,
    StreamOrder: 2
  },
  {
    SiteNo: 12,
    ShortName: "C12",
    FullName: "Nymyrbäcken",
    Lat: 64.240791,
    Lon: 19.815406,
    StreamOrder: 3
  },
  {
    SiteNo: 13,
    ShortName: "C13",
    FullName: "Långbäcken",
    Lat: 64.233016,
    Lon: 19.787323,
    StreamOrder: 3
  },
  {
    SiteNo: 14,
    ShortName: "C14",
    FullName: "Åhedbäcken",
    Lat: 64.225857,
    Lon: 19.771106,
    StreamOrder: 3
  },
  {
    SiteNo: 15,
    ShortName: "C15",
    FullName: "Övre Krycklan",
    Lat: 64.246823,
    Lon: 19.838748,
    StreamOrder: 4
  },
  {
    SiteNo: 16,
    ShortName: "C16",
    FullName: "Krycklan",
    Lat: 64.198353,
    Lon: 19.868897,
    StreamOrder: 4
  },
  {
    SiteNo: 20,
    ShortName: "C20",
    FullName: "Site 20",
    Lat: 64.220317,
    Lon: 19.757769,
    StreamOrder: 1
  },
  {
    SiteNo: 21,
    ShortName: "C21",
    FullName: "Site 21",
    Lat: 64.224195,
    Lon: 19.767814,
    StreamOrder: 1
  },
  {
    SiteNo: 22,
    ShortName: "C22",
    FullName: "Site 22",
    Lat: 64.277492,
    Lon: 19.817616,
    StreamOrder: 2
  }
];


// ===================== STATE =====================

let selectedSite = null;
window.catchmentStats = null;


// ===================== STREAM ORDER COLORS =====================

function getColor(streamOrder) {
  const colors = {
    1: "#1b9e77",
    2: "#d95f02",
    3: "#7570b3",
    4: "#e7298a"
  };

  return colors[streamOrder] || "#666666";
}


// ===================== STREAM ORDER LABEL =====================

function getStreamOrderLabel(order) {
  return "Stream Order " + order;
}


// ===================== SITE INFORMATION PANEL =====================

function updatePanel(site) {
  const panel = document.getElementById("infoPanel");

  if (!panel) {
    return;
  }

  panel.innerHTML = `
    <h3>${site.ShortName}</h3>

    <p>
      <b>Name:</b>
      ${site.FullName}
    </p>

    <p>
      <b>Stream order:</b>
      ${site.StreamOrder}
    </p>
  `;
}


// ===================== DASHBOARD =====================

function renderChart(site) {
  console.log("renderChart fired:", site);

  const container = document.getElementById("chartContainer");
  const title = document.getElementById("dashTitle");

  if (!container || !title) {
    console.warn("Dashboard elements missing");
    return;
  }

  const stats = window.catchmentStats
    ? window.catchmentStats["C" + site.SiteNo]
    : null;

  console.log("stats:", stats);

  title.innerHTML =
    site.ShortName +
    " — " +
    getStreamOrderLabel(site.StreamOrder);

  if (!stats) {
    container.innerHTML = `
      <p>
        <b>${site.FullName}</b>
      </p>

      <p>
        Stream Order:
        <b>${site.StreamOrder}</b>
      </p>

      <p>
        No land-cover statistics are available for this site.
      </p>
    `;

    return;
  }

  container.innerHTML = `
    <p>
      <b>Stream Order:</b>
      ${site.StreamOrder}
    </p>

    <p>
      <b>Land Cover Composition</b>
    </p>

    <p>
      🌲 Forest:
      ${stats.Forest_y ?? "N/A"}%
    </p>

    <p>
      💧 Lake:
      ${stats.Lake_y ?? "N/A"}%
    </p>

    <p>
      🪵 Peat:
      ${stats.Peat_s ?? "N/A"}%
    </p>

    <p>
      🪨 Till:
      ${stats.TillThin ?? "N/A"}%
    </p>

    <p>
      🟤 Sorted Sediment:
      ${stats.SortedSed_s ?? "N/A"}%
    </p>
  `;
}


// ===================== SITE CLICK =====================

function selectSite(site) {
  selectedSite = site;

  updatePanel(site);

  map.panTo([
    site.Lat,
    site.Lon
  ]);

  renderChart(site);
}


// ===================== SITE LAYER =====================

const siteLayer = L.layerGroup().addTo(map);


// ===================== DRAW SITES =====================

function drawSites(filter) {
  if (filter === undefined) {
    filter = "all";
  }

  siteLayer.clearLayers();

  sites.forEach(function(site) {

    if (
      filter !== "all" &&
      Number(site.StreamOrder) !== Number(filter)
    ) {
      return;
    }

    const marker = L.circleMarker(
      [
        site.Lat,
        site.Lon
      ],
      {
        radius: 7,
        color: "#000000",
        weight: 1,
        fillColor: getColor(site.StreamOrder),
        fillOpacity: 0.9,
        pane: "sitesPane"
      }
    );

    marker.on(
      "click",
      function() {
        selectSite(site);
      }
    );


    // =====================
    // STATISTICS
    // =====================

    const stats = window.catchmentStats
      ? window.catchmentStats["C" + site.SiteNo]
      : null;


    // =====================
    // DOMINANT LAND COVER
    // =====================

    let dominant = "N/A";

    if (stats) {
      const landCover = {
        Forest: Number(stats.Forest_y) || 0,
        Lake: Number(stats.Lake_y) || 0,
        Peat: Number(stats.Peat_s) || 0,
        Till: Number(stats.TillThin) || 0
      };

      const entries = Object.entries(landCover);

      entries.sort(function(a, b) {
        return b[1] - a[1];
      });

      dominant = entries[0][0];
    }


    // =====================
    // POPUP
    // =====================

    marker.bindPopup(`
      <div>

        <h3 style="margin-top:0;">
          ${site.ShortName}
        </h3>

        <p>
          ${site.FullName}
        </p>

        <hr>

        <p>
          <b>Stream order:</b>
          ${site.StreamOrder}
        </p>

        <p>
          <b>Dominant land cover:</b>
          ${dominant}
        </p>

        <hr>

        <b>Land Cover</b><br>

        🌲 Forest:
        ${stats?.Forest_y ?? "N/A"}%<br>

        💧 Lake:
        ${stats?.Lake_y ?? "N/A"}%<br>

        🪵 Peat:
        ${stats?.Peat_s ?? "N/A"}%<br>

        🪨 Till:
        ${stats?.TillThin ?? "N/A"}%<br>

        🟤 Sorted Sediment:
        ${stats?.SortedSed_s ?? "N/A"}%

      </div>
    `);

    marker.addTo(siteLayer);
  });
}


// ===================== FILTER =====================

const streamOrderFilter =
  document.getElementById("streamOrderFilter");

if (streamOrderFilter) {

  streamOrderFilter.addEventListener(
    "change",
    function(event) {
      drawSites(event.target.value);
    }
  );

} else {

  console.warn(
    "Stream Order filter not found."
  );
}


// ===================== LOAD CATCHMENT STATISTICS =====================

fetch("data/catchmentStats.json")

  .then(function(response) {

    if (!response.ok) {
      throw new Error(
        "HTTP error " + response.status
      );
    }

    return response.json();
  })

  .then(function(stats) {

    window.catchmentStats = stats;

    console.log(
      "Catchment statistics loaded"
    );

    drawSites("all");
  })

  .catch(function(error) {

    console.error(
      "Stats error:",
      error
    );

    // Draw sites even if statistics fail.
    drawSites("all");
  });


// ===================== CATCHMENTS =====================

fetch("data/regular_catchments.geojson")

  .then(function(response) {

    if (!response.ok) {
      throw new Error(
        "HTTP error " + response.status
      );
    }

    return response.json();
  })

  .then(function(data) {

    L.geoJSON(
      data,
      {
        pane: "catchmentsPane",

        style: {
          color: "#444444",
          weight: 1,
          fillColor: "#6baed6",
          fillOpacity: 0.15
        }
      }
    ).addTo(map);

  })

  .catch(function(error) {

    console.error(
      "Catchment GeoJSON error:",
      error
    );

  });


// ===================== STREAMS =====================

fetch("data/streams.geojson")

  .then(function(response) {

    if (!response.ok) {
      throw new Error(
        "HTTP error " + response.status
      );
    }

    return response.json();
  })

  .then(function(data) {

    const streamLayer =
      L.geoJSON(
        data,
        {
          pane: "streamsPane",

          style: {
            color: "#2171b5",
            weight: 2,
            opacity: 0.8
          }
        }
      ).addTo(map);


    if (
      streamLayer.getBounds().isValid()
    ) {

      map.fitBounds(
        streamLayer.getBounds()
      );

    }

  })

  .catch(function(error) {

    console.error(
      "Streams GeoJSON error:",
      error
    );

  });


// ===================== LEGEND =====================

const legend =
  L.control({
    position: "bottomright"
  });

legend.onAdd = function() {

  const div =
    L.DomUtil.create(
      "div",
      "legend"
    );

  div.innerHTML = `
    <div class="legend-title">
      Stream Order
    </div>

    <div class="legend-item">
      <span
        class="legend-symbol"
        style="background:#1b9e77;"
      ></span>
      Stream Order 1
    </div>

    <div class="legend-item">
      <span
        class="legend-symbol"
        style="background:#d95f02;"
      ></span>
      Stream Order 2
    </div>

    <div class="legend-item">
      <span
        class="legend-symbol"
        style="background:#7570b3;"
      ></span>
      Stream Order 3
    </div>

    <div class="legend-item">
      <span
        class="legend-symbol"
        style="background:#e7298a;"
      ></span>
      Stream Order 4
    </div>
  `;

  return div;
};

legend.addTo(map);
