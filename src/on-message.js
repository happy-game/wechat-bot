import { Message } from 'wechaty-puppet/types'
import { log } from 'wechaty'
import * as dayjs from 'dayjs'
import * as customParseFormat from 'dayjs/plugin/customParseFormat.js'
import * as fs from 'fs'
import  axios from 'axios'
import { setInterval } from 'timers/promises'
import {FileBox} from 'file-box'
// import { Contact } from 'wechaty/src/mods/users'
// import { speechRecognizer } from './SpeechRecognition.js'

// 设置模式 普通 、 处理上一事件、记账、收藏
const MODE = {
  NORMAL: 0,
  LAST: 1,
  ACCOUNT: 2,
  COLLECT: 3,
}

let file = null;
let name = null;
let mode = MODE.NORMAL;
// dayjs.extend(customParseFormat);
export async function onMessage (msg) {
  log.info('get a message from ', msg.talker())
  log.info(msg.toString())

  if (msg.self()) { // 不处理自己的信息
    return
  }
  switch (msg.type()) {
    case Message.Text:
      await ProcessMessage(msg) // 处理文本信息
      await msg.say("找绮哥去！")
      if(msg.text()[0]=='!'){
        await msg.say(msg.text())
      }

      break
    case Message.Image:
      file = await msg.toFileBox()
      name = './filebox/'+file.name
      await msg.say(file)  // 处理图像，以后再说
      break
    case Message.Audio:
      // let file = await msg.toFileBox()
      // let name = './filebox/'+file.name
      // console.log('Save file to: ' + name)
      file.toFile(name)   // 保存音频

      // let parse = new speechRecognizer(name)
      // console.log(parse.parse())
      break
    case Message.Video:
      await msg.say('video')  // process video TODO
      break
    case Message.Attachment:
      await msg.say('attachment')  // process attachment TODO
      break
    default:
      await msg.say('unknown')  // process unknown TODO
  }
}

async function ProcessMessage (msg) {   //处理文本信息 TODO

}
function setDefaultTime(date) {
  // 传入格式 YYYY-MM-DD HH:mm:ss
  // 手动解析
  let year = Number(date.substring(0, 4))
  let month = Number(date.substring(5, 7))
  let day = Number(date.substring(8, 10))
  let hour = Number(date.substring(11, 13))
  let minute = Number(date.substring(14, 16))
  let second = Number(date.substring(17, 19))
  // 合成日期，为0项设为当前时间
  let dateObj = new Date()
  dateObj.setFullYear(year || dateObj.getFullYear())
  dateObj.setMonth(month  || dateObj.getMonth())
  dateObj.setDate(day || dateObj.getDate())
  console.log('hour', hour)
  dateObj.setHours(hour || dateObj.getHours())
  console.log('dateObj', dateObj)
  dateObj.setMinutes(minute || dateObj.getMinutes())
  // dateObj.setSeconds(second || dateObj.getSeconds())
  console.log(dateObj)
  return dateObj
}

function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

async function test(fun,frequency,task){
  for(let i=0;i<10;i++){
    await sleep(frequency).then(()=>{})
    fun(task)
  }
}

export async function setUpTimedTask(bot){ // 启动定时任务
  // 读取 config/timedTask.json
  let timedTask = JSON.parse(fs.readFileSync('config/timedTask.json'))
  // 遍历
  timedTask.forEach(async (task) => {
    // console.log(task)
    if(!task.enabled){
      return
    }
    // 读取时间, 频率
    let date
    if(task.time == 'now'){
      date = new Date()
    }else{
    date = setDefaultTime(task.time)
    }
    let frequency = eval(task.frequency)
    // 计算最早启动时间
    let now = new Date()
    let start =new Date(date.getTime() + frequency) 
    console.log(start,'\t\t', now)
    start = start.getTime() - now.getTime()
    if(start < 0){
      start = 1000
    }

    // 读取联系人
    let contact = await bot.Contact.find(task.to)
    if(!contact){
      console.log('Contact not found: ' + task.to)
      return
    }
    console.log('Contact found: ' + contact.name())
    // 读取内容
    let fun =async (task)=>{
      console.log('Task start: ' + task.name)
      if(task.type == 'api'){
        // 调用api
        let api = task.api
        let params = api.params
        axios.get(api.url, {
          params: params
        }).then(async (response)=>{
          switch (api.name) {
            case '天行天气':
              let tmp = response.data.newslist[0]
              // console.log(tmp)
              // str = "明天天气是："+tmp.weather + "\n 最低温度："+tmp.lowest+'\t最高温度:'+tmp.highest+'\n'+tmp.tips
              contact.say("明天天气是："+tmp.weather + "\n 最低温度："+tmp.lowest+'\t最高温度:'+tmp.highest+'\n'+tmp.tips)
              break;
            case '图片':
              console.log(response.data)
              let url = response.data.data.url
              console.log(url)
              let fileBox = FileBox.fromUrl(url)
              // 取随机字符串
              let name = Math.random().toString(36).substr(2)
              // let random = Math.floor(Math.random()*100000)

              await fileBox.toFile('filebox/'+name+'image.jpg')
              fileBox = FileBox.fromFile('filebox/'+name+'image.jpg')

              await contact.say(fileBox)
              break;
            default:
              console.log(response.data)
              contact.say(response.data)
              break;
          }
        }).catch((error)=>{
          console.log(error)
        })
      }
      else if(task.type == 'text'){
        contact.say(task.content)
      }
    }
      console.log('send',task.name,'to',contact.name(),'at',date,'every',frequency,'ms')
      console.log('start in',start,'ms')
      await sleep(start).then();
      await fun(task)
      console.log('第一个结束')
      // setInterval(fun, frequency, task)
      test(fun,frequency,task)
  })
}
