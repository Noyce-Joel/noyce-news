import { NextResponse } from "next/server";
import {
  S3Client,
  PutObjectCommand,
  HeadObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const maxDuration = 300;

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function POST(request: Request) {
  const token = process.env.GOOGLE_CLOUD_ACCESS_TOKEN;
  const bucketName = process.env.AWS_S3_BUCKET_NAME;
  const OBJECT_KEY = "summaries/latest-summary.wav";
  if (!token) {
    return NextResponse.json(
      { error: "Missing Google Cloud access token" },
      { status: 500 }
    );
  }

  if (!bucketName) {
    return NextResponse.json(
      { error: "Missing S3 bucket name" },
      { status: 500 }
    );
  }

  // Get the most recent headline
  const latestHeadline = await prisma.headlines.findFirst({
    orderBy: { createdAt: 'desc' },
    take: 1,
  });

  if (!latestHeadline) {
    return NextResponse.json(
      { error: "No headlines found" },
      { status: 404 }
    );
  }

  const response = await fetch(
    `https://texttospeech.googleapis.com/v1beta1/text:synthesize?key=${token}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        audioConfig: {
          audioEncoding: "LINEAR16",
          effectsProfileId: ["small-bluetooth-speaker-class-device"],
          pitch: 0,
          speakingRate: 0,
        },
        input: { text: latestHeadline.headlines },
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
  if (!data.audioContent) {
    throw new Error("TTS API did not return audio content");
  }

  // Convert audio content from base64 to binary
  const audioBuffer = Buffer.from(data.audioContent, "base64");

  // Check if the object already exists
  try {
    console.log(`Checking if ${OBJECT_KEY} exists...`);
    await s3.send(
      new HeadObjectCommand({
        Bucket: bucketName,
        Key: OBJECT_KEY,
      })
    );

    console.log("File exists. Deleting the existing file...");
    // File exists, delete it
    await s3.send(
      new DeleteObjectCommand({
        Bucket: bucketName,
        Key: OBJECT_KEY,
      })
    );
  } catch (err: any) {
    if (err.name === "NotFound") {
      console.log("File does not exist. Proceeding to upload...");
    } else {
      console.error("Error checking object existence:", err);
      throw err;
    }
  }

  // Upload the new audio file
  console.log("Uploading new audio file...");
  await s3.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: OBJECT_KEY,
      Body: audioBuffer,
      ContentType: "audio/wav",
    })
  );

  // Generate the S3 URL for the uploaded file
  const s3Url = `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${OBJECT_KEY}`;

  return NextResponse.json({ url: s3Url });
}
