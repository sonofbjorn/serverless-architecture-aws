var chai = require("chai")
var sinon = require("sinon")
var sinonChai = require("sinon-chai")
var rewire = require("rewire")
chai.should()
chai.use(sinonChai)

var sampleData = {
  Contents: [
    {
      Key: "file1.mp4",
      bucket: "my-bucket"
    },
    {
      Key: "file2.mp4",
      bucket: "my-bucket"
    }
  ]
}

describe("LambdaFunction", function() {
  var listObjectsStub, callbackSpy, module

  describe("#execute", function() {
    before(function(done) {
      process.env.BASE_URL = "https://s3.amazonaws.com"
      process.env.BUCKET = "serverless-video-transcoded"
      listObjectsStub = sinon.stub().yields(null, sampleData)
      callbackSpy = sinon.spy()

      var callback = function(error, result) {
        callbackSpy.apply(null, arguments)
        done()
      }

      module = getModule(listObjectsStub)
      module.handler(null, null, callback)
    })

    it("should run our function once", function() {
      callbackSpy.should.have.been.calledOnce
    })

    it("should have correct results", function() {
      var result = {
        baseUrl: "https://s3.amazonaws.com",
        bucket: "serverless-video-transcoded",
        urls: [
          {
            Key: sampleData.Contents[0].Key,
            bucket: "my-bucket"
          },
          {
            Key: sampleData.Contents[1].Key,
            bucket: "my-bucket"
          }
        ]
      }

      callbackSpy.args.should.deep.equal([[null, result]])
    })
  })
})

function getModule(listObjects) {
  var rewired = rewire("../get-video-list.js")

  rewired.__set__({
    s3: { listObjects: listObjects }
  })

  return rewired
}
