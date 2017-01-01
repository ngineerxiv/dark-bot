virtualenv:
	$@ -p python2 .

install: bin/pip
	$< install -r requirements.txt


bin/pip:
	$(MAKE) virtualenv
