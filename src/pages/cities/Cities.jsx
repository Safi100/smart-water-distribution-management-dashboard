import axios from "axios";
import { useState, useEffect } from "react";
import "./cities.css";

const Cities = () => {
  const [cities, setCities] = useState([]);
  useEffect(() => {
    axios
      .get("http://localhost:8000/api/city")
      .then((res) => setCities(res.data))
      .catch((err) => console.log(err));
  }, []);
  return (
    <div className="wrapper py-4">
      <h2 className="mb-4">Cities ({cities.length})</h2>
      <div className="city_row">
        {cities.map((city) => (
          <a href={`/city/${city._id}`} key={city._id} className="city_div">
            <h3 className="mb-3">{city.name}</h3>
            <p className="mb-0">Total tanks: {city.tanks?.length}</p>
          </a>
        ))}
      </div>
    </div>
  );
};

export default Cities;
