TERRAFORM=$(shell which terraform)
package_file_name=dark_bot.zip

terraform/plan:
	$(TERRAFORM) plan

terraform/apply:
	$(TERRAFORM) apply

clean:
	rm -rf dist

package: dist
	cp src/exports.py $</exports.py
	cd $< && zip -r ${package_file_name} ./exports.py
	mv -f $</$(package_file_name) ./$(package_file_name)

dist:
	mkdir -p $@
