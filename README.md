```text
my-tech-watch-blog/
├── app/                      # Application Next.js 14 (App Router)
│   ├── [locale]/             # Routes internationalisées
│   │   ├── blog/             # Articles de blog
│   │   ├── labs/             # Travaux pratiques
│   │   ├── projects/         # Portfolio projets
│   │   └── search/           # Recherche
│   └── globals.css           # Styles globaux
├── components/               # Composants React
│   ├── ui/                   # Composants UI réutilisables
│   ├── layout/               # Header, Footer, etc.
│   ├── blog/                 # Composants spécifiques au blog
│   └── search/               # Composants de recherche
├── content/                  # Contenu Markdown
│   ├── blog/                 # Articles de blog
│   ├── labs/                 # Labs techniques
│   └── projects/             # Projets portfolio
├── lib/                      # Bibliothèques utilitaires
│   ├── content.ts            # Gestion du contenu MDX
│   ├── search.ts             # Moteur de recherche
│   └── utils.ts              # Utilitaires généraux
├── messages/                 # Traductions i18n
│   ├── fr.json               # Français
│   └── en.json               # Anglais
├── scripts/                  # Scripts d'automatisation
│   ├── new-article.js        # Créer un nouvel article
│   ├── new-lab.js            # Créer un nouveau lab
│   └── new-project.js        # Créer un nouveau projet
├── types/                    # Types TypeScript
├── .github/workflows/        # CI/CD GitHub Actions
├── docker-compose.yml        # Configuration Docker Compose
├── Dockerfile                # Configuration Docker
└── next.config.js            # Configuration Next.js
```