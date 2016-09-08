npm=$(shell which npm)
node=$(shell which node)
monitoring-code=local
credential=./credentials/development
deploy-branch="master"
basic_user=
basic_pass=
ENV=development
config_production=/credentials/dark-bot-config-prod.json

.PHONY:test help

help:
	@grep -E '^[0-9a-zA-Z_/\.-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'


###########################################
##########  Development scripts  ##########
###########################################

test: ## run dark's all tests
	./bin/hubot --config-check
	$(npm) run compile
	$(npm) run test-js

watch-test-js:
	$(npm) run test-watch-js

watch-compile:
	$(npm) run compile-watch

install: ## install dark bot
	$(npm) install

migrate/up: dbs
	$(npm) run migrate/up

migrate/down: dbs
	$(npm) run migrate/down

dbs:
	mkdir -p $@

####################################
##########  main scripts  ##########
####################################

start: config/production.json ## start hubot with slack adapter.
	env NODE_ENV=$(ENV) ./bin/hubot-slack $(credential) --monitoring-code=$(monitoring-code)

start-local: ## start hubot with shell adapter
	source $(credential);./bin/hubot

config/production.json: ## If you wanna confirm to go well or not, please use `make config/production.json config_production=config/development.json`
	cp -f $(config_production) $@

run-new-channels: src/dark/bin/NewChannels.js
	source $(credential);$(node) $<

######################################
##########  Jenkins scripts  #########
######################################

deploy: ## deploy script for Jenkins
	git checkout $(deploy-branch)
	git pull origin $(deploy-branch)
	$(MAKE) test

ping: ## ping script for Jenkins
	timeout 60 sh -c 'until curl --user $(basic_user):$(basic_pass) -i localhost:8081/hubot/ping | grep "PONG";do sleep 2; done'

update: ## update script for Jenkins
	$(npm) update

