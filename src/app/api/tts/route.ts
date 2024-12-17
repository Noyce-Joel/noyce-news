import { NextResponse } from "next/server";

export const maxDuration = 300;
export async function POST(request: Request) {
  const token = process.env.GOOGLE_CLOUD_ACCESS_TOKEN;

  if (!token) {
    return NextResponse.json(
      { error: "Missing Google Cloud access token" },
      { status: 500 }
    );
  }

  const { text } = await request.json();

  if (!text) {
    return NextResponse.json(
      { error: 'Missing "text" in request body' },
      { status: 400 }
    );
  }

  const response = await fetch(
    `https://texttospeech.googleapis.com/v1beta1/text:synthesize?key=${token}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        audioConfig: {
          audioEncoding: "LINEAR16",
          effectsProfileId: ["small-bluetooth-speaker-class-device"],
          pitch: 0,
          speakingRate: 0,
        },
        input: {
          text: text,
        },
        voice: {
          languageCode: "en-US",
          name: "en-US-Journey-D",
        },
      }),
    }
  );

  if (!response.ok) {
    const errorBody = await response.text();
    return NextResponse.json({ error: errorBody }, { status: response.status });
  }

  const data = await response.json();

  return NextResponse.json({ audioContent: data.audioContent });
}
