"use client";

import { useEffect, useRef, useState } from "react";

export default function Loading() {
  const [data, setData] = useState(null);
  useEffect(() => {
    const fetchTechLlama = async () => {
      try {
        const data = await fetch("/api/llama");
        const json = await data.json();
        setData(json);
        console.log("json", json);
      } catch (error) {
        console.error(error);
      }
    };
    fetchTechLlama();
    console.log(data);
  }, []);
  return (
    <div>
      <h1>Loading...</h1>
    </div>
  );
}
