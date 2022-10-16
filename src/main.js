import 'dotenv/config.js'

import {
  ScanStatus,
  WechatyBuilder,
  log,
}                  from 'wechaty'

import qrcodeTerminal from 'qrcode-terminal'
// import { Message } from 'wechaty-puppet/types'

// self defined
import { onMessage } from './on-message.js'

const welcome = `
=============== Powered by Wechaty ===============
-------- https://github.com/Chatie/wechaty --------

Please wait... I'm trying to login in...

`
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

const bot = WechatyBuilder.build({
  name: 'puppet-wechat',
  puppetOptions: {
    uos: true  // 开启uos协议
  },
  puppet: 'wechaty-puppet-wechat',
})

bot
  // .on('scan', (qrcode, status) => {
  //   qrcodeTerminal.generate(qrcode)
  //   console.info(`${qrcode}\n[${status}] Scan QR Code in above url to login: `)
  // })
  .on('scan', onScan)

  .on('login', async function (user) {
    log.info('Bot', `${user.name()} logined`)
    await this.say(`wechaty logined`)
  })

  .on('logout',     user => log.info('Bot', `${user.name()} logouted`))
  .on('error',      error => log.info('Bot', 'error: %s', error))

  .on('message',    onMessage)
  .on('friendship', onFriendship)
  // .on('room-join',  onRoomJoin)
  
  .start()
  .catch(e => console.error(e))