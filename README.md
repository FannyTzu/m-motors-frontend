# M-MOTORS — Frontend

Frontend du projet, construit avec React et Next.js

Ce README décrit les prérequis, l’installation et les principales commandes pour démarrer le projet en local ainsi que les informations techniques importantes pour comprendre le projet.

---

## Prérequis

- **Node.js** v20 (version utilisée en CI)
- Un backend M-Motors accessible (l'URL est configurée via variable d'environnement)

---

## Installation

```bash
git clone <url-du-repo>
cd m-motors-frontend
npm install
```

---

## Variables d'environnement

Vigilance sur les variables d'environnement, tout doit rester dans les .env, pas de push de secret !

Créez un fichier `.env.local` à la racine :

PORT=
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_SENTRY_DSN=
SENTRY_DSN=
NEXT_PUBLIC_APP_ENV=
SENTRY_AUTH_TOKEN=
SENTRY_ORG=

Rapprochez vous de votre lead dev pour obtenir les secrets.

---

## Lancer le projet

## Développement (port 3001)\*\*

npm run dev

## Build de production puis démarrage\*\*

npm run build
npm start

---

## Stack technique

| Couche        | Technologie                             |
| ------------- | --------------------------------------- |
| Framework     | Next.js 16.2 (App Router)               |
| UI            | React 19, CSS Modules, Lucide React     |
| Langage       | TypeScript 5                            |
| Validation    | Zod 4                                   |
| Fetching      | `fetch` natif + SWR 2                   |
| Monitoring    | Sentry `@sentry/nextjs` v10             |
| Tests         | Jest 30, Testing Library React, ts-jest |
| Lint / Format | ESLint 9, Prettier                      |
| CI            | GitHub Actions                          |

---

## Architecture

Chaque domaine métier est encapsulé dans son propre dossier sous `src/@features/`, avec ses composants, hooks, services et tests colocalisés.

src/
├── @Component/ # Composants UI génériques (Modal, Status, ArrowBack…)
├── @features/
│ ├── Auth/ # Authentification, contexte, refresh token
│ ├── Business/ # Espace gestionnaire (catalogue, formulaires véhicule)
│ ├── Cart/ # Panier et options
│ ├── DetailedViewContent/ # Vue détaillée d'un véhicule
│ ├── Folders/ # Dossiers à valider / consulter
│ ├── Homepage/ # Navbar, Footer
│ ├── Payment/ # Paiement
│ ├── UserSpace/ # Profil utilisateur
│ └── Vehicles/ # Catalogue, détail véhicule
├── @mocks/ # Données fictives pour les tests
├── @utils/ # Utilitaires transverses (fetcher, formatDate, ProtectedRoute…)
└── app/ # Pages Next.js (App Router)
├── layout.tsx
├── page.tsx
├── login/ & register/
├── sale/ & rental/
├── cart/ & payment/
├── user-space/
└── business-space/

---

## Sécurité

Plusieurs mécanismes sont en place pour sécuriser l'application.

**Authentification par double token**
L'access token est stocké **en mémoire uniquement** (variable de module, jamais dans `localStorage` ni `sessionStorage`), ce qui le protège des attaques XSS. Le refresh token circule via un cookie HttpOnly géré côté backend. Chaque requête utilise `credentials: 'include'` pour transmettre ce cookie automatiquement.

**Contrôle d'accès par rôle (RBAC)**
Le composant `ProtectedRoute` vérifie à la fois l'authentification et le rôle de l'utilisateur (prop `allowedRoles`). Si la condition n'est pas remplie, l'utilisateur est redirigé vers `/login` sans afficher le moindre contenu intermédiaire.

**Validation des entrées utilisateur**
Les formulaires sont validés avec Zod côté client avant tout envoi au backend. Les schémas imposent des contraintes de type, longueur et format (regex).

**Isolation des variables d'environnement**
Toutes les URLs et clés sensibles passent par des variables d'environnement. Seules les variables préfixées `NEXT_PUBLIC_` sont exposées au navigateur.

---

## Alerting avec Sentry

Sentry est intégré à trois niveaux : **client**, **serveur Node.js** et **edge runtime**. Côté client et edge, il ne s'initialise qu'en production pour éviter le bruit en développement.

---

## Tests

La stratégie de test repose sur **Jest** avec `jest-environment-jsdom` et **Testing Library** pour les composants React.

npm test # Lance tous les tests
npm run test:watch # Mode watch
npm run test:coverage # Génère le rapport dans /coverage

---

## CI / CD

Un workflow GitHub Actions (`ci.yml`) tourne sur les branches `develop` et `main`, ainsi que sur chaque pull request. Il exécute dans l'ordre :

1. **Lint** — `eslint`
2. **Tests avec couverture** — `jest --coverage`
3. **Build Next.js** — `next build`
4. **Upload du rapport de couverture**

---

# FLUX utilisateur / administrateur

## Parcours utilisateur

Un visiteur peut consulter des véhicules. Pour déposer un dossier, il doit d'abord s'inscrire et être connecté.

Lors de la création du compte, les informations personnelles ne sont pas obligatoires. Cependant, pour déposer un dossier, l'utilisateur devra les compléter. S'il ne l'a pas fait, une fenêtre modale l'en informera et il sera redirigé vers son profil.

Une fois le dossier créé, l'utilisateur doit télécharger les justificatifs dans son dossier :

- Pièce d'identité
- Permis de conduire
- RIB

Chaque document peut être supprimé et remplacé à tout moment. Une fois les trois justificatifs téléchargés, l'utilisateur peut valider la demande d'examen.

## Processus de validation

Les statuts du dossier changent au fil des actions et informent à la fois l'utilisateur et l'administrateur :

- **Active** : en attente d'envoi des documents
- **Submitted** : documents envoyés
- **Accepted** : dossier approuvé
- **Rejected** : dossier refusé
- **Closed** : paiement effectué

## Parcours administrateur

L'administrateur peut consulter la liste des dossiers, visualiser les justificatifs et prendre une décision sur chacun : accepter ou refuser. Le statut du dossier sera mis à jour en conséquence.

## Fin du processus

Une fois un dossier accepté, un bouton "Payer" apparaît dans l'espace utilisateur. En cliquant dessus, l'utilisateur accède à son panier où il peut :

- Consulter le véhicule sélectionné
- Ajouter des options (pour les locations)
- Valider le panier

La validation du panier redirige vers la page de paiement (mockée). Vous pouvez entrer n'importe quel numéro de carte pour tester et finaliser l'achat.

⚠️ Avertissement

Cette application est un projet fictif réalisé à des fins d’apprentissage et de démonstration.

Toute ressemblance avec des marques, véhicules, images, entreprises ou services existants est purement fortuite.
Les noms, visuels et données utilisés ne sont pas destinés à représenter des entités réelles ni à un usage commercial.
