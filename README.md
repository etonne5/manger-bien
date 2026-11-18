# MANGER BIEN — site vitrine

Site web du restaurant africain **MANGER BIEN** (Moungali, Brazzaville) : grillades au feu,
plats traditionnels, commande sur WhatsApp, carte et itinéraire.

Stack : **Vite 5 + React 18 + TypeScript + Tailwind CSS 3 + Leaflet**.

## Lancer le site en local

```powershell
npm install
npm run dev
```

Le site s'ouvre automatiquement sur **http://localhost:5173**.
Si le navigateur ne s'ouvre pas, clique sur le lien affiché dans le terminal.

## Autres commandes

| Commande | Effet |
|---|---|
| `npm run dev` | Serveur de développement avec rechargement à chaud |
| `npm run build` | Vérifie les types puis génère le site final dans `dist/` |
| `npm run preview` | Sert le dossier `dist/` (http://localhost:4173) |
| `npm run typecheck` | Vérifie TypeScript seulement |

## Structure

```
index.html          page hôte (titre, description, favicon)
main.tsx            point d'entrée React
App.tsx             tout le site : accueil, menu, histoire, galerie, contact
index.css           Tailwind + styles maison (or / noir / rouge / crème)
assets/             photos des plats, du chef et de la salle
public/logo.png     logo utilisé comme favicon
tailwind.config.js  fichiers scannés par Tailwind
```

## Personnaliser

- **Plats, prix, descriptions** : tableau `dishes` en haut de `App.tsx`.
- **Numéro WhatsApp** : constantes `WA_NUMBER` / `WA_DISPLAY` dans `App.tsx`.
- **Adresse et coordonnées GPS** : constante `place` (carte et bouton Itinéraire).
- **Couleurs** : variables `--or`, `--rouge`, `--noir` dans `index.css`.

La carte utilise les tuiles OpenStreetMap : elle nécessite une connexion internet
(un message de repli s'affiche hors ligne, l'adresse reste visible).

## Remarque sur l'origine du code

Ce composant provenait d'un « artifact » : il importait les images depuis
`container:///mnt/data/src/assets/...` et une librairie `@meta-ai/artifact-maps`
non disponible sur npm. Ces imports ont été remplacés par des imports Vite locaux
et la carte par Leaflet. L'archive `Manger+Bien+Css+Bootstrap.tar.gz` d'origine
reste sur le disque mais n'est pas versionnée (voir `.gitignore`).

## Mettre le projet sur GitHub

Le dépôt local est déjà initialisé (branche `main`, commit initial). Il reste à le
relier à GitHub :

1. Créer un dépôt **vide** nommé `manger-bien` sur https://github.com/new
   (ne rien cocher : ni README, ni `.gitignore`, ni licence).
2. Dans le dossier du projet :

```powershell
git remote add origin https://github.com/<ton-compte>/manger-bien.git
git push -u origin main
```

Une fenêtre de connexion GitHub s'ouvre au premier `push` (Git Credential Manager).

Variante avec GitHub CLI :

```powershell
winget install --id GitHub.cli -e
gh auth login
gh repo create manger-bien --public --source=. --remote=origin --push
```

`node_modules/`, `dist/`, `.npm-cache/`, `.clippy/` et l'archive `.tar.gz` ne sont
pas versionnés : le dépôt ne contient que les sources, les images et la documentation.

