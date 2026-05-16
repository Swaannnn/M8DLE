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

1. Forkez et clonez votre fork.
2. Basez votre branche sur `develop`.
3. Nommez la branche : `type/ISSUE_NUMBER/nom_court` (ex: `feat/67/ajout-classement-global`).

`type` peut être `feat`, `fix` ou autre selon le changement.

## Conventions de commit

Format : `type #ISSUE_NUMBER : courte description`

Exemples :

`feature #67 : modifs faites`
`fix #42 : corrige le calcul des essais`

## Issues

Ouvrez une issue pour signaler un `bug` ou proposer une `feature` / `improvement`.

Titre — format : `TYPE: titre` (ex: `feature: ajouter un classement global`).

Description selon le type :

- **bug** :
	- Etapes pour reproduire
	- Comportement attendu
	- Comportement observé
	- Environnement (OS, Node, navigateur)
	- (Optionnel) Logs / captures d'écran

- **feature / improvement** :
	- Situation actuelle
	- Proposition
	- Pourquoi (bénéfices)
	- Impact (DB, API, UI, perf)
	- (Optionnel) Maquettes / exemples

Référencez le numéro de l'issue dans la branche et les commits lorsque pertinent (ex: `feat/67/nom_court`, `feature #67 : description`).

## Qualité et vérification

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

- La branche est à jour avec `develop`
- Lint OK
- Les changements sont documentés si nécessaire
- Pas de secrets dans le code

Cette organisation garde le document concis et facilite le triage.
	- Proposition : ce que vous proposez de changer ou d'ajouter
	- Pourquoi : bénéfices attendus et justification
	- Impact (si connu) : DB, API, UI, perf, migrations
	- (Optionnel) Maquettes, exemples ou références

Lien avec les branches et commits

- Référencez toujours le numéro de l'issue dans la branche et les commits lorsque pertinent (ex: `feat/67/nom_court` et `feature #67 : courte description`).

Cette structure aide à triager et prioriser rapidement les issues.
