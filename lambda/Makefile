TERRAFORM=$(shell which terraform)
AWS_DEFAULT_REGION:=ap-northeast-1

terraform_remote_bucket=dark-ngineerxiv
terraform_remote_key=dark_bot.tfstate
terraform_remote_region=$(AWS_DEFAULT_REGION)

package_file_name=dark_bot.zip

deploy:
	$(MAKE) clean
	$(MAKE) package
	$(MAKE) terraform/apply

terraform.tfvars: terraform.sample.tfvars
	cp -f $< $@

terraform/plan: terraform/remote_pull
	$(TERRAFORM) plan

terraform/apply: terraform/plan
	$(TERRAFORM) apply
	$(MAKE) terraform/remote_push

terraform/remote_pull: terraform/remote_config
		$(TERRAFORM) remote pull

terraform/remote_push: terraform/remote_config
		$(TERRAFORM) remote push

terraform/remote_config: .terraform

.terraform:
	$(TERRAFORM) remote config \
		-backend=s3 \
		-backend-config="bucket=$(terraform_remote_bucket)" \
		-backend-config="key=$(terraform_remote_key)" \
		-backend-config="region=$(terraform_remote_region)"

clean:
	rm -rf dist
	rm -f $(package_file_name)

package: dist
	cp src/exports.py $</exports.py
	cp -r src/lib/python2.7/site-packages/* $</
	cd $< && zip -r ${package_file_name} ./*
	mv -f $</$(package_file_name) ./$(package_file_name)

dist:
	mkdir -p $@
