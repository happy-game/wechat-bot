// import {
//   Friendship,
//   Wechaty,
//   // Room,
// }                 from 'wechaty'
import { Friendship } from 'wechaty-puppet/types'

export async function onFriendship (
  request,
) {
  try {
    const contact = request.contact()

    if (request.type() === Friendship.Type.Confirm) {
      console.info('New friend ' + contact.name() + ' relationship confirmed!')
      return
    }

    if (request.type() === Friendship.Type.Receive) {  // 1. receive new friendship request from new contact
      // if 'happy game' is in request message, accept the request
      if (request.hello() === 'happy game') {
      await request.accept()
      await contact.say('感谢添加好友！')
      }
      return
    }

    setTimeout(
      async _ => {
        await contact.say('thank you for adding me')
      },
      3000,
    )

    if (request.hello() === 'ding') {
      const myRoom = await this.Room.find({ topic: 'ding' })
      if (!myRoom) return
      setTimeout(
        async _ => {
          await myRoom.add(contact)
          await myRoom.say('welcome ' + contact.name())
        },
        3000,
      )
    }

  } catch (e) {
    console.info(e)
  }
}
