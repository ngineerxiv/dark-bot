token=
team=
name=

start:
	HUBOT_SLACK_TOKEN=${token} \
					  HUBOT_SLACK_TEAM=${team} \
					  HUBOT_SLACK_BOTNAME=${name} \
					  bin/hubot --adapter slack
