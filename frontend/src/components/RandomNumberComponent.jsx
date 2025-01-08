import React, { useEffect, useState, useMemo } from "react";
import Table from "./Table";
import { useSelector } from "react-redux";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
} from "chart.js";

ChartJS.register(LineElement, PointElement, LinearScale, Title, CategoryScale);

const formatTimestamp = (timestamp) => {
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZoneName: "short",
  };
  const date = new Date(timestamp);
  return new Intl.DateTimeFormat("en-US", options).format(date);
};

const ChartView = ({ chartData }) => (
  <div className="mb-6 chart-container">
    <Line data={chartData} />
    <div className="text-center text-muted sm:hidden mt-4">
      Please use a larger screen to see the chart.
    </div>
  </div>
);

const TableView = ({ sortedData, formatTimestamp, sortOrder, handleSort }) => (
  <div>
    <div className="flex justify-end mb-4">
      <button
        className="bg-secondary text-white px-4 py-2 rounded"
        onClick={handleSort}
      >
        Sort by {sortOrder === "asc" ? "Descending" : "Ascending"}
      </button>
    </div>
    <Table
      headers={["Timestamp", "Random Number"]}
      data={sortedData.map((item) => ({
        Timestamp: formatTimestamp(item.timestamp),
        "Random Number": item.number,
      }))}
    />
  </div>
);

const RandomNumberComponent = () => {
  const [randomNumbers, setRandomNumbers] = useState([]);
  const [sortOrder, setSortOrder] = useState("asc");
  const [activeTab, setActiveTab] = useState("table");
  const accessToken = useSelector((state) => state.auth.authToken);

  const handleSort = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  useEffect(() => {
    const ws = new WebSocket(
      `${process.env.REACT_APP_WS_ROUTE}/random_numbers?token=${accessToken}`
    );

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setRandomNumbers(data);
    };

    return () => ws.close();
  }, [accessToken]);

  const sortedData = useMemo(() => {
    const sorted = [...randomNumbers];
    sorted.sort((a, b) => {
      if (sortOrder === "asc") return new Date(a.timestamp) - new Date(b.timestamp);
      return new Date(b.timestamp) - new Date(a.timestamp);
    });
    return sorted;
  }, [randomNumbers, sortOrder]);

  const chartData = useMemo(() => {
    return {
      labels: randomNumbers.map((item) => formatTimestamp(item.timestamp)),
      datasets: [
        {
          label: "Random Numbers",
          data: randomNumbers.map((item) => item.number),
          borderColor: "rgba(75,192,192,1)",
          backgroundColor: "rgba(75,192,192,0.2)",
          tension: 0.4,
        },
      ],
    };
  }, [randomNumbers]);

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-lg font-semibold mb-4">Random Numbers</h2>
      <div className="flex justify-center space-x-4 mb-4">
        <button
          className={`px-4 py-2 rounded ${
            activeTab === "table"
              ? "bg-primary text-white"
              : "bg-muted text-black"
          }`}
          onClick={() => setActiveTab("table")}
        >
          Table
        </button>
        <button
          className={`px-4 py-2 rounded ${
            activeTab === "chart"
              ? "bg-primary text-white"
              : "bg-muted text-black"
          }`}
          onClick={() => setActiveTab("chart")}
        >
          Chart
        </button>
      </div>
      {activeTab === "chart" ? (
        <ChartView chartData={chartData} />
      ) : (
        <TableView
          sortedData={sortedData}
          formatTimestamp={formatTimestamp}
          sortOrder={sortOrder}
          handleSort={handleSort}
        />
      )}
    </div>
  );
};

export default RandomNumberComponent;
