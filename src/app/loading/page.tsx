"use client";

import { useEffect, useRef, useState } from "react";

export default function Loading() {
  const [data, setData] = useState(null);
  const [data2, setData2] = useState(null);
  useEffect(() => {
    const fetchTechLlama = async () => {
      try {
        const data = await fetch("/api/gov-uk/environment");
        const data2 = await fetch("/api/gov-uk/business-and-industry");
        const json = await data.json();
        const json2 = await data2.json();
        setData(json);
        setData2(json2);
        console.log("json", json);
        console.log("json2", json2);
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
