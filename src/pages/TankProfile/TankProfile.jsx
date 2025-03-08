import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./tankProfile.css"; // Import CSS for styling
import WaterTank from "../../components/WaterTank/WaterTank";

const TankProfile = () => {
  const [tank, setTank] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/tank/${id}`)
      .then((res) => {
        setTank(res.data);
        console.log(res.data);
      })
      .catch((error) => {
        console.error("Error fetching tank data:", error);
      });
  }, [id]);

  if (!tank) {
    return <p className="loading">Loading...</p>;
  }

  const latitude = tank.coordinates?.latitude;
  const longitude = tank.coordinates?.longitude;

  if (!latitude || !longitude) {
    return <p className="error">Coordinates not available.</p>;
  }

  const mapSrc = `https://www.google.com/maps?q=${latitude},${longitude}&hl=en&z=14&output=embed`;

  return (
    <div className="wrapper tank_profile py-4">
      <div className="tank_profile_info">
        <div className="tank_details">
          <h2 className="title">Tank Information</h2>
          <p className="">
            <strong>Owner:</strong>{" "}
            <a className="text-info" href={`/customer/${tank.owner?._id}`}>
              {tank.owner?.name}
            </a>
          </p>
          <p className="">
            <strong>City:</strong>{" "}
            <a className="text-info" href={`/city/${tank.city?._id}`}>
              {tank.city?.name}
            </a>
          </p>
          <p className="">
            <strong>Current Level:</strong> {tank.current_level} liters
          </p>
          <p className="">
            <strong>Max Capacity:</strong> {tank.max_capacity} liters
          </p>
          <p className="">
            <strong>Monthly Capacity:</strong> {tank.monthly_capacity} liters
          </p>
          <p className="mb-0">
            <strong>Family members:</strong> {tank.family_members?.length}
          </p>
        </div>
        <div className="map-container">
          <h2 className="title">Tank Location</h2>
          <iframe
            src={mapSrc}
            width="100%"
            height="350"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
      <div className="tank_profile_tank_info">
        <WaterTank />
        <div>
          <h2 className="title">Water Usage</h2>
          <p>
            <strong>Last Water Usage:</strong> {tank.last_water_usage} liters
          </p>
          <p>
            <strong>Last Water Usage Date:</strong>{" "}
            {new Date(tank.last_water_usage_date).toLocaleString()}
          </p>
        </div>
      </div>
      <div className="tank_profile_tank_family">
        <h2 className="title">
          Family Members ({tank.family_members?.length})
        </h2>
        <div className="family_members_div">
          {tank.family_members?.map((member) => {
            // Function to calculate age
            const calculateAge = (dob) => {
              const birthDate = new Date(dob);
              const today = new Date();
              let age = today.getFullYear() - birthDate.getFullYear();
              const monthDiff = today.getMonth() - birthDate.getMonth();
              if (
                monthDiff < 0 ||
                (monthDiff === 0 && today.getDate() < birthDate.getDate())
              ) {
                age--;
              }
              return age;
            };

            return (
              <div key={member._id} className="family_member_div">
                <h5 className="mb-2">ID: {member.identity_id}</h5>
                <h5 className="mb-3">Name: {member.name}</h5>
                <p className="mb-2">Gender: {member.gender}</p>
                <p className="mb-2">Age: {calculateAge(member.dob)}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TankProfile;
