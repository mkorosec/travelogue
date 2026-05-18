.PHONY: install run restart stop status build deploy

PORT ?= 5173
REPO ?= travelogue
PID_FILE := .travelogue.pid
LOG_FILE := travelogue.log

install:
	npm install

run:
	@if [ -f $(PID_FILE) ] && kill -0 $$(cat $(PID_FILE)) 2>/dev/null; then \
		echo "Already running (PID $$(cat $(PID_FILE)))"; \
	else \
		nohup npx vite --host 0.0.0.0 --port $(PORT) --strictPort > $(LOG_FILE) 2>&1 & \
		echo $$! > $(PID_FILE); \
		sleep 1; \
		if kill -0 $$(cat $(PID_FILE)) 2>/dev/null; then \
			echo "Started (PID $$(cat $(PID_FILE)), port $(PORT))"; \
		else \
			rm -f $(PID_FILE); \
			echo "Failed to start on port $(PORT) — port in use?"; \
			exit 1; \
		fi; \
	fi

stop:
	@if [ -f $(PID_FILE) ]; then \
		PID=$$(cat $(PID_FILE)); \
		kill $$PID 2>/dev/null || true; \
		rm -f $(PID_FILE); \
	fi; \
	pkill -f "vite.*--port $(PORT)" 2>/dev/null; \
	pkill -f "npx.*vite.*--port $(PORT)" 2>/dev/null; \
	echo "Stopped"

restart: stop run

status:
	@if [ -f $(PID_FILE) ] && kill -0 $$(cat $(PID_FILE)) 2>/dev/null; then \
		echo "Running (PID $$(cat $(PID_FILE)), port $(PORT))"; \
	else \
		echo "Not running"; \
	fi

build:
	npx vite build --base /$(REPO)/

deploy: build
	npx gh-pages -d dist -m "deploy [skip ci]"
	@echo "Deployed to https://$$(git remote get-url origin | sed 's/.*github.com[:/]//;s/\.git//' | sed 's|/|.github.io/|')/"
