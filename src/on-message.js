import { Message } from 'wechaty-puppet/types'
import { log } from 'wechaty'

export async function onMessage (msg) {
  log.info('get a message \t', msg.toString())

  if (msg.self()) {
    return
  }
  switch (msg.type()) {
    case Message.Text:
      await msg.say(msg.text()) // reply same text
      break
    case Message.Image:
      await msg.say('image')  // process image TODO
      break
    case Message.Audio:
      await msg.say('audio')  // process audio TODO
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
// function test() {
//   console.log('test')
// }

// module.exports = {
//   test
// }