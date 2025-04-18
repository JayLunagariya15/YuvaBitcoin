import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const BASEURL = process.env.NEXT_PUBLIC_BASE_URL;

export const useCustomer = () => {
  const [customer, setCustomer] = useState(null);

  const getCustomer = useCallback(async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        // If token is not available, redirect to login page
        window.location.href = "/auth/login/modern"; // Assuming login page route is "/login"
        return;
      }
      const headers = {
        'Authorization': token
      }

      const response = await axios.get(`${BASEURL}/admin/getuserbalance`, {
        headers: headers
      });

      setCustomer(response.data.balance);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    getCustomer();
  }, []);

  return customer;
};
