// Depends on tencentcloud-sdk-nodejs version 4.0.3 or higher

import * as tencentcloud from "tencentcloud-sdk-nodejs"
const AsrClient = tencentcloud.asr.v20190614.Client;

// // 实例化一个认证对象，入参需要传入腾讯云账户secretId，secretKey,此处还需注意密钥对的保密
// // 密钥可前往https://console.cloud.tencent.com/cam/capi网站进行获取
const clientConfig = {
  credential: {
    secretId: "id",
    secretKey: "key",
  },
  region: "",
  profile: {
    httpProfile: {
      endpoint: "asr.tencentcloudapi.com",
    },
  },
};

// // 实例化要请求产品的client对象,clientProfile是可选的
// const client = new AsrClient(clientConfig);
// const params = {
//     "EngineModelType": "16k_zh",
//     "ChannelNum": 1,
//     "SpeakerDiarization": 0,
//     "SpeakerNumber": 0,
//     "ResTextFormat": 1,
//     "SourceType": 1,
//     "Data": "tobe"
// };
// client.CreateRecTask(params).then(
//   (data) => {
//     console.log(data);
//   },
//   (err) => {
//     console.error("error", err);
//   }
// );

function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

class speechRecognizer{
  constructor(pathOrUrl){
    this.client = new AsrClient(clientConfig);
    this.params = {
      "EngineModelType": "16k_zh",
      "ChannelNum": 1,
      "SpeakerDiarization": 0,
      "SpeakerNumber": 0,
      "ResTextFormat": 1,
      "SourceType": 1,
      "Data": "null",
    };
    this.params2 = {
      "TaskId": 2381393583
    }
    this.taskId = 0;
    this.Url = pathOrUrl;
  }
  async getPost() {
    // this.data.Data = base64_encode(this.Url)
    this.params.Data = base64_encode('./filebox/7495710158031429703.mp3')
    
    this.client.CreateRecTask(this.params).then(
      (data) => {
        console.log(data);
        this.params2.TaskId = data.Data.TaskId;
        console.log(this.params2)
        return data
      },
      (err) => {
        console.error("error", err);
      }
    );
  }
  async getAnswer() { // 用于轮询获取是否识别完成
    this.client.DescribeTaskStatus(this.params2).then(
      (data) => {
        // console.log(data);
        console.log
        return data
      },
      (err) => {
        console.error("error", err);
        return 'error'
      }
    );
  }
  async parse() {
    await this.getPost();
    // setTimeout()
    sleep(2000).then(()=>{});
    let a = 0;  //最大尝试次数
    while (true){
      let data = await this.getAnswer()
      console.log(data)
      // return data
      if(data.Data === '' || a >= 3){
        return data;
      }
      a += 1;
      sleep(200).then(()=>{});
    }
  }
}

import * as fs from 'fs'
const base64_encode = file => {
    let bitmap = fs.readFileSync(file);
    return `${Buffer.from(bitmap).toString('base64')}`;
} //base64编码
export {        // 导出函数
  speechRecognizer
}