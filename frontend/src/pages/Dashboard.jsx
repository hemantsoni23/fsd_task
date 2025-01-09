import React, { useEffect, useState } from "react";
import { useDispatch,useSelector } from "react-redux";
import { logout, toggleTheme } from "../redux/AuthSlice";
import { useNavigate } from "react-router-dom";
import Tabs from "../components/Tabs";
import RandomNumberComponent from "../components/RandomNumberComponent";
import Table from "../components/Table";
import ActionButtons from "../components/ActionButtons";
import MessageModal from "../components/MessageModal";
import EditModal from "../components/EditModal";
import axios from "axios";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("randomNumbers");
  const [csvData, setCsvData] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [error, setError] = useState(null);
  const accessToken = useSelector((state) => state.auth.authToken);
  const dispatch = useDispatch();
  const Navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    Navigate("/");
  }

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  }

  // Fetch CSV Data
  const fetchCsvData = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_ROUTE}/api/csv`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setCsvData(response.data.data);
    } catch (error) {
      console.error("Error fetching CSV data:", error);
      setError("Failed to fetch CSV data.");
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
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      fetchCsvData(); 
    } catch (error) {
      setError("Failed to restore CSV data.");
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
      new: true,
    };
    setCsvData((prev) => [...prev, newRow]);
    setShowEditModal(true);
    setSelectedRow(newRow);
  };

  const handleDelete = async (row) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_ROUTE}/api/csv`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: { user: row.user },
      });
      fetchCsvData();
    } catch (error) {
      setError("Failed to delete row.");
      console.error("Error deleting row:", error);
    }
  };

  const handleSaveEdit = async (editedRow) => {
    try {
      if (!editedRow.new) {
        await axios.put(`${process.env.REACT_APP_API_ROUTE}/api/csv`, editedRow, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
      } else {
        delete editedRow.new;
        await axios.post(`${process.env.REACT_APP_API_ROUTE}/api/csv`, editedRow, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
      }
      setShowEditModal(false);
      fetchCsvData();
    } catch (error) {
      setError("Failed to save row.");
      console.error("Error saving row:", error);
    }
  };

  return (
    <div className="min-h-screen p-4 bg-background text-text">
      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} handleLogout={handleLogout} handleThemeToggle={handleThemeToggle} />
      {activeTab === "randomNumbers" && <RandomNumberComponent />}

      {activeTab === "csvFile" && (
        <div className="p-4 bg-hover rounded shadow">
          <div className="flex flex-wrap justify-between mb-4">
            <h2 className="text-lg font-semibold">CSV File</h2>
            <div className="flex flex-wrap gap-2">
              <button
                className="bg-primary text-white px-4 py-2 rounded"
                onClick={() => setShowRestoreModal(true)}
              >
                Restore
              </button>
              <button
                className="bg-secondary text-white px-4 py-2 rounded"
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
          text={selectedRow.user ? "Edit Row" : "Add New Row"}
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
      {(showRestoreModal || error) && (
        <MessageModal
          text={error ? error : `Are you sure you want to restore this table?`}
          button1_text={error ? null : "Cancel"}
          button2_text={error ? "Close" : "Restore"}
          onClose={() => setShowRestoreModal(false)}
          handleAction={error ? ()=>setError(null):() => {
            handleRestore();
            setShowRestoreModal(false);
          }}
        />
      )}
    </div>
  );
};

export default Dashboard;
