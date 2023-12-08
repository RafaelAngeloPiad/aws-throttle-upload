# aws-throttle-upload

working - Upload-throttled.js

packages : 
@aws-sdk/client-s3
@aws-sdk/lib-storage
throttle

Because s3.send putObject when added with throttle cannot define the stream length - throws Are you using a Stream of unknown led from @aws-sdk/lib-storage.

That is why Upload is used from const { Upload } = require("@aws-sdk/lib-storage")

Upload allows for easy and efficient uploading of buffers, blobs, or streams, using a configurable amount of concurrency to perform multipart uploads where possible. 
This abstraction enables uploading large files or streams of unknown size due to the use of multipart uploads under the hood.
https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/Package/-aws-sdk-lib-storage/

