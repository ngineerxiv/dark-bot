YARN=yarn
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

test: mocha config ## run dark's all tests

mocha:
	$(YARN) run mocha

mocha/watch:
	$(YARN) run mocha:watch

config:
	$(YARN) run hubot-config-check

install: ## install dark bot
	$(YARN) install

####################################
##########  main scripts  ##########
####################################

start/slack: ## start hubot with slack adapter.
	$(MAKE) start adapter=slack

start/local: ## start hubot with shell adapter
	$(MAKE) start

name=dark
adapter=shell
start: config/production.json
	env NODE_ENV=$(ENV) sh -c 'source $(credential) && $(YARN) run start --name $(name) --adapter $(adapter) --monitoring-code=$(monitoring-code)'

config/production.json: ## If you wanna confirm to go well or not, please use `make config/production.json config_production=config/development.json`
	cp -f $(config_production) $@

$(credential): credentials/sample
	cp -f $@ $<

######################################
##########  Jenkins scripts  #########
######################################

deploy: ## deploy script for Jenkins
	git checkout $(deploy-branch)
	git pull origin $(deploy-branch)
	$(MAKE) install

ping: ## ping script for Jenkins
	timeout 60 sh -c 'until curl --user $(basic_user):$(basic_pass) -i localhost:8081/hubot/ping | grep "PONG";do sleep 2; done'


