# M8DLE

M8DLE est un jeu quotidien inspiré de Wordle basé sur l'univers Gentle Mates. Devine le joueur du jour et compare ton score avec la communauté.

## Fonctionnalités

- Mode invité avec sauvegarde locale, synchronisation des tentatives à la connexion.
- Connexion Discord (OAuth2) et sessions JWT via cookies.
- Classement global (victoires et moyenne d'essais).

## Stack technique

- Frontend : Next.js 16 (App Router), React 19.
- UI : Chakra UI + Tailwind CSS 4.
- Backend : API Routes Next.js.
- Base de données : Postgres (Neon ou Postgres classique).
- ORM : Prisma 7.
- Observabilité : Vercel Analytics + Speed Insights (uniquement sur Vercel).
- Déploiement : Docker / Coolify (ou Vercel).

## Prérequis

- Node.js 22.
- Une base de données [Neon](https://neon.com/).
- Une application Discord OAuth2.

## Configuration

Créer un fichier .env à la racine :

```
DATABASE_URL="postgresql://neondb_owner:[...]"
AUTH_SECRET=change-me
DISCORD_CLIENT_ID=your-client-id
DISCORD_CLIENT_SECRET=your-client-secret
DISCORD_REDIRECT_URI=http://localhost:3000/api/auth/callback
```

## Installation (fresh clone)

```
npm install
npx prisma generate
npx prisma migrate dev
npm run dev
```

L'app tourne ensuite sur http://localhost:3000.

## Scripts

```
npm run dev
npm run build
npm run start
npm run lint
```

## Structure du projet

```
/app                Pages et API routes (App Router Next.js)
/components         UI et composants métier
/constants          Constantes globales
/hooks              Hooks client (auth, statut du jeu)
/i18n               Configuration de l'internationalisation
/lib                Accès DB, auth et polices
/messages           fichiers de traductions (en, fr)
/prisma             Schema + migrations
/public             Assets (avatar par défaut, image de partage)
/types              Types partagés
/utils              Helpers (date, client API, joueurs, etc.)
```

## Données et logique du jeu

- Les joueurs sont stockés en base (Prisma).
- Le joueur du jour est tiré au sort côté serveur à la première demande de la journée, puis persisté dans la table PlayerOtd (voir utils/player/playerOfTheDay.ts). Le tirage n'est volontairement pas reproductible côté client, et écarte les joueurs déjà sortis dans les 7 derniers jours.
- Le catalogue des joueurs et le joueur du jour sont mis en cache en mémoire par instance serveur (voir utils/player/catalogue.ts) : une modification admin est visible sous 60 s sur les autres instances.
- Les essais sont persistés en base pour tous, invités compris (session invité via cookie) ; la partie invité est rattachée au compte à la connexion.

## Déploiement

### Coolify (Docker)

Le projet est livré avec un `Dockerfile` (build Next.js en sortie `standalone`, Node 22 alpine).

1. Dans Coolify, créer une ressource **Application** depuis le dépôt Git, avec le Build Pack **Dockerfile**.
2. Port exposé : `3000`. Healthcheck : `GET /api/health` (déjà défini dans l'image).
3. Renseigner les variables d'environnement (voir .env.example) : `DATABASE_URL`, `AUTH_SECRET`, `DISCORD_CLIENT_ID`, `DISCORD_CLIENT_SECRET`, `DISCORD_REDIRECT_URI` (ex. `https://m8dle.com/api/auth/callback`, à ajouter aussi dans les redirects de l'application Discord), `CLOUDINARY_*`, `CRON_SECRET`, `MAINTENANCE_MODE`. Elles ne sont lues qu'à l'exécution : aucune n'a besoin d'être cochée « Build Variable ».
4. Base de données : Neon ou n'importe quel Postgres (ex. une ressource PostgreSQL Coolify). Le driver Prisma est choisi automatiquement selon `DATABASE_URL` (forçable avec `DATABASE_DRIVER=neon|pg`).
5. Les migrations (`prisma migrate deploy`) sont appliquées au démarrage du conteneur. Pour les désactiver : `SKIP_MIGRATIONS=true`.
6. Nettoyage des parties invité : ajouter une **Scheduled Task** sur l'application, fréquence `0 4 * * *`, commande :

```
sh -c 'wget -qO- --header="Authorization: Bearer $CRON_SECRET" http://127.0.0.1:3000/api/cron/cleanup-guest-results'
```

Le mode maintenance est activé avec `MAINTENANCE_MODE=true` ; un redémarrage du conteneur suffit pour le prendre en compte (pas de rebuild).

Vercel Analytics et Speed Insights ne sont chargés que sur Vercel (variable `VERCEL` présente).

Test local de l'image :

```
docker build -t m8dle .
docker run --rm -p 3000:3000 --env-file .env m8dle
```

### Vercel

```
npx prisma migrate deploy
npm run build
npm run start
```

Un Cron Job Vercel (voir vercel.json) nettoie quotidiennement les parties invité jamais rattachées à un compte. Il nécessite la variable d'environnement `CRON_SECRET` (voir .env.example) sur le projet Vercel — Vercel l'ajoute automatiquement en en-tête `Authorization` sur ces appels.

Le mode maintenance est activé avec la variable d'environnement `MAINTENANCE_MODE=true` (voir .env.example). Sur Vercel, un redéploiement est nécessaire pour qu'un changement de valeur soit pris en compte.

## À améliorer

- Si vous avez de meilleures photos, n'hésitez pas à proposer des remplacements.
- Si vous avez des images manquantes, elles sont les bienvenues (elles sont hébergées sur Cloudinary et ajoutées depuis l'administration).

Photos à trouver ou à remplacer si vous en avez :

- APO ?
- RADOSIN
- joueuses GC
- jedusor
- snayzy
- akiira ?
- podasai ?
- xsweese
- malibuca
- P1ng
- mireu
- kamilus
- erdote
- comp
- felo
- sky
- pr1estahh
- kismet ?

## Contribuer

Voir CONTRIBUTING.md pour le workflow et les règles.

## Licence

Ce projet est sous licence MIT. Voir le fichier LICENSE pour plus d'informations.
