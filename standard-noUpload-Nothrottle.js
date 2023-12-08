const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const fs = require('fs');

const credentials = {
  accessKeyId: '',
  secretAccessKey: '',
};

// Create an S3 client
const s3 = new S3Client({ region: 'ap-southeast-1', credentials });

// Specify your S3 parameters
const s3Params = {
  Bucket: "raftestbucketpiad",
  Key: "file.txt",
  Body: fs.createReadStream("C:/Users/watch/file.txt"),
};

// Call the uploadWithoutThrottle function
s3.send(new PutObjectCommand(s3Params))
  .then((response) => {
    console.log('File uploaded successfully:');
  })
  .catch((error) => {
    console.error('Error uploading file:', error);
  });
