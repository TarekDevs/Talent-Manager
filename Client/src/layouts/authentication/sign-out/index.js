import React, { useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:8000/api/auth/signOut'; // Replace with your actual sign-out API endpoint

const LogoutButton = () => {
  const logout = async () => {
    try {
      // Remove items from local storage
      localStorage.removeItem("user");
      localStorage.removeItem("userId");
      localStorage.removeItem("token");

      // Make the API request to sign out
      const response = await axios.post(API_URL);

      // Handle the response
      if (response.status === 200) {
        console.log("User logged out");
        window.location.href = '/authentication/sign-in';
        // You can add additional logic here, such as redirecting to a new page
      } else {
        console.error("Failed to log out:", response.data.message);
        // Handle the error response as needed
      }
    } catch (error) {
      console.error("Error logging out:", error);
      // Handle any network or other errors
    }
  };

  // Call the logout function when the component is mounted
  useEffect(() => {
    logout();
  }, []);

  // You can return null or an empty element if you don't need any content in the component
  return null;
};

export default LogoutButton;
