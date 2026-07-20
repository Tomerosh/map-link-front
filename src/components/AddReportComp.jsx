import { useState } from "react";
import { AddReport } from "../api/mapData.js";
import policeIcon from "../assets/police-pin.svg"
const AddReportComp = ({ latitude, longitude }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const reportTypes = [
    {"POLICE": policeIcon},
    "FLOODING",
    "ROAD_DANGER",
    "TRAFFIC_JAM",
    "MISSING_SIGN",
    "CAR_ACCIDENT",
    "CONSTRUCTION",
    "SPEED_CAMERA"
  ];

  const handleReportSubmit = async (reportType) => {
    setLoading(true);
    setMessage("");

    try {
      await AddReport({
        report_type: reportType,
        latitude,
        longitude
      });
      setMessage("Report sent successfully!");
    } catch (error) {
      console.error(error);
      setMessage("Error sending report.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="report-panel">
      <h3>Select Report Type</h3>
      
      <div className="report-options">
        {reportTypes.map((type) => (
          <button
            className="report-option"
            key={type}
            disabled={loading}
            onClick={() => handleReportSubmit(type)}
          >
            {type}
          </button>
        ))}
      </div>

      {message && <p className="form-message">{message}</p>}
    </div>
  );
};

export default AddReportComp;
