# Learning App DevOps Makefile

.PHONY: help install test build docker-build deploy-staging deploy-production clean

# Default target
help: ## Show this help message
	@echo "Learning App DevOps Commands:"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}'

# Development commands
install: ## Install dependencies
	npm install

test: ## Run tests
	npm test

lint: ## Run linting
	npm run lint

dev: ## Start development server
	npm run dev

# Docker commands
docker-build: ## Build Docker image
	docker build -t learning-app:latest .

docker-run: ## Run Docker container
	docker run -p 3000:3000 learning-app:latest

# Kustomize commands
kustomize-preview-staging: ## Preview staging Kustomize configuration
	kustomize build k8s/overlays/staging

kustomize-preview-production: ## Preview production Kustomize configuration
	kustomize build k8s/overlays/production

kustomize-diff: ## Compare staging and production configurations
	@echo "Comparing staging vs production configurations..."
	@diff <(kustomize build k8s/overlays/staging) <(kustomize build k8s/overlays/production) || true

# Deployment commands
deploy-staging: ## Deploy to staging environment
	kustomize build k8s/overlays/staging | kubectl apply -f -
	kubectl rollout status deployment/staging-learning-app -n learning-app-staging

deploy-production: ## Deploy to production environment
	kustomize build k8s/overlays/production | kubectl apply -f -
	kubectl rollout status deployment/prod-learning-app -n learning-app

# Utility commands
k8s-logs-staging: ## View staging logs
	kubectl logs -f deployment/staging-learning-app -n learning-app-staging

k8s-logs-production: ## View production logs
	kubectl logs -f deployment/prod-learning-app -n learning-app

k8s-status-staging: ## Check staging status
	kubectl get pods,svc,ingress -n learning-app-staging

k8s-status-production: ## Check production status
	kubectl get pods,svc,ingress -n learning-app

# Cleanup commands
clean: ## Clean up local artifacts
	rm -rf node_modules coverage

k8s-clean-staging: ## Remove staging deployment
	kustomize build k8s/overlays/staging | kubectl delete -f - --ignore-not-found=true

k8s-clean-production: ## Remove production deployment
	kustomize build k8s/overlays/production | kubectl delete -f - --ignore-not-found=true