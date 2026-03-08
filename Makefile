.DEFAULT_GOAL := help

.PHONY: help init setup-env dev build start lint format test test-cov test-e2e \
        docker-up docker-down docker-build new-module

help: ## Show available targets
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) \
		| awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-18s\033[0m %s\n", $$1, $$2}'

# ── Project setup ─────────────────────────────────────────────────────────────

init: ## Initialize project (name, description, .env, optional git reset)
	@chmod +x scripts/init.sh && ./scripts/init.sh

setup-env: ## Copy .env.example → .env (skips if .env already exists)
	@[ -f .env ] && echo ".env already exists" || (cp .env.example .env && echo ".env created — fill in your values")

# ── Development ───────────────────────────────────────────────────────────────

dev: ## Start development server with hot reload
	pnpm run start:dev

build: ## Build for production
	pnpm run build

start: ## Start production server (requires build first)
	pnpm run start:prod

lint: ## Lint and auto-fix source files
	pnpm run lint

format: ## Format source files with Prettier
	pnpm run format

# ── Testing ───────────────────────────────────────────────────────────────────

test: ## Run unit tests
	pnpm run test

test-cov: ## Run unit tests with coverage report
	pnpm run test:cov

test-e2e: ## Run end-to-end tests
	pnpm run test:e2e

# ── Docker ────────────────────────────────────────────────────────────────────

docker-up: ## Start Docker services (Postgres, etc.) in detached mode
	docker compose up -d

docker-down: ## Stop and remove Docker containers
	docker compose down

docker-build: ## Build and start all Docker services
	docker compose up -d --build

# ── Scaffolding ───────────────────────────────────────────────────────────────

new-module: ## Scaffold a new domain module — usage: make new-module name=product
	@[ -n "$(name)" ] || (echo "Usage: make new-module name=<module-name>" && exit 1)
	node scripts/new-module.js $(name)
