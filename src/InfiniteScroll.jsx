import React, { useState, useEffect } from "react";
import axios from "axios";

const InfiniteScroll = () => {
  const [data, setData] = useState([]); // Store API data
  const [page, setPage] = useState(1); // Track current page
  const [loading, setLoading] = useState(false); // Loading state
  const [hasMore, setHasMore] = useState(true); // If more data is available

  const API_URL = `https://jsonplaceholder.typicode.com/posts`; // Example API

  // Fetch data from the API
  const fetchData = async () => {
    if (loading) return;

    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}?_page=${page}&_limit=10`); // Pagination support
      const newData = response.data;

      if (newData.length === 0) {
        setHasMore(false); // No more data
      } else {
        setData((prev) => [...prev, ...newData]); // Append new data
        setPage((prev) => prev + 1); // Increment page
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setLoading(false);
  };

  // Detect when user scrolls to the bottom
  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 50 &&
      hasMore
    ) {
      fetchData();
    }
  };

  useEffect(() => {
    fetchData(); // Initial data load
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore]);

  return (
    <div>
      <h1>Infinite Scroll Example</h1>
      <ul>
        {data.map((item, index) => (
          <li key={`${item.id}-${index}`}>
            <h2>{item.title}</h2>
            <p>{item.body}</p>
          </li>
        ))}
      </ul>
      {loading && <p>Loading...</p>}
      {!hasMore && <p>No more data to load</p>}
    </div>
  );
};

export default InfiniteScroll;
