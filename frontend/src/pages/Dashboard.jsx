import React, { useEffect, useState } from "react";
import Tabs from "../components/Tabs";
import RandomNumberTable from "../components/RandomNumberTable";
import Table from "../components/Table";
import ActionButtons from "../components/ActionButtons";
import MessageModal from "../components/MessageModal";
import EditModal from "../components/EditModal";
import axios from "axios";
import Cookies from "js-cookie";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("randomNumbers");
  const [csvData, setCsvData] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showRestoreModal, setShowRestoreModal] = useState(false);

  // Fetch CSV Data
  const fetchCsvData = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_ROUTE}/api/csv`, {
        headers: { Authorization: `Bearer ${Cookies.get("accessToken")}` },
      });
      setCsvData(response.data.data);
    } catch (error) {
      console.error("Error fetching CSV data:", error);
    }
  };

  useEffect(() => {
    fetchCsvData();
  }, []);

  const handleRestore = async () => {
    try {
      await axios.post(
        `${process.env.REACT_APP_API_ROUTE}/api/csv/restore`,
        {},
        {
          headers: { Authorization: `Bearer ${Cookies.get("accessToken")}` },
        }
      );
      fetchCsvData(); 
    } catch (error) {
      console.error("Error restoring CSV:", error);
    }
  };


  const handleAddRow = () => {
    const newRow = {
      user: "",
      broker: "",
      "API key": "",
      "API secret": "",
      pnl: 0,
      margin: 0,
      max_risk: 0,
    };
    setCsvData((prev) => [...prev, newRow]);
    setShowEditModal(true);
    setSelectedRow(newRow);
  };


  const handleDelete = async (row) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_ROUTE}/api/csv`, {
        headers: { Authorization: `Bearer ${Cookies.get("accessToken")}` },
        params: { user: row.user },
      });
      fetchCsvData();
    } catch (error) {
      console.error("Error deleting row:", error);
    }
  };


  const handleSaveEdit = async (editedRow) => {
    try {
      if (editedRow.user) {
        await axios.put(`${process.env.REACT_APP_API_ROUTE}/api/csv`, editedRow, {
          headers: { Authorization: `Bearer ${Cookies.get("accessToken")}` },
        });
      } else {
        await axios.post(`${process.env.REACT_APP_API_ROUTE}/api/csv`, editedRow, {
          headers: { Authorization: `Bearer ${Cookies.get("accessToken")}` },
        });
      }
      setShowEditModal(false);
      fetchCsvData();
    } catch (error) {
      console.error("Error saving row:", error);
    }
  };


  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {activeTab === "randomNumbers" && <RandomNumberTable />}

      {activeTab === "csvFile" && (
        <div className="bg-white p-4 rounded shadow">
          <div className="flex justify-between mb-4">
            <h2 className="text-lg font-semibold">CSV File</h2>
            <div>
              <button
                className="bg-green-500 text-white px-4 py-2 rounded mr-2"
                onClick={()=>setShowRestoreModal(true)}
              >
                Restore
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={handleAddRow}
              >
                Add New Row
              </button>
            </div>
          </div>
          <Table
            headers={csvData.length > 0 ? Object.keys(csvData[0]) : []}
            data={csvData}
            actions={(row) => (
              <ActionButtons
                row={row}
                onEdit={() => {
                  setSelectedRow(row);
                  setShowEditModal(true);
                }}
                onDelete={() => {
                  setSelectedRow(row);
                  setShowDeleteModal(true);
                }}
              />
            )}
          />
        </div>
      )}

      {showEditModal && (
        <EditModal
          row={selectedRow}
          onClose={() => setShowEditModal(false)}
          onSave={handleSaveEdit}
        />
      )}

      {showDeleteModal && (
        <MessageModal
          text={`Are you sure you want to delete this row?`}
          button1_text="Cancel"
          button2_text="Delete"
          onClose={() => setShowDeleteModal(false)}
          handleAction={() => {
            handleDelete(selectedRow);
            setShowDeleteModal(false);
          }}
        />
      )}
      {showRestoreModal && (
        <MessageModal
          text={`Are you sure you want to restore this table?`}
          button1_text="Cancel"
          button2_text="Restore"
          onClose={() => setShowRestoreModal(false)}
          handleAction={() => {
            handleRestore();
            setShowRestoreModal(false);
          }}
        />
      )}
    </div>
  );
};

export default Dashboard;
