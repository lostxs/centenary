import "server-only";

import { PutObjectCommand } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";

import { createS3Client } from "./client";

export async function putObjectUpload(
  buffer: Buffer,
  mimetype: string,
  key: string,
  bucket: string,
) {
  try {
    const client = createS3Client();

    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: buffer,
      ContentType: mimetype,
    });

    const response = await client.send(command);

    return response;
  } catch (error) {
    if (error instanceof Error) {
      return error.message;
    }
    return "Failed to upload file";
  }
}

export async function upload(
  buffer: Buffer,
  mimetype: string,
  key: string,
  bucket: string,
) {
  const client = createS3Client();

  const upload = new Upload({
    client,
    params: {
      Bucket: bucket,
      Key: key,
      Body: buffer,
      ContentType: mimetype,
    },
  });

  const response = await upload.done();

  return response;
}
