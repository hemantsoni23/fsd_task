const Table = ({ headers, data, isEditable, actions, newRow, setNewRow }) => (
  <table className="min-w-full bg-gray-100 border">
    <thead>
      <tr>
        {headers.map((header, index) => (
          <th key={index} className="border px-4 py-2">
            {header}
          </th>
        ))}
        {actions && <th className="border px-4 py-2">Actions</th>}
      </tr>
    </thead>
    <tbody>
      {data.map((row, rowIndex) => (
        <tr key={rowIndex}>
          {Object.entries(row).map(([key, value]) => (
            <td key={key} className="border px-4 py-2">
              {isEditable ? (
                <input
                  type="text"
                  value={value}
                  className="w-full bg-transparent border-none"
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
          {actions && (
            <td className="border px-4 py-2">{actions(row)}</td>
          )}
        </tr>
      ))}
      {isEditable && newRow && (
        <tr>
          {headers.map((header) => (
            <td key={header} className="border px-4 py-2">
              <input
                type="text"
                value={newRow[header] || ""}
                className="w-full bg-transparent border-none"
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
);

export default Table;