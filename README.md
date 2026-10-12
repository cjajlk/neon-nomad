# Lumi — La forêt des lucioles

Jeu arcade original de CJAJLK Games. Site statique : déposer le dossier sur un hébergement et ouvrir `index.html`, ou l'intégrer avec une iframe.

## Parcours

Accueil illustré → menu → partie. Le menu contient le refuge des renards, les défis quotidiens et les instructions. Le retour au menu depuis une partie active demande de confirmer le départ ; les Éclats déjà gagnés sont conservés.

## Progression

- 10 lucioles : 1 Éclat. Le reste est conservé entre les parties.
- Clairière terminée : 25 Éclats bonus.
- Trois défis quotidiens : lucioles, bonds et fleurs de lune. Récompenses de 30, 20 et 25 Éclats, à récupérer une seule fois par jour.
- Lumi est disponible dès le départ. Aurore coûte 150 Éclats, Brume 300. Variantes cosmétiques avec les mêmes capacités.
- Sauvegarde locale dans `lumi-progress-v1`. Le record précédent `lumi-best` est conservé. Renouvellement des missions à minuit selon l'heure de l'appareil. Sans accès au stockage, l'interface avertit que la sauvegarde n'est valable que pour la session.

Pour ajouter de futurs personnages, étendre le catalogue dans `progression.js` et leur dessin dans `game.js`. Un compte et une sauvegarde serveur seront nécessaires pour partager une progression entre appareils.

## Commandes

Flèches, ZQSD ou WASD ; Espace : bond ; P/Échap : pause. Sur mobile/tablette : glissement ou pad. Son activable au menu ; synthèse audio dans le navigateur, sans fichiers audio externes.

## Vérification

Avec Node.js : `node --test tests/*.cjs`. Aucun paquet à installer. Héberger avec un serveur statique pour une sauvegarde stable ; les polices Google sont facultatives.

## Image d'accueil

`assets/lumi-accueil.png` a été créée avec l'outil intégré de génération d'images. Brief : renard orange original aux grandes oreilles, queue blanche et foulard menthe, clairière nocturne, lucioles vertes et fleurs de lune roses, illustration de jeu douce, sans texte, espace sombre à gauche pour le titre.
