import { useApi } from "@/contexts/ApiProvider";
import React, { useState, useEffect } from "react";

const Tickets = () => {
  const [tickets, setTickets] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const api = useApi();

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await api.get(
          `/api/tickets/?${
            searchTerm ? `&search=${searchTerm}` : ""
          }&page=${currentPage}`
        );
        if (response.ok) {
          setTickets(response.body.results);
          setTotalPages(Math.ceil(response.body.count / 10)); // Assuming 10 tickets per page
        } else {
          console.error("Error fetching tickets");
        }
      } catch (error) {
        console.error("Error fetching tickets:", error);
      }
    };

    fetchTickets();
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
    <div className="p-5 rounded-lg shadow-xl bg-gray-800 text-white">
      <div className="flex justify-center mb-8 items-center gap-4">
        <h2 className="text-2xl font-bold">Tickets</h2>
      </div>

      <div className="mb-4 w-full flex gap-8">
        <input
          type="text"
          placeholder="Search tickets..."
          value={searchTerm}
          onChange={handleSearch}
          className="p-2 w-full rounded bg-gray-700 border border-gray-600 text-white"
        />
        <button
          className="bg-cyan-600 text-white w-1/3 rounded"
          onClick={() =>
            alert("Functionality to add a new ticket will be implemented soon.")
          }
        >
          Add New Ticket
        </button>
      </div>

      {tickets.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-900 border border-gray-700 rounded-lg">
            <thead>
              <tr className="bg-gray-700 text-start text-gray-200">
                <th className="py-3 text-start pl-4 border-b">ID</th>
                <th className="py-3 text-start pl-4 border-b">Customer Username</th>
                <th className="py-3 text-start pl-4 border-b">Title</th>
                <th className="py-3 text-start pl-4 border-b">Body</th>
                <th className="py-3 text-start pl-4 border-b">Created At</th>
                <th className="py-3 text-start pl-4 border-b">Active</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket) => (
                <tr key={ticket.id} className="bg-zinc-800 hover:bg-gray-800">
                  <td className="py-2 px-4 border-b">{ticket.id}</td>
                  <td className="py-2 px-4 border-b">{ticket.customer_username}</td>
                  <td className="py-2 px-4 border-b">{ticket.title}</td>
                  <td className="py-2 px-4 border-b">{ticket.body}</td>
                  <td className="py-2 px-4 border-b">{new Date(ticket.created_at).toLocaleString()}</td>
                  <td className="py-2 px-4 border-b">{ticket.active ? "Yes" : "No"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No tickets found.</p>
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

export default Tickets;