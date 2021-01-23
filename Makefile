build:
	docker build -t hacksore/bluelinky .
push:
	docker push hacksore/bluelinky
run:
	docker run -p 8080:8080 -v "${PWD}:/config" hacksore/bluelinky