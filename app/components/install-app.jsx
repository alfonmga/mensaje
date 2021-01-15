export default function InstallApp() {
  return (
    <div className="absolute h-screen w-screen bg-white flex items-center justify-center">
      <a
        href={`https://slack.com/oauth/v2/authorize?redirect_uri=${process.env.WEBSITE_URL}/&client_id=2756934506.1603903113093&scope=commands&user_scope=channels:read,chat:write,reactions:write,groups:read,mpim:read,im:read`}
      >
        <img
          alt="Add to Slack"
          height="40"
          width="139"
          src="https://platform.slack-edge.com/img/add_to_slack.png"
          srcSet="https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x"
        />
      </a>
    </div>
  )
}
