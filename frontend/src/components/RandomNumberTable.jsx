import React, { useEffect, useState, useMemo } from "react";
import Table from "./Table";
import Cookies from "js-cookie";

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

const RandomNumberTable = () => {
  const [randomNumbers, setRandomNumbers] = useState([]);
  const [sortOrder, setSortOrder] = useState("asc");

  const handleSort = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  useEffect(() => {
    const ws = new WebSocket(`${process.env.REACT_APP_WS_ROUTE}/random_numbers?token=${Cookies.get("accessToken")}`);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setRandomNumbers(data);
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed.");
    };

    return () => ws.close();
  }, []);

  const sortedData = useMemo(() => {
    const sorted = [...randomNumbers];
    sorted.sort((a, b) => {
      if (sortOrder === "asc") return new Date(a.timestamp) - new Date(b.timestamp);
      return new Date(b.timestamp) - new Date(a.timestamp);
    });
    return sorted;
  }, [randomNumbers, sortOrder]);

  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="flex flex-wrap justify-between mb-4">
        <h2 className="text-lg font-semibold">Random Numbers</h2>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
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
};

export default RandomNumberTable;
