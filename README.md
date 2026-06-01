# ACCESS Menu — Landing Lookbook

Direction **minimal · immersif · photographique**, façon éditorial premium (Aesop, Apple). Quatre scènes plein écran, photographies full-bleed, typographie ultra-légère (Quicksand 300), un seul message par écran.

## Ouvrir

Double-cliquez `index.html`. Aucun serveur, aucun build. Polices Google Fonts via CDN (connexion Internet requise au premier chargement).

## Structure

Quatre scènes verticales, chacune 100 vh :

1. **Hero** — photo full-bleed (intérieur de restaurant moody), titre XL « Modernisez votre commerce. », caption Lomé 2026, scroll cue en bas.
2. **Trois promesses** — layout split, image gauche (plat overhead) + chiffres droite (+30 % / 0 % / 30 sec) séparés par des hairlines.
3. **Club Founders** — photo full-bleed (dîner intimiste), titre centré « Trente places. Pas une de plus. », compteur live + CTA gold.
4. **Audit** — fond crème clair, formulaire minimaliste (3 champs avec border-bottom uniquement), CTA dark.

## Comment ça fonctionne (capture leads)

Le formulaire **ouvre WhatsApp avec un message pré-rempli** au moment de la soumission. Aucun backend nécessaire. Numéro cible : `+228 92 25 73 51` (modifiable dans `js/main.js`, constante `WA_NUMBER`).

## Pilotage du compteur

Une seule variable dans `js/main.js` :

```js
const PLACES_LEFT = 22;
```

S'affiche en synchrone dans le hero et la scène Club Founders.

## Direction créative — résumé

- **Theme** : sombre immersif (scènes 1 et 3, photos full-bleed avec scrim) + lumineux apaisé (scènes 2 et 4, sur cream).
- **Typographie** : **Quicksand uniquement**, contraste fort entre Light 300 (titres énormes, jusqu'à 148 px) et Medium 500 (corps, captions). Pas de serif, pas de mono. Pureté brand totale.
- **Photographies Unsplash** : 3 IDs sélectionnés pour leur cohérence (warm restaurant moody, plat overhead, intimate dining). À remplacer par vos vraies photos quand elles seront prêtes.
- **Layout** : 4 scènes verticales 100 vh, narration linéaire qui se lit comme un film court.
- **Motion** : photos qui se posent en `scale(1.04) → 1` (1,8 s), texte qui s'élève en arrivant dans le viewport, pulse vert/or sur les dots, scroll cue qui flotte.
- **Nav** : `mix-blend-mode: difference` — le logo reste lisible sur fonds clairs ET sombres, sans changement de couleur.
- **Form** : bordures uniquement en bas des champs, pas de label visible flottant. Aesop-style.

## Structure du projet

```
access-menu-lookbook/
├── index.html
├── css/style.css
├── js/main.js
└── README.md
```

## Customisation rapide

| Élément | Où | Comment |
|---|---|---|
| Numéro WhatsApp | `js/main.js` | `const WA_NUMBER = '22892257351'` |
| Compteur places | `js/main.js` | `const PLACES_LEFT = 22` |
| Photos scènes | `index.html` | rechercher `unsplash.com/photo-` et remplacer par vos URLs ou `assets/img/xxx.jpg` |
| Couleurs / police | `css/style.css` | variables `:root` en haut du fichier |

## Pour aller plus loin

- Remplacer les 3 photos Unsplash par vos vraies prises chez vos premiers clients.
- Brancher le formulaire sur un endpoint serveur (Google Forms, Tally, Mailchimp) en parallèle pour conserver une trace.
- Ajouter une favicon `assets/favicon.svg` (æ navy/or).
- A/B tester deux versions du hero « Modernisez votre commerce » vs « Repensez votre carte ».
