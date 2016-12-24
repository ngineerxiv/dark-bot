from slackclient import SlackClient
import os

slack_token = os.environ["SLACK_API_TOKEN"]
sc = SlackClient(slack_token)


def handler(event, context):
    ret = sc.api_call(
        "chat.postMessage",
        channel="#bot_heaven",
        text="Hello from Lambda! :tada:",
        username="dark",
        icon_emoji=":dark:"
    )
    return {'text': ret}


if __name__ == '__main__':
    handler({}, {})
