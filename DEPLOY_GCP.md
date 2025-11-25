# Guide de Déploiement sur Google Cloud Platform

Ce guide vous explique comment déployer votre blog sur Google Cloud Run.

## Prérequis

1. Un compte Google Cloud Platform
2. Un projet GCP créé
3. gcloud CLI installé
4. Docker installé localement

## Configuration initiale

### 1. Activer les APIs nécessaires

\`\`\`bash
gcloud services enable run.googleapis.com
gcloud services enable artifactregistry.googleapis.com
gcloud services enable cloudbuild.googleapis.com
\`\`\`

### 2. Créer un repository Artifact Registry

\`\`\`bash
gcloud artifacts repositories create my-tech-watch-blog \
    --repository-format=docker \
    --location=europe-west1 \
    --description="Docker repository for my tech watch blog"
\`\`\`

### 3. Configurer l'authentification Docker

\`\`\`bash
gcloud auth configure-docker europe-west1-docker.pkg.dev
\`\`\`

## Déploiement manuel

### 1. Build de l'image Docker

\`\`\`bash
docker build -t europe-west1-docker.pkg.dev/YOUR_PROJECT_ID/my-tech-watch-blog/my-tech-watch-blog:latest .
\`\`\`

### 2. Push de l'image

\`\`\`bash
docker push europe-west1-docker.pkg.dev/YOUR_PROJECT_ID/my-tech-watch-blog/my-tech-watch-blog:latest
\`\`\`

### 3. Déploiement sur Cloud Run

\`\`\`bash
gcloud run deploy my-tech-watch-blog \
    --image europe-west1-docker.pkg.dev/YOUR_PROJECT_ID/my-tech-watch-blog/my-tech-watch-blog:latest \
    --platform managed \
    --region europe-west1 \
    --allow-unauthenticated \
    --memory 512Mi \
    --cpu 1 \
    --min-instances 0 \
    --max-instances 10
\`\`\`

## Déploiement automatique avec GitHub Actions

### 1. Configurer Workload Identity Federation

\`\`\`bash
# Créer un pool d'identité
gcloud iam workload-identity-pools create "github-pool" \
    --location="global" \
    --display-name="GitHub Pool"

# Créer un provider
gcloud iam workload-identity-pools providers create-oidc "github-provider" \
    --location="global" \
    --workload-identity-pool="github-pool" \
    --display-name="GitHub Provider" \
    --attribute-mapping="google.subject=assertion.sub,attribute.actor=assertion.actor,attribute.repository=assertion.repository" \
    --issuer-uri="https://token.actions.githubusercontent.com"

# Créer un service account
gcloud iam service-accounts create github-actions \
    --display-name="GitHub Actions Service Account"

# Accorder les permissions
gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
    --member="serviceAccount:github-actions@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/run.admin"

gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
    --member="serviceAccount:github-actions@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/artifactregistry.writer"

# Lier le service account au pool
gcloud iam service-accounts add-iam-policy-binding \
    github-actions@YOUR_PROJECT_ID.iam.gserviceaccount.com \
    --role="roles/iam.workloadIdentityUser" \
    --member="principalSet://iam.googleapis.com/projects/PROJECT_NUMBER/locations/global/workloadIdentityPools/github-pool/attribute.repository/YOUR_GITHUB_USERNAME/my-tech-watch-blog"
\`\`\`

### 2. Configurer les secrets GitHub

Ajoutez ces secrets dans GitHub Settings > Secrets and variables > Actions:

- \`GCP_PROJECT_ID\`: Votre ID de projet GCP
- \`WIF_PROVIDER\`: \`projects/PROJECT_NUMBER/locations/global/workloadIdentityPools/github-pool/providers/github-provider\`
- \`WIF_SERVICE_ACCOUNT\`: \`github-actions@YOUR_PROJECT_ID.iam.gserviceaccount.com\`

### 3. Push vers main pour déclencher le déploiement

\`\`\`bash
git add .
git commit -m "Deploy to GCP"
git push origin main
\`\`\`

## Configuration du domaine personnalisé

### 1. Mapper votre domaine

\`\`\`bash
gcloud run domain-mappings create \
    --service my-tech-watch-blog \
    --domain blog.votredomaine.com \
    --region europe-west1
\`\`\`

### 2. Configurer les DNS

Ajoutez les enregistrements DNS fournis par Cloud Run dans votre registrar.

## Monitoring et Logs

### Voir les logs

\`\`\`bash
gcloud run services logs read my-tech-watch-blog --region europe-west1
\`\`\`

### Monitoring dans la console

Accédez à: https://console.cloud.google.com/run

## Coûts estimés

Cloud Run facture à l'utilisation:
- Gratuité: 2 millions de requêtes/mois
- CPU: ~$0.00002400 par vCPU-seconde
- Mémoire: ~$0.00000250 par GiB-seconde

Pour un blog personnel avec traffic modéré: **~$0-5/mois**

## Troubleshooting

### Erreur de build

\`\`\`bash
# Vérifier les logs de build
gcloud builds log --region=europe-west1
\`\`\`

### Service ne démarre pas

\`\`\`bash
# Vérifier les logs du service
gcloud run services logs read my-tech-watch-blog --region europe-west1 --limit 50
\`\`\`

### Problèmes de permissions

\`\`\`bash
# Vérifier les IAM bindings
gcloud projects get-iam-policy YOUR_PROJECT_ID
\`\`\`

## Rollback

\`\`\`bash
# Lister les révisions
gcloud run revisions list --service my-tech-watch-blog --region europe-west1

# Revenir à une révision précédente
gcloud run services update-traffic my-tech-watch-blog \
    --to-revisions REVISION_NAME=100 \
    --region europe-west1
\`\`\`
