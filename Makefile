npm=$(shell which npm)
monitoring-code=local
credential=./credentials/development
deploy-branch="master"

.PHONY:test

all: install

init:
	test -f settings/poems.json || cp settings/poems.json.sample settings/poems.json

install: init
	$(npm) install

start: 
	./bin/hubot-slack $(credential) --monitoring-code=$(monitoring-code)

start-local: 
	source $(credential);./bin/hubot

test: install compile config-check
	npm run test-js
	test -f settings/hello.json
	test -f settings/poems.json

deploy:
	git checkout $(deploy-branch)
	git pull origin $(deploy-branch)
	$(MAKE) test

config-check:
	./bin/hubot --config-check

run-new-channels:
	./bin/start-new-channels $(credential)

update:
	$(npm) update

compile: install
	$(npm) run compile

watch-compile: install
	$(npm) run compile-watch

