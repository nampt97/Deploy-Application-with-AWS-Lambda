import 'source-map-support/register'

import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'

const XAWS = AWSXRay.captureAWS(AWS)

export class TodosStorage {

  constructor(
    private readonly s3 = new XAWS.S3({ signatureVersion: 'v4' }),
    private readonly bucketName = process.env.ATTACHMENTS_S3_BUCKET,
  ) {}

  async getAttachmentUrl(attachmentId: string): Promise<string> {
      const attachmentUrl = `https://${this.bucketName}.s3.amazonaws.com/${attachmentId}`
      return attachmentUrl
  }

  async getUploadUrl(attachmentId: string): Promise<string> {
    const uploadUrl = this.s3.getSignedUrlPromise('putObject', {
      Bucket: this.bucketName,
      Key: attachmentId,
      Expires: 300
    })
    return uploadUrl
  }

}
