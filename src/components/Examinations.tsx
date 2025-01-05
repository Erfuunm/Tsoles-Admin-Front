import { useApi } from "@/contexts/ApiProvider";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Examinations = () => {
  const [examinations, setExaminations] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const api = useApi();

  useEffect(() => {
    const fetchExaminations = async () => {
      try {
        const response = await api.get(
          `/api/examinations/?${
            searchTerm ? `search=${searchTerm}&` : ""
          }page=${currentPage}`
        );
        if (response.ok) {
          setExaminations(response.body.results);
          setTotalPages(Math.ceil(response.body.count / 10)); // Assuming 10 examinations per page
        } else {
          console.error("Error fetching examinations");
        }
      } catch (error) {
        console.error("Error fetching examinations:", error);
      }
    };

    fetchExaminations();
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
        <h2 className="text-2xl font-bold">Examinations</h2>
      </div>

      <div className="mb-4 w-full flex gap-8">
        <input
          type="text"
          placeholder="Search examinations..."
          value={searchTerm}
          onChange={handleSearch}
          className="p-2 w-full rounded dark:bg-gray-700 border border-gray-600 text-white"
        />

        <button
          className="bg-[#036597] dark:bg-cyan-600 text-white w-1/3 rounded"
          onClick={() =>
            alert(
              "Functionality to add a new examination will be implemented soon."
            )
          }
        >
          Add New Examination
        </button>
      </div>

      {examinations.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-900 border border-white rounded-lg">
            <thead>
              <tr className=" bg-[#AEDFF8] dark:bg-gray-700 text-start text-primary dark:text-gray-200">
                <th className="py-3 text-start pl-4 border-b">ID</th>
                <th className="py-3 text-start pl-4 border-b">
                  Customer Username
                </th>
                <th className="py-3 text-start pl-4 border-b">Dataset</th>
                <th className="py-3 text-start pl-4 border-b">Design Title</th>
                <th className="py-3 text-start pl-4 border-b">Last UID</th>
                <th className="py-3 text-start pl-4 border-b">Download Link</th>
              </tr>
            </thead>
            <tbody>
              {examinations.map((exam) => (
                <tr key={exam.id} className="bg-[#62686b] dark:bg-zinc-800 hover:bg-gray-500 hover:dark:bg-gray-800">
                  <td className="py-2 px-4 border-b border-white">{exam.id}</td>
                  <td className="py-2 px-4 border-b border-white">
                    {exam.customer_username}
                  </td>
                  <td className="py-2 px-4 border-b border-white">{exam.dataset}</td>
                  <td className="py-2 px-4 border-b border-white">{exam.design_title}</td>
                  <td className="py-2 px-4 border-b border-white">{exam.last_uid}</td>
                  <td className="py-2 px-4 border-b border-white">
             
                    <Link to={`/stl-viewer/${exam.id}`}>see</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No examinations found.</p>
      )}

      {/* Pagination Controls */}
      <div className="flex justify-center gap-2 items-center mt-5">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className="bg-cyan-600 text-white py-2 px-4 rounded disabled:bg-[#036597] disabled:dark:bg-gray-600 disabled:opacity-60"
        >
          Prev
        </button>

        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="bg-cyan-600  text-white py-2 px-4 rounded disabled:bg-[#036597] disabled:dark:bg-gray-600 disabled:opacity-60"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Examinations;
