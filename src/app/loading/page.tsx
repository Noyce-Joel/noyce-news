"use client";

import { useRef, useState } from "react";

export default function SpeakBox() {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleSpeak = async () => {
    try {
      setIsLoading(true);

      // 1) Send POST to SSE endpoint
      const response = await fetch(
        "https://eu-west-1.api.neuphonic.com/sse/speak/en", 
        {
          method: "POST",
          headers: {
            "x-api-key": "6844934deea2375814ad347bc4d215b9bc03cfe05d1d7e4681c4e15e93249009.cfef70e6-57a1-42d6-b645-0e96d0e108c1",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text,
            model: {
              model: "neu_hq",
              voice: "f8698a9e-947a-43cd-a897-57edd4070a78",
            },
          }),
        }
      );

      console.log("HTTP status:", response.status);
      console.log("HTTP status text:", response.statusText);

      // 2) If it's not OK, bail
      if (!response.ok) {
        throw new Error(`TTS request failed with status ${response.status} ${response.statusText}`);
      }

      // 3) Attempt to read the whole response as a Blob
      const audioBlob = await response.blob();
      console.log("Blob type:", audioBlob.type);
      console.log("Blob size:", audioBlob.size);

      // Optional: convert the Blob to an ArrayBuffer to see its size in bytes
      const arrayBuffer = await audioBlob.arrayBuffer();
      console.log("ArrayBuffer byte length:", arrayBuffer.byteLength);

      // 4) If the blob is empty or not audio, playback won't work
      if (audioBlob.size === 0) {
        throw new Error("Received an empty Blob. Possibly the SSE is not returning raw audio.");
      }

      // 5) Create a local URL from the blob
      const objectUrl = URL.createObjectURL(audioBlob);
      console.log("Object URL:", objectUrl);

      // 6) Try opening the URL in a new tab to see if it plays (debugging only)
      // window.open(objectUrl, "_blank");

      // 7) Play the audio
      if (audioRef.current) {
        audioRef.current.src = objectUrl;
        await audioRef.current.play();
        console.log("Playback started!");
      }
    } catch (error) {
      console.error("Error generating or playing audio:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: 20 }}>
      <h2>Speak with Neuphonic</h2>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={5}
        cols={50}
        style={{ width: "100%", marginBottom: 10 }}
        placeholder="Type text to speak..."
      />
      <br />
      <button 
        onClick={handleSpeak} 
        disabled={isLoading} 
        style={{ padding: "8px 16px", cursor: "pointer" }}
      >
        {isLoading ? "Generating..." : "Speak"}
      </button>

      <audio 
        ref={audioRef} 
        controls 
        style={{ width: "100%", marginTop: 20 }}
      >
        Your browser does not support the <code>audio</code> element.
      </audio>
    </div>
  );
}
