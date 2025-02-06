"use client";

import { useEffect, useRef, useState } from "react";

export default function Loading() {
  const [data, setData] = useState(null);
  const [data2, setData2] = useState(null);
  useEffect(() => {
    const fetchTechLlama = async () => {
      try {
        const data = await fetch("/api/run-crew");
        const json = await data.json();
        setData(json);
        console.log("json", json);
      } catch (error) {
        console.error(error);
      }
    };
    fetchTechLlama();
    console.log("data", data);
    console.log("data2", data2);
  }, []);
  return (
    <div>
      <h1>Loading...</h1>
      <div></div>
    </div>
  );
}
