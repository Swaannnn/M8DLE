# Contributing

Merci de contribuer a M8DLE !

## Prerequis

- Node.js 22
- Une base de donnée [Neon](https://neon.com/)
- Les variables d'environnement dans un fichier .env

## Setup local

```
npm install
npx prisma generate
npx prisma migrate dev
npm run dev
```

## Workflow Git

1. Forkez le repo et clonez votre fork.
2. Basez votre branche sur develop.
3. Utilisez un nom de branche explicite.

Exemples :

- feat/nom-feature
- fix/correction-bug

## Conventions de commit

Preferez des messages clairs et courts, de style conventionnel :

```
feat: ajout du classement global
fix: corrige le calcul des essais
```

## Qualite et verification

Avant d'ouvrir une PR :

```
npm run lint
```

Si vous modifiez le schema Prisma :

```
npx prisma migrate dev --name <nom-de-la-migration>
```

## Pull Request

Incluez dans la description :

- Contexte et objectif
- Liste des changements
- Impact sur la DB ou la configuration
- Screenshots si l'UI change

Checklist :

- La branche est a jour avec develop
- Lint OK
- Les changements sont documentes si necessaire
- Pas de secrets dans le code

## Signaler un probleme

Ouvrez une issue avec :

- Etapes pour reproduire
- Comportement attendu
- Comportement observe
- Environnement (OS, Node, navigateur)
