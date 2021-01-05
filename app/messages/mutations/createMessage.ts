import { Ctx } from "blitz"
import db, { Prisma } from "db"
import { WebClient } from "@slack/web-api"
import { CreateMessageInput } from "app/messages/validations"

type CreateMessageInputType = Pick<Prisma.MessageCreateArgs, "data">
export default async function createMessage({ data }: CreateMessageInputType, ctx: Ctx) {
  ctx.session.authorize()

  const { title, body, slackChannelId } = CreateMessageInput.parse(data)

  const message = await db.message.create({
    data: { title, body, slackChannelId, user: { connect: { id: ctx.session.userId } } },
    include: { user: true },
  })

  const web = new WebClient(message.user?.slackAccessToken)

  const user = await db.user.findUnique({ where: { id: ctx.session.userId } })

  const slackMessage = await web.chat.postMessage({
    text: "",
    channel: slackChannelId,
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: title,
          emoji: true,
        },
      },
      {
        type: "divider",
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `${body.substring(0, 250)}...`,
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "*Read the complete post*",
        },
        accessory: {
          type: "button",
          text: {
            type: "plain_text",
            text: "Go",
            emoji: true,
          },
          value: "click_me_123",
          url: `${process.env.WEBSITE_URL}/messages/${message.id}`,
          action_id: "button-action",
        },
      },
    ],
  })

  await db.message.update({
    data: { slackTimeStamp: slackMessage.ts as string },
    where: { id: message.id },
  })

  return message
}
