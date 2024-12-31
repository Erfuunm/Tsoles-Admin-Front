import { useApi } from "@/contexts/ApiProvider";
import React, { useState, useEffect } from "react";

const Meetings = () => {
  const [meetings, setMeetings] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const meetingsPerPage = 12; // Number of meetings to show per page
  const api = useApi();

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const response = await api.get("/api/v1/meetings/");
        if (response.ok) {
          setMeetings(response.body.data);
        } else {
          console.error("Error fetching meetings");
        }
      } catch (error) {
        console.error("Error fetching meetings:", error);
      }
    };

    fetchMeetings();
  }, [api]);

  // Calculate the index of the last meeting on the current page
  const indexOfLastMeeting = currentPage * meetingsPerPage;
  // Calculate the index of the first meeting on the current page
  const indexOfFirstMeeting = indexOfLastMeeting - meetingsPerPage;
  // Get the current meetings
  const currentMeetings = meetings.slice(indexOfFirstMeeting, indexOfLastMeeting);
  
  // Handle page change
  const handleNextPage = () => {
    if (currentPage < Math.ceil(meetings.length / meetingsPerPage)) {
      setCurrentPage(prevPage => prevPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prevPage => prevPage - 1);
    }
  };

  return (
    <div className="p-5">
      <div className="flex justify-center mb-8 items-center gap-4">
        <div className="w-20 md:w-28 h-[0.5px] bg-zinc-600"></div>
        <div className="flex flex-col text-center">
          <h2 className="text-2xl font-bold flex items-center">Meetings</h2>
        </div>
        <div className="w-20 md:w-28 h-[0.5px] bg-zinc-600"></div>
      </div>

      {meetings.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-400 rounded-lg">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="py-3 px-4 border-b">Title</th>
                <th className="py-3 px-4 border-b hidden md:table-cell">Participants</th>
                <th className="py-3 px-4 border-b">Duration (min)</th>
                <th className="py-3 px-4 border-b">Report URL</th>
                <th className="py-3 px-4 border-b hidden md:table-cell">Formatted Time</th>
              </tr>
            </thead>
            <tbody>
              {currentMeetings.map((meeting, index) => (
                <tr key={index} className="hover:bg-gray-100">
                  <td className="py-2 px-4 border-b">{meeting.title}</td>
                  <td className="py-2 px-4 border-b hidden md:table-cell">
                    {meeting.participants.join(", ")}
                  </td>
                  <td className="py-2 px-4 border-b">{meeting.duration}</td>
                  <td className="py-2 px-4 border-b">
                    <a
                      href={meeting.report_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      View Report
                    </a>
                  </td>
                  <td className="py-2 px-4 border-b hidden md:table-cell">
                    {meeting.formatted_time}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No meetings found.</p>
      )}

      {/* Pagination Controls */}
      <div className="flex justify-center gap-2 items-center mt-5">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className="bg-cyan-600 text-black py-2 px-4 rounded disabled:bg-zinc-200"
        >
          Prev
        </button>
 
        <button
          onClick={handleNextPage}
          disabled={currentPage === Math.ceil(meetings.length / meetingsPerPage)}
          className="bg-cyan-600 text-black py-2 px-4 rounded disabled:bg-zinc-200"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Meetings;