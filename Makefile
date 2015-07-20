token=
team=
name=

npm=$(shell which npm)
mocha=./node_modules/mocha/bin/mocha
lint=./node_modules/coffeelint/bin/coffeelint

.PHONY:test

install:
	$(npm) install

start:
	HUBOT_SLACK_TOKEN=${token} \
					  HUBOT_SLACK_TEAM=${team} \
					  HUBOT_SLACK_BOTNAME=${name} \
					  bin/hubot --adapter slack

test:
	$(mocha) --compilers coffee:coffee-script/register --recursive -R spec

lint:
	$(lint) scripts -f lintconfig.json

cp-setting-file:
	cp -f ./settings/relayblog.sample.json ./settings/relayblog.json
