token=
team=
name=

install:
	npm install

start:
	HUBOT_SLACK_TOKEN=${token} \
					  HUBOT_SLACK_TEAM=${team} \
					  HUBOT_SLACK_BOTNAME=${name} \
					  bin/hubot --adapter slack
