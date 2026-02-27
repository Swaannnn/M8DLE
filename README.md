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
- Base de données : Postgres (Neon).
- ORM : Prisma 7.
- Observabilité : Vercel Analytics + Speed Insights.

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
/data               Données locales (joueurs, images, etc.)
/hooks              Hooks client (auth, statut du jeu)
/i18n               Configuration de l'internationalisation
/lib                Accès DB et auth
/messages           fichiers de traductions (en, fr)
/prisma             Schema + migrations
/public             Assets (images, icons)
/types              Types partagés
/utils              Helpers (date, fetcher, etc.)
```

## Données et logique du jeu

- La liste des joueurs est dans data/players.json.
- Le joueur du jour est calculé via la date UTC et un index dans cette liste.
- Les invités stockent leurs essais dans localStorage; les comptes connectés sont persistés en base.

## Déploiement

```
npx prisma migrate deploy
npm run build
npm run start
```

## À améliorer

- Si vous avez de meilleures photos, n'hésitez pas à proposer des remplacements.
- Si vous avez des images manquantes, elles sont les bienvenues dans public/images/players.

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
