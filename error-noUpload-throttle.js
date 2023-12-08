const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const fs = require('fs');
const throttle = require('throttle');

const credentials = {
  accessKeyId: '',
  secretAccessKey: '',
};

const s3 = new S3Client({ region: 'ap-southeast-1', credentials });

const uploadWithThrottle = async (s3Params, uploadRate) => {
  // Create a readable stream from the file
  const fileStream = fs.createReadStream(s3Params.Body);

  // Create a writable stream with throttling
  const throttleStream = throttle(uploadRate);

  // Pipe the file stream through the throttled stream
  fileStream.pipe(throttleStream);

  // Set the Body property of s3Params to the throttled stream
  s3Params.Body = throttleStream;

  // Execute the upload
  try {
    await s3.send(new PutObjectCommand(s3Params));
    console.log('File uploaded successfully.');
  } catch (error) {
    console.error('Error uploading file:', error);
  }
};

// Specify your S3 parameters
const s3Params = {
  Bucket: 'raftestbucketpiad',
  Key: 'file.txt',
  Body: "C:/Users/watch/file.txt", // Use the file path directly
};

// Specify the desired upload rate (e.g., 100 KB/s)
const uploadRate = 5000 * 1024; //  KB/s

// Call the uploadWithThrottle function
uploadWithThrottle(s3Params, uploadRate);