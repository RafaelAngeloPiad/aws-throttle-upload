const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { Upload } = require("@aws-sdk/lib-storage");
const fs = require('fs');
const progress = require('progress');

const credentials = {
  accessKeyId: '',
  secretAccessKey: '',
};

const bytesToMegabytes = (bytes) => {
  return bytes / (1024 * 1024);
};

const bytesToKilobytes = (bytes) => {
  return bytes / 1024;
};

// Create an S3 client
const s3 = new S3Client({ region: 'ap-southeast-1', credentials });

// Function to upload with throttling and progress bar
const uploadWithProgress = async (s3Params) => {
  const fileSize = fs.statSync(s3Params.Body).size;

  // Initialize the progress bar
  const progressBar = new progress('Uploading [:bar] :percent :etas :speed KBps', {
    complete: '=',
    incomplete: ' ',
    width: 20,
    total: fileSize,
  });

  // Create an Upload object with onProgress callback
  const uploader = new Upload({
    client: s3,
    params: s3Params,
  });
  // Create a readable stream with progress tracking
  const fileStream = fs.createReadStream(s3Params.Body);

  // Set up progress tracking for the file stream
  let loadedBytes = 0;
  let startTime = Date.now();

  fileStream.on('data', (chunk) => {
    loadedBytes += chunk.length;
    progressBar.tick(chunk.length, {
      speed: calculateSpeed(loadedBytes, startTime),
    });
  });

  // Set the Body property of s3Params to the file stream
  s3Params.Body = fileStream;

  // Execute the upload
  try {
    await uploader.done();
    console.log('File uploaded successfully.');
  } catch (error) {
    console.error('Error uploading file:', error);
  }
};

// Calculate upload speed in megabytes per second (MBps)
const calculateSpeed = (loadedBytes, startTime) => {
  const currentTime = Date.now();
  const elapsedTime = (currentTime - startTime) / 1000; // Convert to seconds
  const speed = bytesToKilobytes(loadedBytes) / elapsedTime;
  return speed.toFixed(2); // Limit to two decimal places
};

// Specify your S3 parameters
const s3Params = {
  Bucket: 'raftestbucketpiad',
  Key: 'christmas.mp4',
  Body: 'C:/Users/watch/christmas.mp4',
};

// Call the uploadWithProgress function
uploadWithProgress(s3Params);
