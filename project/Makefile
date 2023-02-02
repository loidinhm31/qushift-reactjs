## up: starts all containers in the background without forcing build
up:
	@echo "Starting Docker images..."
	docker-compose up -d
	@echo "Docker images started!"

## up_build: stops docker-compose (if running), builds all projects and starts docker compose
up_build: build_java_qushift_be build_nextjs_qushift_fe
	@echo "Stopping docker images (if running...)"
	docker-compose down
	@echo "Building (when required) and starting docker images..."
	docker-compose up --build -d
	@echo "Docker images built and started!"

## down: stop docker compose
down:
	@echo "Stopping docker compose..."
	docker-compose down
	@echo "Done!"

## build_java_qushift_be: builds the java qshift backend  jar as a linux executable
build_java_qushift_be:
	@echo "Building java qshift backend jar..."
	cd ../java-qushift-be && mvn clean install -DskipTests
	@echo "Done!"

## build_nextjs_qushift_fe: builds the nextjs qshift frontend  jar as a linux executable
build_nextjs_qushift_fe:
	@echo "Building qshift frontend..."
	cd ../ts-qushift-fe && npm install && npm run build
	@echo "Done!"