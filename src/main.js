import 'dotenv/config.js'

import {
  ScanStatus,
  WechatyBuilder,
  log,
}                  from 'wechaty'

import qrcodeTerminal from 'qrcode-terminal'
// import { Message } from 'wechaty-puppet/types'

// self defined
import { onMessage, setUpTimedTask } from './on-message.js'
import { onFriendship} from './on-friend.js'

import * as readline from 'readline'

const welcome = `
=============== Powered by Wechaty ===============
-------- https://github.com/Chatie/wechaty --------

Please wait... I'm trying to login in...

`
const help = `
=============== Powered by Wechaty ===============
help - show help menu
logout - logout
clear - clear screen
`
const myconsole = readline.createInterface({ // 创建接口实例
  input: process.stdin,
  output: process.stdout
})

console.info(welcome)

function onScan (qrcode, status) {
  if (status === ScanStatus.Waiting || status === ScanStatus.Timeout) {
    const qrcodeImageUrl = [
      'https://wechaty.js.org/qrcode/',
      encodeURIComponent(qrcode),
    ].join('')
    log.info('StarterBot', 'onScan: %s(%s) - %s', ScanStatus[status], status, qrcodeImageUrl)

    qrcodeTerminal.generate(qrcode, { small: true })  // show qrcode on console

  } else {
    log.info('StarterBot', 'onScan: %s(%s)', ScanStatus[status], status)
  }
}
// 频率

const bot = WechatyBuilder.build({
  name: 'happy',
  puppetOptions: {
    uos: true  // 开启uos协议
  },
  puppet: 'wechaty-puppet-wechat',
})

bot.on('scan', onScan)

  .on('login', async function (user) {
    log.info('Bot', `${user.name()} logined`)
    await this.say(`wechaty logined`)
    setUpTimedTask(bot)
  })

  .on('logout',     user => {
    log.info('Bot', `${user.name()} logouted`)
    process.exit(1)
  })
  .on('error',      error => log.info('Bot', 'error: %s', error))

  .on('message',    onMessage)
  .on('friendship', onFriendship)
  // .on('room-join',  onRoomJoin)
  
  .start()
  .catch(e => console.error(e))

myconsole.setPrompt("happy> ");
// prompt()是最重要的方法，因为它体现了readline的核心作用，
// 以行为单位读取数据，prompt方法就是在等待用户输入数据
myconsole.prompt();

// 调用接口方法
// 监听了'line' 事件，因为prompt方法调用一次就只会读取一次数据
// 所以，在这个方法又调用了一次prompt方法，这样就可以继续读取用户输入
// 从而达到一种命令行的效果
// 
myconsole.on("line", function (line) {
    switch (line.trim()) {
        case "help":
            console.log(help);
            break;
        case "logout":
            bot.logout();
            break;
        case "copy":
            console.log("复制");
            break;
        case "hello":
            console.log("World!");
            break;
        case "close":
            myconsole.close();
            break;
        case "clear":
            console.clear();
            break;
        case "":
          break;
        default:
            console.log("没有找到命令！输入help查看命令列表");
            break;
    }
    myconsole.prompt();
});

// close事件监听
myconsole.on("close", function () {
    console.log("再见");
    process.exit(0);
})