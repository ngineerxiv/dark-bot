token=
team=
name=

npm=$(shell which npm)
mocha=./node_modules/.bin/mocha
lint=./node_modules/.bin/coffeelint
gulp=./node_modules/.bin/gulp
monitoring-code=local

.PHONY:test

all: install

install:
	$(npm) install
	test -f settings/poems.json || cp settings/poems.json.sample settings/poems.json
	test -f settings/relayblog.json || cp settings/relayblog.json.sample settings/relayblog.json

start-with-credentials:
	./bin/hubot-slack ./credentials/development --monitoring-code=${monitoring-code}

start-local:
	./bin/hubot

test-watch:
	$(gulp) watch

test: lint
	$(mocha) --compilers coffee:coffee-script/register --recursive -R spec
	test -f settings/hello.json
	test -f settings/poems.json
	test -f settings/relayblog.json

lint:
	$(lint) scripts -f lintconfig.json
