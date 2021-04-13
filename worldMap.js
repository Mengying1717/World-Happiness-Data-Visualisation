window.onload = function () {
    setTimeout(() => {
        var map = L.map("map").setView([50, 0], 1.5);

        L.tileLayer(
            "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw",
            {
                maxZoom: 10,
                attribution:
                    'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
                    'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
                id: "mapbox/light-v9",
                tileSize: 512,
                zoomOffset: -1
            }
        ).addTo(map);

        var info = L.control();

        info.onAdd = function (map) {
            this._div = L.DomUtil.create("div", "info"); // create a div with a class "info"
            this.update();
            return this._div;
        };

        // method that we will use to update the control based on feature properties passed
        info.update = function (props) {
            this._div.innerHTML =
                "<h4>World Happniess LadderScore</h4>" +
                (props
                    ? "<b>" + props.name + "</b><br />" + props.LadderScore
                    : "Hover over a country");
        };

        info.addTo(map);

        function getColor(d) {
            return d > 7
                ? "#800026"
                : d > 6
                ? "#BD0026"
                : d > 5
                ? "#E31A1C"
                : d > 4
                ? "#FC4E2A"
                : d > 2
                ? "#FD8D3C"
                : "#FFEDA0";
        }

        function style(feature) {
            // console.log(feature.properties.name);
            // console.log(feature.properties.LadderScore);
            return {
                fillColor: getColor(feature.properties.LadderScore),
                weight: 2,
                opacity: 1,
                color: "white",
                dashArray: "3",
                fillOpacity: 0.7
            };
        }

        function highlightFeature(e) {
            var layer = e.target;

            layer.setStyle({
                weight: 5,
                color: "#666",
                dashArray: "",
                fillOpacity: 0.7
            });

            if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
                layer.bringToFront();
            }
            info.update(layer.feature.properties);
        }

        var geojson;
        function resetHighlight(e) {
            geojson.resetStyle(e.target);
            info.update();
        }

        function zoomToFeature(e) {
            map.fitBounds(e.target.getBounds());
        }

        function onEachFeature(feature, layer) {
            layer.on({
                mouseover: highlightFeature,
                mouseout: resetHighlight,
                click: zoomToFeature
            });
        }

        geojson = L.geoJson(statesData, {
            style: style,
            onEachFeature: onEachFeature
        }).addTo(map);

        map.attributionControl.addAttribution(
            'Population data &copy; <a href="http://census.gov/">US Census Bureau</a>'
        );

        var legend = L.control({ position: "bottomright" });

        legend.onAdd = function (map) {
            var div = L.DomUtil.create("div", "info legend"),
                grades = [2, 4, 5, 6, 7],
                labels = [],
                from,
                to;

            for (var i = 0; i < grades.length; i++) {
                from = grades[i];
                to = grades[i + 1];

                labels.push(
                    '<i style="background:' +
                        getColor(from + 1) +
                        '"></i> ' +
                        from +
                        (to ? "&ndash;" + to : "+")
                );
            }

            div.innerHTML = labels.join("<br>");
            return div;
        };

        legend.addTo(map);
    }, 1000);
};
