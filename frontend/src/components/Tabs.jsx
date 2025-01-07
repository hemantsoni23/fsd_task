const Tabs = ({ activeTab, setActiveTab }) => (
  <div className="flex justify-center mb-4">
    <button
      className={`px-4 py-2 mx-2 ${
        activeTab === "randomNumbers"
          ? "bg-blue-500 text-white"
          : "bg-white text-blue-500"
      } border rounded`}
      onClick={() => setActiveTab("randomNumbers")}
    >
      Random Numbers
    </button>
    <button
      className={`px-4 py-2 mx-2 ${
        activeTab === "csvFile"
          ? "bg-blue-500 text-white"
          : "bg-white text-blue-500"
      } border rounded`}
      onClick={() => setActiveTab("csvFile")}
    >
      CSV File
    </button>
  </div>
);

export default Tabs;
