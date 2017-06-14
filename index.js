"use strict"

const AWS = require("aws-sdk")
const elasticTranscoder = new AWS.elasticTranscoder({
  region: "us-east-1"
})

exports.handler = (event, context, callback) => {
  const key = event.Records[0].s3.object.key
  const sourceKey = decodeURIComponent(key.replace(/\+/g, ""))
  const outputKey = sourceKey.split(".")[0]

  console.log("key: ", key, sourceKey, outputKey)

  const params = {
    PipelineId: "",
    OutputKeyPrefix: outputKey + "/",
    Input: {
      Key: sourceKey
    },
    Outputs: [
      {
        Key: outputKey + "-1080p" + ".mp4",
        PresetId: "1351620000001-000001"
      },
      {
        // generic 720p
        Key: outputKey + "-720p" + ".mp4",
        PresetId: "1351620000001-000010"
      },
      {
        // web-friendly 720p
        Key: outputKey + "-web-720p" + ".mp4",
        PresetId: "1351620000001-100070"
      }
    ]
  }
  elasticTranscoder.createJob(params, (error, data) => {
    if (error) {
      // if Elastic Transcoder fails, write error to CloudWatch logs
      callback(error)
    }
  })
}
