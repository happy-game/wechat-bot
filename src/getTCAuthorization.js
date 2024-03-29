// const crypto = require('crypto');
import * as crypto from 'crypto';

function sha256(message, secret = '', encoding) {
    const hmac = crypto.createHmac('sha256', secret)
    return hmac.update(message).digest(encoding)
}

function getHash(message, encoding = 'hex') {
    const hash = crypto.createHash('sha256')
    return hash.update(message).digest(encoding)
}

function getDate(timestamp) {
    const date = new Date(timestamp * 1000)
    const year = date.getUTCFullYear()
    const month = ('0' + (date.getUTCMonth() + 1)).slice(-2)
    const day = ('0' + date.getUTCDate()).slice(-2)
    return `${year}-${month}-${day}`
}

function main(publicArgs){
    // 密钥参数
    // const SECRET_ID = "AKIDUr45uHUWLxMZX0IPIyTmskOr7B1e4IG1"
    // const SECRET_KEY = "c3INDtOfjfPxHNHzTs790d4JLAlBNNAj"

    // const endpoint = "asr.tencentcloudapi.com"
    // const service = "asr"
    // const region = "ap-guangzhou"
    // const action = "CreateRecTask"
    // const version = "2019-06-14"
        const SECRET_ID = publicArgs.SECRET_ID
    const SECRET_KEY = publicArgs.SECRET_KEY

        const endpoint = publicArgs.endpoint
        const service = publicArgs.service
    const region = publicArgs.region
    const action = publicArgs.action
    const version = publicArgs.version
    //const timestamp = getTime()
        const timestamp = 1551113065
    //时间处理, 获取世界时间日期
        const date = getDate(timestamp)

    // ************* 步骤 1：拼接规范请求串 *************
        const signedHeaders = "content-type;host"

        const payload = "{\"Limit\": 1, \"Filters\": [{\"Values\": [\"\\u672a\\u547d\\u540d\"], \"Name\": \"instance-name\"}]}"

        const hashedRequestPayload = getHash(payload);
        const httpRequestMethod = "POST"
    const canonicalUri = "/"
        const canonicalQueryString = ""
        const canonicalHeaders = "content-type:application/json; charset=utf-8\n" + "host:" + endpoint + "\n"

        const canonicalRequest = httpRequestMethod + "\n"
                         + canonicalUri + "\n"
                         + canonicalQueryString + "\n"
                         + canonicalHeaders + "\n"
                            + signedHeaders + "\n"
                         + hashedRequestPayload
    // console.log(canonicalRequest)

    // ************* 步骤 2：拼接待签名字符串 *************
        const algorithm = "TC3-HMAC-SHA256"
        const hashedCanonicalRequest = getHash(canonicalRequest);
        const credentialScope = date + "/" + service + "/" + "tc3_request"
        const stringToSign = algorithm + "\n" +
                    timestamp + "\n" +
                    credentialScope + "\n" +
                    hashedCanonicalRequest
    // console.log(stringToSign)

    // ************* 步骤 3：计算签名 *************
        const kDate = sha256(date, 'TC3' + SECRET_KEY)
        const kService = sha256(service, kDate)
        const kSigning = sha256('tc3_request', kService)
        const signature = sha256(stringToSign, kSigning, 'hex')
    // console.log(signature)

    // ************* 步骤 4：拼接 Authorization *************
    const authorization = algorithm + " " +
                    "Credential=" + SECRET_ID + "/" + credentialScope + ", " +
                    "SignedHeaders=" + signedHeaders + ", " +
                    "Signature=" + signature
    console.log(authorization)
    return authorization

    const curlcmd = 'curl -X POST ' + "https://" + endpoint
                           + ' -H "Authorization: ' + authorization + '"'
                           + ' -H "Content-Type: application/json; charset=utf-8"'
                           + ' -H "Host: ' + endpoint + '"'
                           + ' -H "X-TC-Action: ' + action + '"'
                           + ' -H "X-TC-Timestamp: ' + timestamp.toString() + '"'
                           + ' -H "X-TC-Version: ' + version + '"'
                           + ' -H "X-TC-Region: ' + region + '"'
                           + " -d '" + payload + "'"
    console.log(curlcmd)
}
main()