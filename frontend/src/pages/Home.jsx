import { useEffect, useState } from "react";
import api from "../api/axios";

const Home = () => {
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/test");
        setMessage(res.data.message);
      } catch (error) {
        console.error("API Error:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>InSight AI</h1>
      <p>{message}</p>
    </div>
  );
};

export default Home;