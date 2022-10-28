import { Message } from 'wechaty-puppet/types'
import { log } from 'wechaty'
import * as dayjs from 'dayjs'
import  axios from 'axios'
// import { Contact } from 'wechaty/src/mods/users'
// import { speechRecognizer } from './SpeechRecognition.js'


export async function onMessage (msg) {
  log.info('get a message from ', msg.talker())
  log.info(msg.toString())

  if (msg.self()) { // 不处理自己的信息
    return
  }
  switch (msg.type()) {
    case Message.Text:
      // await ProcessMessage(msg) // 处理文本信息
      // console.log('test')
      await msg.say(msg.text())
      // console.log('test2')
      // await msg.say('ww')
      break
    case Message.Image:
      await msg.say('image')  // 处理图像，以后再说
      break
    case Message.Audio:
      let file = await msg.toFileBox()
      let name = './filebox/'+file.name
      console.log('Save file to: ' + name)
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
function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}
function getConcatTime(date1, date2) {
  return date1.getFullYear() + '/' + date1.getMonth() + '/' + date1.getDay() + ' ' + date2.getHours() + ':' +  date2.getMinutes()  + ':' + date2.getSeconds()
}
async function saySomeThing(Contact){
  let str
  await axios.get('http://api.tianapi.com/tianqi/index?key=key&city=101200101&type=1')
  .then(function (response) {
    let tmp = response.data.newslist
    // console.log(tmp);
    console.log(tmp[0])
    str = "明天天气是："+tmp[0].weather + "\n 最低温度："+tmp[0].lowest+'\t最高温度:'+tmp[0].highest+'\n'+tmp[0].tips
    // console.log(str)
    // sleep(1000*10).then(()=>{});
  })
  .catch(function (error) {
    console.log(error);
  });
  await Contact.say(str)
  await Contact.say('小王早点睡觉哦')
}
export async function setUpTimedTask(bot){ // 启动定时任务
  let test = await bot.Contact.find('早安')
  let theDate = new Date("2022/10/27 21:46:00")
  let startTime = new Date()
  startTime = getConcatTime(theDate, startTime)
  startTime = new Date(startTime)
  let afterTime = new Date("2022/10/27 23:59:59")
  // let afterTime = new Date("2022/10/27 23:51:59")
  afterTime = getConcatTime(theDate, afterTime)
  afterTime = new Date(afterTime)
  let waitTime = afterTime.getTime() - startTime.getTime()
  if(waitTime <= 1000){
    waitTime = 1000 
  }

  console.log(waitTime)
  await sleep(waitTime + 2000 * 2).then(()=>{});
  await saySomeThing(test)
  setInterval(async function(){saySomeThing(test)},  1000 * 24 * 60 * 60)
}