const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { Upload } = require("@aws-sdk/lib-storage");
const fs = require('fs');
const throttle = require('throttle');

const credentials = {
    accessKeyId: '',
    secretAccessKey: '',
  };
// Create an S3 client
const s3 = new S3Client({ region: 'ap-southeast-1', credentials });

// Function to upload with throttling using the 'throttle' library
const uploadWithThrottle = async (s3Params, uploadRate) => {
  // Create an Upload object
  const uploader = new Upload({
    client: s3,
    params: s3Params,
  });

    // const uploader = new Upload({
  //   client: s3,
  //   params: {
  //              Bucket: 'raftestbucketpiad',
  //              Key: 'file.txt',
  //              Body: 'C:/Users/watch/velox/file.txt',
  //   },
  // });


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
    await uploader.done();
    console.log('File uploaded successfully.');
  } catch (error) {
    console.error('Error uploading file:', error);
  }
};

// Specify your S3 parameters
const s3Params = {
  Bucket: 'raftestbucketpiad',
  Key: 'file.txt',
  Body: 'C:/Users/watch/file.txt',
};

// Specify the desired upload rate (e.g., 100 KB/s)
const uploadRate = 5000 * 1024; //  KB/s

// Call the uploadWithThrottle function
uploadWithThrottle(s3Params, uploadRate);
