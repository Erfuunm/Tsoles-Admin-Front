import { useApi } from "@/contexts/ApiProvider";
import React, { useState, useEffect } from "react";

const Logs = () => {
  const [logs, setLogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const api = useApi();

  useEffect(() => {
    const fetchLogs = async () => {
      
      try {
        const response = await api.get(
          `/api/logs/all/?${searchTerm ? `&search=${searchTerm}` : ''}&page=${currentPage}`
        );
        if (response.ok) {
          setLogs(response.body.results);
          setTotalPages(Math.ceil(response.body.count / 10)); // Assuming 10 logs per page
        } else {
          console.error("Error fetching logs");
        }
      } catch (error) {
        console.error("Error fetching logs:", error);
      }
    };

    fetchLogs();
  }, [api, currentPage, searchTerm]);

  // Handle page change
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  return (
    <div className="p-5 rounded-lg shadow-xl bg-[#7D7C7D] dark:bg-primary text-white">
      <div className="flex justify-center mb-8 items-center gap-4">
        <h2 className="text-2xl font-bold">Logs</h2>
      </div>

      <div className="mb-4 w-full flex gap-8">
        <input
          type="text"
          placeholder="Search logs..."
          value={searchTerm}
          onChange={handleSearch}
          className="p-2 w-full rounded bg-gray-700 border border-gray-600 text-white"
        />

        <button
          className="bg-cyan-600 text-white w-1/3 rounded"
          onClick={() =>
            alert("Functionality to add a new log will be implemented soon.")
          }
        >
          Add New Log
        </button>
      </div>

      {logs.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-900 border border-white rounded-lg">
            <thead>
              <tr className="bg-[#AEDFF8] dark:bg-gray-700 text-start text-primary dark:text-gray-200">
                <th className="py-3 text-start pl-4 border-b">ID</th>
                <th className="py-3 text-start pl-4 border-b">Hardware Code</th>
                <th className="py-3 text-start pl-4 border-b">Software Code</th>
                <th className="py-3 text-start pl-4 border-b">Log Text</th>
                <th className="py-3 text-start pl-4 border-b">Created At</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="bg-[#62686b] dark:bg-zinc-800 hover:bg-gray-500 hover:dark:bg-gray-800">
                  <td className="py-2 px-4 border-b border-white">{log.id}</td>
                  <td className="py-2 px-4 border-b border-white">{log.hardwareCode}</td>
                  <td className="py-2 px-4 border-b border-white">{log.softwareCode}</td>
                  <td className="py-2 px-4 border-b border-white">{log.logTxt}</td>
                  <td className="py-2 px-4 border-b border-white">{new Date(log.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No logs found.</p>
      )}

      {/* Pagination Controls */}
      <div className="flex justify-center gap-2 items-center mt-5">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className="bg-cyan-600 text-white py-2 px-4 rounded disabled:bg-gray-600"
        >
          Prev
        </button>

        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="bg-cyan-600 text-white py-2 px-4 rounded disabled:bg-gray-600"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Logs;