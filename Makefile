token=
team=
name=

npm=$(shell which npm)
mocha=./node_modules/.bin/mocha
lint=./node_modules/.bin/coffeelint
gulp=./node_modules/.bin/gulp
monitoring-code=local
credential=./credentials/development

.PHONY:test

all: install

install:
	$(npm) install
	test -f settings/poems.json || cp settings/poems.json.sample settings/poems.json
	test -f settings/relayblog.json || cp settings/relayblog.json.sample settings/relayblog.json

start: compile
	./bin/hubot-slack $(credential) --monitoring-code=$(monitoring-code)

start-local: compile
	source ./credentials/development;./bin/hubot --require ./compiled

test-watch:
	$(gulp) watch

test: lint config-check
	npm run test-coffee
	test -f settings/hello.json
	test -f settings/poems.json
	test -f settings/relayblog.json

lint:
	$(lint) scripts -f lintconfig.json

config-check:
	./bin/hubot --config-check

run-new-channels:
	./bin/start-new-channels $(credential)

compile:
	./node_modules/.bin/babel src/es2015 --out-dir ./compiled --presets es2015

update:
	$(npm) update
