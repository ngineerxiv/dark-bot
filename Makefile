token=
team=
name=

npm=$(shell which npm)
mocha=./node_modules/.bin/mocha
lint=./node_modules/.bin/coffeelint

.PHONY:test

all: install

install:
	$(npm) install
	test -f settings/hello.json || cp settings/hello.json.sample settings/hello.json
	test -f settings/poems.json || cp settings/poems.json.sample settings/poems.json
	test -f settings/relayblog.json || cp settings/relayblog.json.sample settings/relayblog.json

start:
	HUBOT_SLACK_TOKEN=${token} \
					  HUBOT_SLACK_TEAM=${team} \
					  HUBOT_SLACK_BOTNAME=${name} \
					  bin/hubot --adapter slack

start-local:
	./bin/hubot

test:install lint
	$(mocha) --compilers coffee:coffee-script/register --recursive -R spec
	test -f settings/hello.json
	test -f settings/poems.json
	test -f settings/relayblog.json

lint:
	$(lint) scripts -f lintconfig.json
