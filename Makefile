npm=$(shell which npm)
monitoring-code=local
credential=./credentials/development
deploy-branch="master"
basic='--user $(basic_user):$(basic_pass)'

.PHONY:test help

help:
	@grep -E '^[0-9a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'


###########################################
##########  Development scripts  ##########
###########################################

test: settings/poems.json ## run dark's all tests
	./bin/hubot --config-check
	$(npm) run compile
	$(npm) run test-js

watch-test-js:
	$(npm) run test-watch-js

watch-compile:
	$(npm) run compile-watch

install: settings/poems.json ## install dark bot
	$(npm) install

settings/poems.json:
	cp -f settings/poems.json.sample settings/poems.json

####################################
##########  main scripts  ##########
####################################

start: ## start hubot with slack adapter.
	./bin/hubot-slack $(credential) --monitoring-code=$(monitoring-code)

start-local: ## start hubot with shell adapter
	source $(credential);./bin/hubot

run-new-channels:
	./bin/start-new-channels $(credential)

######################################
##########  Jenkins scripts  #########
######################################

deploy: ## deploy script for Jenkins
	git checkout $(deploy-branch)
	git pull origin $(deploy-branch)
	$(MAKE) test

ping: ## ping script for Jenkins
	timeout 60 sh -c 'until curl $(basic) -i localhost:8081/hubot/ping | grep "PONG") do sleep 2; done'

update: ## update script for Jenkins
	$(npm) update

