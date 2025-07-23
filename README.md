# Learning App - DevOps Pipeline Project

A comprehensive DevOps project demonstrating CI/CD best practices with a simple Node.js learning application, containerization, and Kubernetes deployment.

## 🚀 Project Overview

This project showcases a complete DevOps pipeline including:
- **Node.js/Express API** - Simple learning topics management
- **Docker containerization** - Multi-stage builds with security best practices
- **Kubernetes deployment** - Production-ready manifests with HPA, health checks
- **GitHub Actions CI/CD** - Automated testing, security scanning, and deployment
- **Infrastructure as Code** - Kubernetes manifests for staging and production

## 📁 Project Structure

```
learning-app/
├── src/
│   └── app.js                 # Main application file
├── tests/
│   └── app.test.js           # Jest unit tests
├── k8s/
│   ├── base/                 # Base Kustomize configuration
│   │   ├── kustomization.yaml
│   │   ├── namespace.yaml
│   │   ├── deployment.yaml
│   │   ├── service.yaml
│   │   ├── ingress.yaml
│   │   └── hpa.yaml
│   └── overlays/            # Environment-specific overlays
│       ├── staging/         # Staging environment
│       │   ├── kustomization.yaml
│       │   ├── deployment-patch.yaml
│       │   ├── ingress-patch.yaml
│       │   └── hpa-patch.yaml
│       └── production/      # Production environment
│           ├── kustomization.yaml
│           ├── deployment-patch.yaml
│           ├── ingress-patch.yaml
│           ├── hpa-patch.yaml
│           ├── service-patch.yaml
│           └── security-patch.yaml
├── .github/workflows/
│   └── ci-cd.yaml           # GitHub Actions pipeline
├── Dockerfile                # Container build instructions
├── .dockerignore            # Docker ignore file
├── package.json             # Node.js dependencies
└── jest.config.js           # Jest test configuration
```

## 🛠 Application Features

### API Endpoints

- `GET /` - Welcome message and health status
- `GET /health` - Health check endpoint
- `GET /topics` - List all learning topics
- `GET /topics/:id` - Get specific topic
- `POST /topics` - Create new topic
- `PUT /topics/:id/complete` - Mark topic as completed

### Sample Data
```json
{
  "id": 1,
  "title": "JavaScript Basics",
  "description": "Learn the fundamentals of JavaScript",
  "completed": false
}
```

## 🐳 Docker

### Building the Image
```bash
docker build -t learning-app .
```

### Running Locally
```bash
docker run -p 3000:3000 learning-app
```

### Security Features
- Non-root user execution
- Multi-stage build optimization
- Health check implementation
- Minimal attack surface

## ☸️ Kubernetes Deployment with Kustomize

### Prerequisites
- Kubernetes cluster (1.19+)
- kubectl configured
- kustomize (v3.8.7+)
- NGINX Ingress Controller
- cert-manager (for TLS)

### Deploy to Kubernetes

#### Using Kustomize (Recommended)
```bash
# Deploy to staging
kustomize build k8s/overlays/staging | kubectl apply -f -

# Deploy to production
kustomize build k8s/overlays/production | kubectl apply -f -

# Check deployment status
kubectl get pods -n learning-app-staging  # for staging
kubectl get pods -n learning-app          # for production
```

#### Direct kubectl (Base only)
```bash
# Apply base manifests only
kubectl apply -k k8s/base/
```

### Kustomize Features

#### Base Configuration
- Common Kubernetes resources (Deployment, Service, Ingress, HPA)
- ConfigMap and Secret generation
- Common labels and metadata

#### Environment-Specific Overlays

**Staging Environment:**
- **2 replicas** with lower resource limits
- **Debug mode** enabled
- **Relaxed HPA** settings (1-5 pods, 80% CPU threshold)
- **Staging hostname** configuration

**Production Environment:**
- **5 replicas** with higher resource limits
- **Enhanced security** context and read-only filesystem
- **Aggressive HPA** with scaling policies (3-20 pods, 60% CPU)
- **Production optimizations** (session affinity, security headers)
- **Advanced monitoring** and logging configuration

### Traditional Features
- **Rolling updates** with zero downtime
- **Health checks** (liveness and readiness probes)
- **Resource limits** for optimal performance
- **TLS termination** with Let's Encrypt
- **Ingress routing** with NGINX

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow

The pipeline includes 5 main jobs:

