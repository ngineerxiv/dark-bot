token=
team=
name=

npm=$(shell which npm)
mocha=./node_modules/.bin/mocha
lint=./node_modules/.bin/coffeelint
gulp=./node_modules/.bin/gulp
monitoring-code=local
credential=./credentials/development
exdirectory=./src/es2015

.PHONY:test

all: install

init:
	test -f settings/poems.json || cp settings/poems.json.sample settings/poems.json
	test -f settings/relayblog.json || cp settings/relayblog.json.sample settings/relayblog.json

install: init
	$(npm) install

start: 
	./bin/hubot-slack $(credential) $(exdirectory) --monitoring-code=$(monitoring-code)

start-local: 
	source ./credentials/development;./bin/hubot --require ./src/es2015

test-watch:
	$(gulp) watch

test: lint config-check
	npm run test-coffee
	npm run test-js
	test -f settings/hello.json
	test -f settings/poems.json
	test -f settings/relayblog.json

lint:
	$(lint) scripts -f lintconfig.json

config-check:
	./bin/hubot --config-check

run-new-channels:
	./bin/start-new-channels $(credential)

update:
	$(npm) update
