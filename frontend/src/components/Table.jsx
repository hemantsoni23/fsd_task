import React, { useState } from "react";

const Table = ({ headers, data, isEditable, actions, newRow, setNewRow }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 10;
  const totalPages = Math.ceil(data.length / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = startIndex + entriesPerPage;
  const paginatedData = data.slice(startIndex, endIndex);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="overflow-x-auto bg-background">
      <table className="min-w-full border border-border">
        <thead>
          <tr className="bg-hover">
            {headers.map((header, index) => (
              <th key={index} className="border border-border px-4 py-2 text-sm lg:text-base text-text">
                {header.toUpperCase()}
              </th>
            ))}
            {actions && (
              <th className="border border-border px-4 py-2 text-sm lg:text-base text-text">Actions</th>
            )}
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((row, rowIndex) => (
            <tr key={rowIndex} className="text-sm lg:text-base hover:bg-hover">
              {Object.entries(row).map(([key, value]) => (
                <td key={key} className="border px-4 py-2 text-text text-center">
                  {isEditable ? (
                    <input
                      type="text"
                      value={value}
                      className="w-full border-none"
                      onChange={(e) =>
                        setNewRow((prev) => ({
                          ...prev,
                          [key]: e.target.value,
                        }))
                      }
                    />
                  ) : (
                    value
                  )}
                </td>
              ))}
              {actions && <td className="border px-4 py-2 text-text">{actions(row)}</td>}
            </tr>
          ))}
          {isEditable && newRow && (
            <tr>
              {headers.map((header) => (
                <td key={header} className="border px-4 py-2">
                  <input
                    type="text"
                    value={newRow[header] || ""}
                    className="w-full border-none"
                    onChange={(e) =>
                      setNewRow((prev) => ({
                        ...prev,
                        [header]: e.target.value,
                      }))
                    }
                  />
                </td>
              ))}
            </tr>
          )}
        </tbody>
      </table>
      <div className="flex justify-between items-center mt-4">
        <button
          className="px-4 py-2 rounded disabled:opacity-50"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="px-4 py-2 rounded disabled:opacity-50"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Table;