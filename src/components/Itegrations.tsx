import React, { useEffect, useState } from "react";
import { useApi } from "@/contexts/ApiProvider"; // Assuming you have an API provider context
import { toast } from "sonner"; // For notifications
import { Button } from "./ui/button"; // Assuming you're using a button component
import { MdContentCopy } from "react-icons/md"; // Icon to copy the webhook URL
import { AiOutlineKey } from "react-icons/ai"; // Icon for API key
import { BiUserCircle } from "react-icons/bi"; // Icon for user info
import { FiRefreshCcw } from "react-icons/fi"; // Icon for refresh

const Integrations = () => {
  const [closeCrmApiKey, setCloseCrmApiKey] = useState("");
  const [userData, setUserData] = useState(null);
  const api = useApi();

  // Fetch user info on component mount
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await api.get("/api/v1/users/info/");
        if (response.ok) {
          setUserData(response.body.data);
        } else {
          toast.error("Failed to fetch user info");
        }
      } catch (error) {
        toast.error("Error fetching user info");
      }
    };

    fetchUserInfo();

    // Load the saved API key from localStorage
    const storedApiKey = localStorage.getItem("close_crm_api_key");
    if (storedApiKey) {
      setCloseCrmApiKey(storedApiKey);
    }
  }, [api]);

  const handleApiKeyChange = (e) => {
    setCloseCrmApiKey(e.target.value);
  };

  const handleApiKeySubmit = async () => {
    try {
      const response = await api.patch("/api/v1/users/profile/update/", {
        close_crm_api_key: closeCrmApiKey,
      });
      if (response.ok) {
        toast.success("API key updated successfully");
        localStorage.setItem("close_crm_api_key", closeCrmApiKey); // Store updated key
      } else {
        toast.error("Failed to update API key");
      }
    } catch (error) {
      toast.error("Error updating API key");
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast.success("Webhook URL copied to clipboard");
      })
      .catch((err) => {
        toast.error("Failed to copy text");
      });
  };

  return (
    <div className="w-full p-6 bg-white border border-zinc-900  rounded-lg shadow-xl">
      <div className="flex justify-center mb-6 mt-2 items-center gap-4">
        <div className="w-20 md:w-28 h-[0.5px] bg-zinc-600"></div>
        <div className="flex flex-col text-center">
          <h2 className="text-2xl font-bold  flex items-center">
            User Profile
          </h2>
        </div>
        <div className="w-20 md:w-28 h-[0.5px] bg-zinc-600"></div>
      </div>
            {/* User Information */}
            {userData && (
        <div className="border mb-8 border-gray-400 p-4 rounded-lg bg-gray-50">
          <h3 className="text-xl font-semibold mb-2">Informations : </h3>
          <p>
            <strong>Email:</strong> {userData.email}
          </p>
          <p>
            
            <strong>First Name:</strong> {userData.first_name}
          </p>
          <p>
            <strong>Last Name:</strong> {userData.last_name}
          </p>
          <div className="flex items-center mt-2">
            <p className="mr-2">
              <strong>Webhook URL:</strong> {userData.read_ai_webhook_url}
            </p>
            <MdContentCopy
              className="text-lg cursor-pointer hover:text-blue-600 transition-colors"
              onClick={() => copyToClipboard(userData.read_ai_webhook_url)}
              title="Copy Webhook URL"
            />
          </div>
        </div>
      )}

      {/* API Key Management */}
      <div className=" p-4 border border-gray-400 mb-4 rounded-lg">
        <label className="flex mb-2 text-sm font-medium text-gray-700  items-center">
          <AiOutlineKey className="mr-1 w-4 h-4" /> Close CRM API Key
        </label>
        <input
          type="text"
          value={closeCrmApiKey}
          onChange={handleApiKeyChange}
          className="border p-2 w-full rounded-md focus:ring focus:ring-blue-300"
        />
        <Button
          className="mt-3 bg-cyan-500 hover:bg-zinc-400 transition duration-200 text-zinc-800"
          onClick={handleApiKeySubmit}
        >
          <FiRefreshCcw className="mr-2" /> Update API Key
        </Button>
      </div>


    </div>
  );
};

export default Integrations;
