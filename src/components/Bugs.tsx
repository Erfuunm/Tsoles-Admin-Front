import { useApi } from "@/contexts/ApiProvider";
import React, { useState, useEffect } from "react";

const Bugs = () => {
  const [bugs, setBugs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const api = useApi();

  useEffect(() => {
    const fetchBugs = async () => {
      try {
        const response = await api.get(
          `/api/bugs/all/?search=${searchTerm}&page=${currentPage}`
        );
        if (response.ok) {
          setBugs(response.body.results);
          setTotalPages(Math.ceil(response.body.count / 10)); // Assuming 10 bugs per page
        } else {
          console.error("Error fetching bugs");
        }
      } catch (error) {
        console.error("Error fetching bugs:", error);
      }
    };

    fetchBugs();
  }, [api, currentPage, searchTerm]);

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
        <h2 className="text-2xl font-bold">Bugs</h2>
      </div>

      <div className="mb-4 w-full flex gap-8">
        <input
          type="text"
          placeholder="Search bugs..."
          value={searchTerm}
          onChange={handleSearch}
          className="p-2 w-full rounded bg-gray-700 border border-gray-600 text-white"
        />
        <button
          className="bg-cyan-600 text-white w-1/3 rounded"
          onClick={() =>
            alert("Functionality to add a new bug will be implemented soon.")
          }
        >
          Add New Bug
        </button>
      </div>

      {bugs.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-700 border border-white rounded-lg">
            <thead>
              <tr className="bg-[#AEDFF8] dark:bg-gray-700 text-start text-primary dark:text-gray-200">
                <th className="py-3 text-start pl-4 border-b">ID</th>
                <th className="py-3 text-start pl-4 border-b">Hardware Code</th>
                <th className="py-3 text-start pl-4 border-b">Software Code</th>
                <th className="py-3 text-start pl-4 border-b">Bug Text</th>
                <th className="py-3 text-start pl-4 border-b">Created At</th>
              </tr>
            </thead>
            <tbody>
              {bugs.map((bug) => (
                <tr key={bug.id} className="bg-[#62686b] dark:bg-zinc-800 hover:bg-gray-500 hover:dark:bg-gray-800">
                  <td className="py-2 px-4 border-b border-white">{bug.id}</td>
                  <td className="py-2 px-4 border-b border-white">{bug.hardwareCode}</td>
                  <td className="py-2 px-4 border-b border-white">{bug.softwareCode}</td>
                  <td className="py-2 px-4 border-b border-white">{bug.bugTxt}</td>
                  <td className="py-2 px-4 border-b border-white">{new Date(bug.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No bugs found.</p>
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

export default Bugs;