#### 1. **Test Job**
- Node.js setup and dependency installation
- ESLint code linting
- Jest unit tests execution
- Code coverage upload to Codecov

#### 2. **Security Scan Job**
- npm audit for dependency vulnerabilities
- Trivy filesystem scanning
- SARIF results upload to GitHub Security

#### 3. **Build Job**
- Docker image build and push
- Container vulnerability scanning
- Multi-architecture support
- Layer caching for optimization

#### 4. **Deploy Staging** (develop branch)
- **Kustomize-based** deployment to staging environment
- Dynamic image tag updates using `kustomize edit`
- Smoke tests execution
- Health check verification

#### 5. **Deploy Production** (main branch)
- Manual approval required
- **Kustomize-based** deployment with production optimizations
- Enhanced security and performance configurations
- Comprehensive post-deployment verification
- Slack notifications

### Required Secrets

Configure these secrets in your GitHub repository:

```bash
# Docker Registry
DOCKER_REGISTRY=your-registry.com
DOCKER_USERNAME=your-username
DOCKER_PASSWORD=your-password

# Kubernetes
KUBE_CONFIG_STAGING=base64-encoded-kubeconfig
KUBE_CONFIG_PRODUCTION=base64-encoded-kubeconfig

# Optional
CODECOV_TOKEN=your-codecov-token
SLACK_WEBHOOK=your-slack-webhook-url
```

## 🧪 Testing

### Run Tests Locally
```bash
# Install dependencies
npm install

# Run unit tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run tests in watch mode
npm run test:watch
```

### Test Coverage
- API endpoint testing
- Error handling validation
- Input validation testing
- Health check verification

## 🔧 Development

### Local Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run linting
npm run lint
```

### Kustomize Development

#### Preview Changes
```bash
# Preview staging configuration
kustomize build k8s/overlays/staging

# Preview production configuration
kustomize build k8s/overlays/production

# Compare environments
diff <(kustomize build k8s/overlays/staging) <(kustomize build k8s/overlays/production)
```

#### Update Image Tags
```bash
# Update staging image
cd k8s/overlays/staging
kustomize edit set image learning-app=myregistry/learning-app:v1.2.3

# Update production image
cd k8s/overlays/production
kustomize edit set image learning-app=myregistry/learning-app:v1.2.3
```

### Environment Variables
- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)
- `LOG_LEVEL` - Logging verbosity (info/debug)
- `METRICS_ENABLED` - Enable metrics collection

## 📊 Monitoring & Observability

### Health Checks
- **Liveness Probe**: `/health` endpoint
- **Readiness Probe**: Application startup verification
- **Startup Probe**: Container initialization

### Metrics
- Kubernetes HPA metrics (CPU/Memory)
- Application performance monitoring ready
- Container resource utilization

## 🔒 Security Features

### Application Security
- Helmet.js for security headers
- Input validation
- Error handling without information leakage
- Non-root container execution

### Pipeline Security
- Dependency vulnerability scanning
- Container image scanning
- SARIF security reporting
- Secrets management with GitHub Secrets

## 🚦 Deployment Strategies

### Staging Environment
- Automatic deployment on `develop` branch
- Smoke tests execution
- Quick feedback loop

### Production Environment
- Manual approval required
- Comprehensive health checks
- Rollback capabilities
- Monitoring and alerting

## 🔍 Troubleshooting

### Common Issues

1. **Pod CrashLoopBackOff**
   ```bash
   kubectl logs -n learning-app deployment/learning-app
   kubectl describe pod -n learning-app <pod-name>
   ```

2. **Service Not Accessible**
   ```bash
   kubectl get svc -n learning-app
   kubectl get ingress -n learning-app
   ```

3. **Pipeline Failures**
   - Check GitHub Actions logs
   - Verify secrets configuration
   - Validate Kubernetes connectivity

## 📈 Next Steps

### Enhancements
- [ ] Database integration (PostgreSQL/MongoDB)
- [ ] Redis caching layer
- [ ] Prometheus metrics
- [ ] Grafana dashboards
- [ ] ELK stack logging
- [ ] Helm charts
- [ ] ArgoCD GitOps
- [ ] Service mesh (Istio)

### Best Practices Implemented
- ✅ Infrastructure as Code
- ✅ Automated testing
- ✅ Security scanning
- ✅ Container best practices
- ✅ Kubernetes production patterns
- ✅ GitOps workflow
- ✅ Monitoring and health checks

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Built with ❤️ for DevOps learning and best practices demonstration**