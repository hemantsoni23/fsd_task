import React, { useState } from "react";
import Tabs from "../components/Tabs";
import RandomNumberTable from "../components/RandomNumberTable";
import Table from "../components/Table";
import ActionButtons from "../components/ActionButtons";
import axios from "axios";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("randomNumbers");
  const [csvData, setCsvData] = useState([]);
  const [newRow, setNewRow] = useState({});

  // Fetch CSV Data
  const fetchCsvData = async () => {
    try {
      const response = await axios.get("/csv");
      setCsvData(response.data.data);
    } catch (error) {
      console.error("Error fetching CSV data:", error);
    }
  };

  // Handle Add New Row
  const handleAddRow = async () => {
    try {
      await axios.post("/csv", newRow);
      setNewRow({});
      fetchCsvData();
    } catch (error) {
      console.error("Error adding row:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {activeTab === "randomNumbers" && (
        <RandomNumberTable />
      )}

      {activeTab === "csvFile" && (
        <div className="bg-white p-4 rounded shadow">
          <div className="flex justify-between mb-4">
            <h2 className="text-lg font-semibold">CSV File</h2>
            <button
              className="bg-green-500 text-white px-4 py-2 rounded"
              onClick={handleAddRow}
            >
              Add New Row
            </button>
          </div>
          <Table
            headers={csvData.length > 0 ? Object.keys(csvData[0]) : []}
            data={csvData}
            isEditable
            newRow={newRow}
            setNewRow={setNewRow}
            actions={(row) => (
              <ActionButtons
                row={row}
                fetchData={fetchCsvData}
              />
            )}
          />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
