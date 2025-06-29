import React from "react";
import { motion } from "framer-motion";
import "./waterTank.css"; // Import external CSS

const WaterTank = ({ maxCapacity, currentLevel }) => {
  const levelPercentage =
    maxCapacity > 0 && Number.isFinite(currentLevel)
      ? Math.min((currentLevel / maxCapacity) * 100, 100)
      : 0;
  return (
    <div className="tank_container">
      <div className="tank">
        <motion.div
          className="water"
          animate={{ height: `${levelPercentage}%` }}
          initial={{ height: "0%" }}
          transition={{ duration: 1 }}
        />
      </div>
      <div
        className="progress"
        role="progressbar"
        aria-label="Example with label"
        aria-valuenow={levelPercentage}
        aria-valuemin="0"
        aria-valuemax="100"
      >
        <div className="progress-bar" style={{ width: `${levelPercentage}%` }}>
          {levelPercentage.toFixed(1)}%
        </div>
      </div>
      <p className="status">
        Current Level: {currentLevel}L / {maxCapacity}L
      </p>
    </div>
  );
};

export default WaterTank;
