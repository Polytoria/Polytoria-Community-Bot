import { Message, MessageEmbed } from 'discord.js'
import axios from 'axios'
import { responseHandler } from '../../utils/responseHandler.js'
import { IapiEndpoints } from '../../../types'

export async function lookUp (message: Message, args: string[]) {
  const apiURL: IapiEndpoints = undefined!

  switch (args[1]) {
    case 'user':
      apiURL.url = `https://api.polytoria.com/v1/users/getbyusername?username=${args[0]}`
      break
    case 'id':
      apiURL.url = `https://api.polytoria.com/v1/users/user?id=${args[0]}`
      break
    default:
      apiURL.url = `https://api.polytoria.com/v1/users/getbyusername?username=${args[0]}`
      break
  }

  const response = await axios.get(apiURL.url)
  const data = response.data

  const errResult = responseHandler.checkError(response)

  if (errResult.hasError === true) {
    return message.channel.send(errResult.displayText)
  }

  const embed = new MessageEmbed({
    title: data.Username,
    url: `https://polytoria.com/user/${data.ID}`,
    description: data.Description,
    color: '#ff5454',
    thumbnail: {
      url: `https://polytoria.com/assets/thumbnails/avatars/${data.AvatarHash}.png`
    },
    fields: [
      {
        name: '🗂️ User ID 🗂️',
        value: data.ID.toString(),
        inline: true
      },
      {
        name: '🙎‍♂️ Rank 🙎‍♂️',
        value: data.Rank,
        inline: true
      },
      {
        name: '❤ Membership Type ❤',
        value: data.MembershipType,
        inline: false
      },
      {
        name: '📈 Profile Views 📈',
        value: data.ProfileViews.toLocaleString(),
        inline: true
      },
      {
        name: '📦 Item Sales 📦',
        value: data.ItemSales.toLocaleString(),
        inline: true
      },
      {
        name: '💬 Forum Posts 💬',
        value: data.ForumPosts.toLocaleString(),
        inline: false
      },
      {
        name: '💰 Trade value 💰',
        value: data.TradeValue,
        inline: false
      },
      {
        name: '🔥 Joined At 🔥',
        value: data.JoinedAt,
        inline: false
      },
      {
        name: '🟢 Last seen at 🟢',
        value: data.LastSeenAt,
        inline: false
      }
    ]
  })

  return message.channel.send({ embeds: [embed] })
}
