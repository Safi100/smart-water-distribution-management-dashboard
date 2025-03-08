import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import mapboxgl from "mapbox-gl";
import WaterTank from "../../components/WaterTank/WaterTank";
import "mapbox-gl/dist/mapbox-gl.css";
import "./city.css";

const City = () => {
  const { id } = useParams();
  const [city, setCity] = useState({});
  const mapContainer = useRef(null); // Create a reference for the map container

  // Fetch city data from the API
  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/city/${id}`)
      .then((res) => {
        console.log(res.data);
        setCity(res.data);
      })
      .catch((error) => {
        console.error("Error fetching city data:", error);
      });
  }, [id]);

  // Initialize the map after the city data is available
  useEffect(() => {
    if (city.tanks?.length === 0 || !mapContainer.current) return; // Ensure map container exists

    mapboxgl.accessToken =
      "pk.eyJ1Ijoic2FmaW8xMDAiLCJhIjoiY20zcjgwZHE1MDJ3YTJqc2Z2eWNzMzA3ZSJ9.WgiGpG_mQbxDnFP_Ygtqww";

    const map = new mapboxgl.Map({
      container: mapContainer.current, // Use the ref for the container
      style: "mapbox://styles/mapbox/dark-v11",
      center: [35.227, 31.9466],
      zoom: 9,
    });

    map.addControl(new mapboxgl.NavigationControl());

    // Convert tanks data to GeoJSON format
    const geojsonTanks = {
      type: "FeatureCollection",
      features: city.tanks?.map((tank) => ({
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

    // Handle map loading and layers
    map.on("load", () => {
      map.addSource("tanks", {
        type: "geojson",
        data: geojsonTanks,
        cluster: true,
        clusterMaxZoom: 14,
        clusterRadius: 50,
      });

      // Clustered points layer
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

      // Cluster count layer
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

      // Unclustered points layer
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

    return () => map.remove(); // Clean up on component unmount
  }, [city]);

  return city && Object.keys(city).length > 0 ? (
    <>
      <div ref={mapContainer} style={{ height: "450px", width: "100%" }} />
      <div className="wrapper py-3">
        <h2>{city.name}</h2>
        <p>Total tanks: {city.tanks?.length}</p>
        <div className="tanks_div">
          {city.tanks?.map((tank) => (
            <div className="tank_div">
              <h3 className="mb-4">
                Customer:{" "}
                <a
                  className="text-primary"
                  href={`/customer/${tank.owner?._id}`}
                >
                  {tank.owner?.name}
                </a>
              </h3>
              <WaterTank
                maxCapacity={tank.max_capacity}
                currentLevel={tank.current_level}
              />
              <p>Mothly credit : {tank.monthly_capacity} L /Month</p>
              <a
                className="btn btn-sm btn-primary mt-3"
                href={`/tank/${tank._id}`}
              >
                Read More
              </a>
            </div>
          ))}
        </div>
      </div>
    </>
  ) : (
    <div className="wrapper py-4">
      <h2 className="text-danger">City not found</h2>
    </div>
  );
};

export default City;
