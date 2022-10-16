// import {
//   Contact,
//   Room,
//   Wechaty,
// }             from 'wechaty'

import { Contact } from 'wechaty-puppet/types'
// import { Room } from 'wechaty'

async function onRoomJoin (
  room,
  inviteeList,
  inviter,
) {
  try {
    const inviteeName = inviteeList.map(c => c.name()).join(', ')
    /********************************************
     *
     * 从这里开始修改 vvvvvvvvvvvv
     *
     */

    if (await room.topic() !== 'ding') {
      await this.say('Room ' + await room.topic()
                      + ' got new memeber ' + inviteeName
                      + ' invited by ' + inviter.name(),
      )
      return
    }

    const inviterIsMyself = inviter.self()

    if (inviterIsMyself) {
      await room.say('Welcome to my room: ' + inviteeName)
      return
    }

    await room.say('请勿私自拉人。需要拉人请加我', inviter)
    await room.say('请先加我好友，然后我来拉你入群。先把你移出啦。', inviteeList)

    inviteeList.forEach(async c => {
      await room.del(c)
    })

    /**
     *
     * 到这里结束修改^^^^^^^^^^^^
     *
     */
    /*********************************************/

  } catch (e) {
    console.info(e)
  }

}

