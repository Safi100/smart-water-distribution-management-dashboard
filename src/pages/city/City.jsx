import React, { useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import axios from "axios";
import { useParams } from "react-router-dom";

const City = () => {
  const { id } = useParams();
  const [tanks, setTanks] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/tank/city/${id}`)
      .then((res) => {
        console.log(res.data);
        setTanks(res.data);
      })
      .catch((error) => {
        console.error("Error fetching city data:", error);
      });
  }, [id]);

  useEffect(() => {
    if (tanks.length === 0) return; // Ensure we have data before initializing the map

    mapboxgl.accessToken =
      "pk.eyJ1Ijoic2FmaW8xMDAiLCJhIjoiY20zcjgwZHE1MDJ3YTJqc2Z2eWNzMzA3ZSJ9.WgiGpG_mQbxDnFP_Ygtqww";

    const map = new mapboxgl.Map({
      container: "cluster-map",
      style: "mapbox://styles/mapbox/dark-v11",
      center: [35.227, 31.9466],
      zoom: 9,
    });

    map.addControl(new mapboxgl.NavigationControl());

    // Convert tanks data to GeoJSON format
    const geojsonTanks = {
      type: "FeatureCollection",
      features: tanks.map((tank) => ({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [tank.coordinates.longitude, tank.coordinates.latitude], // Ensure these fields exist in API response
        },
        properties: {
          popUpMarkup: `
            <div style="color: black;">
                <strong>Tank for ${tank.owner?.name}</strong>
                <p>Monthly capacity: ${tank.monthly_capacity}</p>
                <a href="/tank/${tank._id}" class="btn btn-small btn-primary">See more</a>
            </div>
        `,
        },
      })),
    };
    map.on("load", () => {
      map.addSource("tanks", {
        type: "geojson",
        data: geojsonTanks,
        cluster: true,
        clusterMaxZoom: 14,
        clusterRadius: 50,
      });

      // Clustered points
      map.addLayer({
        id: "clusters",
        type: "circle",
        source: "tanks",
        filter: ["has", "point_count"],
        paint: {
          "circle-color": "#00cc99",
          "circle-radius": ["step", ["get", "point_count"], 15, 10, 20, 30, 25],
        },
      });

      // Cluster count
      map.addLayer({
        id: "cluster-count",
        type: "symbol",
        source: "tanks",
        filter: ["has", "point_count"],
        layout: {
          "text-field": ["get", "point_count_abbreviated"],
          "text-size": 12,
        },
      });

      // Unclustered points
      map.addLayer({
        id: "unclustered-point",
        type: "circle",
        source: "tanks",
        filter: ["!", ["has", "point_count"]],
        paint: {
          "circle-color": "#00cc99",
          "circle-radius": 4,
          "circle-stroke-width": 1,
          "circle-stroke-color": "#fff",
        },
      });

      // Handle cluster click
      map.on("click", "clusters", (e) => {
        const features = map.queryRenderedFeatures(e.point, {
          layers: ["clusters"],
        });
        const clusterId = features[0].properties.cluster_id;
        map
          .getSource("tanks")
          .getClusterExpansionZoom(clusterId, (err, zoom) => {
            if (err) return;
            map.easeTo({
              center: features[0].geometry.coordinates,
              zoom,
            });
          });
      });

      // Handle unclustered point click
      map.on("click", "unclustered-point", (e) => {
        const coordinates = e.features[0].geometry.coordinates.slice();
        const { popUpMarkup } = e.features[0].properties;

        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        new mapboxgl.Popup()
          .setLngLat(coordinates)
          .setHTML(popUpMarkup)
          .addTo(map);
      });

      // Cursor pointer for clusters
      map.on("mouseenter", "clusters", () => {
        map.getCanvas().style.cursor = "pointer";
      });

      map.on("mouseleave", "clusters", () => {
        map.getCanvas().style.cursor = "";
      });
    });

    return () => map.remove();
  }, [tanks]);

  return (
    <>
      <div id="cluster-map" style={{ height: "500px", width: "100%" }} />
    </>
  );
};

export default City;
