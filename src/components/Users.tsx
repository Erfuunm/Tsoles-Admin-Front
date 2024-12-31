import { useApi } from "@/contexts/ApiProvider";
import React, { useState, useEffect } from "react";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const api = useApi();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        
        const response = await api.get(`/api/users/?${searchTerm ? `&search=${searchTerm}` : ''}&page=${currentPage}`);
        if (response.ok) {
          setUsers(response.body.results);
          setTotalPages(Math.ceil(response.body.count / 10)); // Assuming 10 users per page
        } else {
          console.error("Error fetching users");
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, [api, currentPage, searchTerm]);

  // Handle page change
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prevPage => prevPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prevPage => prevPage - 1);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  return (
    <div className="p-5 bg-gray-800 text-white">
      <div className="flex justify-center mb-8 items-center gap-4">
        <h2 className="text-2xl font-bold">Users</h2>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={handleSearch}
          className="p-2 rounded bg-gray-700 border border-gray-600 text-white"
        />
      </div>

      {users.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-900 border border-gray-700 rounded-lg">
            <thead>
              <tr className="bg-gray-700 text-gray-200">
                <th className="py-3 px-4 border-b">ID</th>
                <th className="py-3 px-4 border-b">Username</th>
                <th className="py-3 px-4 border-b">Email</th>
                <th className="py-3 px-4 border-b">Phone Number</th>
                <th className="py-3 px-4 border-b">Serial Number</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-800">
                  <td className="py-2 px-4 border-b">{user.id}</td>
                  <td className="py-2 px-4 border-b">{user.username}</td>
                  <td className="py-2 px-4 border-b">{user.email}</td>
                  <td className="py-2 px-4 border-b">{user.phone_number || "N/A"}</td>
                  <td className="py-2 px-4 border-b">{user.serial_number || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No users found.</p>
      )}

      {/* Pagination Controls */}
      <div className="flex justify-center gap-2 items-center mt-5">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className="bg-cyan-600 text-black py-2 px-4 rounded disabled:bg-gray-600"
        >
          Prev
        </button>
 
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="bg-cyan-600 text-black py-2 px-4 rounded disabled:bg-gray-600"
        >
          Next
        </button>
      </div>

      {/* Add User Button */}
      <div className="mt-5">
        <button
          className="bg-green-600 text-white py-2 px-4 rounded"
          onClick={() => alert("Functionality to add a new user will be implemented soon.")}
        >
          Add New User
        </button>
      </div>
    </div>
  );
};

export default Users;