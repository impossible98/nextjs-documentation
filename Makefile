.POSIX:
SHELL := /bin/bash
YARN  :=  $(shell which yarn)
# Build the application
.PHONY: build
build:
	@echo -e "\033[32mBuilding the application...\033[0m"
	$(YARN) run build
	@echo -e "\033[32mBuild finished.\033[0m"
# Deploy the application
deploy: build
	@echo -e "\033[32mDeploying the application...\033[0m"
	$(YARN) run deploy
	@echo -e "\033[32mDeploy finished.\033[0m"
# Local development
dev:
	$(YARN) run dev
# Format the code
fmt:
	$(YARN) run fmt
# Install dependencies
install:
	@echo -e "\033[32mInstalling dependencies...\033[0m"
	$(YARN) install
	@echo -e "\033[32mDependencies installed.\033[0m"
### Git ###
# Git pull
pull:
	git pull origin main
# Git push
push:
	git push origin main
