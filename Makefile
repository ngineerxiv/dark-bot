token=
team=
name=

npm=$(shell which npm)
mocha=./node_modules/mocha/bin/mocha
lint=./node_modules/coffeelint/bin/coffeelint

.PHONY:test

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

test:install
	$(mocha) --compilers coffee:coffee-script/register --recursive -R spec
	test -f settings/hello.json
	test -f settings/poems.json
	test -f settings/relayblog.json

lint:
	$(lint) scripts -f lintconfig.json

cp-setting-file:
	cp -f ./settings/relayblog.sample.json ./settings/relayblog.json
