import { useState, useEffect } from "react";
import axios from "axios";

function useFlip(initialState = true) {
  const [isFlipped, setFlipped] = useState(initialState);

  const flip = () => {
    setFlipped((isUp) => !isUp);
  };
  return [isFlipped, flip];
}

function useAxios(key, baseUrl, initVal = []) {
  const [responses, setResponses] = useState(() => {
    const currData = localStorage.getItem(key);

    return currData ? JSON.parse(currData) : initVal;
  });

  const addLocalStorage = async (
    formatter = (data) => data,
    particalUrl = ""
  ) => {
    try {
      const res = await axios.get(`${baseUrl}${particalUrl}`);
      const formattedData = formatter(res.data);
      setResponses((prevData) => [...prevData, formattedData]);
      localStorage.setItem(key, JSON.stringify([...responses, formattedData]));
    } catch (err) {
      console.error("Could not fetch data", err);
    }
  };

  const clearResponses = () => {
    setResponses([]);
    localStorage.removeItem(key);
  };

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(responses));
  }, [responses, key]);

  return [responses, addLocalStorage, clearResponses];
}

export { useFlip, useAxios };
