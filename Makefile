# LGS Test Tools Makefile

.PHONY: help install dev build start clean docker-build docker-run docker-compose test lint type-check

# Colors for terminal output
CYAN := \033[36m
GREEN := \033[32m
YELLOW := \033[33m
RED := \033[31m
NC := \033[0m # No Color

help: ## Show this help message
	@echo "$(CYAN)LGS Test Tools - Available commands:$(NC)"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(GREEN)%-20s$(NC) %s\n", $$1, $$2}'

install: ## Install dependencies
	@echo "$(CYAN)Installing dependencies...$(NC)"
	npm install

dev: ## Start development server
	@echo "$(CYAN)Starting development server...$(NC)"
	npm run dev

build: ## Build for production
	@echo "$(CYAN)Building for production...$(NC)"
	npm run build

start: ## Start production server
	@echo "$(CYAN)Starting production server...$(NC)"
	npm start

clean: ## Clean build artifacts and dependencies
	@echo "$(CYAN)Cleaning build artifacts...$(NC)"
	npm run clean
	rm -rf node_modules

lint: ## Run ESLint
	@echo "$(CYAN)Running ESLint...$(NC)"
	npm run lint

lint-fix: ## Fix ESLint issues
	@echo "$(CYAN)Fixing ESLint issues...$(NC)"
	npm run lint:fix

type-check: ## Run TypeScript type checking
	@echo "$(CYAN)Running TypeScript type checking...$(NC)"
	npm run type-check

test: ## Run tests
	@echo "$(CYAN)Running tests...$(NC)"
	npm test

docker-build: ## Build Docker image
	@echo "$(CYAN)Building Docker image...$(NC)"
	docker build -t lgs-test-tools .

docker-run: ## Run Docker container
	@echo "$(CYAN)Running Docker container...$(NC)"
	docker run -p 3000:3000 --name lgs-test-tools lgs-test-tools

docker-compose: ## Start with Docker Compose
	@echo "$(CYAN)Starting with Docker Compose...$(NC)"
	docker-compose up -d

docker-compose-simulator: ## Start with Docker Compose including simulator
	@echo "$(CYAN)Starting with Docker Compose (including simulator)...$(NC)"
	docker-compose --profile simulator up -d

docker-stop: ## Stop Docker containers
	@echo "$(CYAN)Stopping Docker containers...$(NC)"
	docker-compose down

docker-logs: ## Show Docker logs
	@echo "$(CYAN)Showing Docker logs...$(NC)"
	docker-compose logs -f

setup: install ## Initial setup
	@echo "$(GREEN)Setup completed!$(NC)"
	@echo "$(YELLOW)Run 'make dev' to start development server$(NC)"

check: lint type-check ## Run all checks
	@echo "$(GREEN)All checks passed!$(NC)"

release: check build ## Prepare for release
	@echo "$(GREEN)Release build ready!$(NC)"
