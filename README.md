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

Flèches, ZQSD ou WASD ; Espace : bond ; P/Échap : pause. Sur mobile : joystick fixe semi-transparent à gauche ou glissement sur le plateau ; bouton Bond à droite ou double appui sur le labyrinthe. Le joystick guide les changements de direction ; Lumi conserve son déplacement automatique comme auparavant. Son activable au menu ; synthèse audio dans le navigateur, sans fichiers audio externes.

## Manettes Bluetooth et USB

Le bouton **MANETTE** ouvre les réglages. Sur Android, appairer la manette dans les réglages Bluetooth, ouvrir Lumi dans Chrome et appuyer sur un bouton. Les modèles normalisés par le navigateur utilisent la croix ou le stick gauche, le bouton du bas pour valider ou effectuer un bond, le bouton de droite pour revenir et Start/Options/Menu pour la pause.

La DualSense utilise ✕, ○ et Options dans ce mode. Les manettes Xbox, PlayStation, Switch et génériques peuvent fonctionner lorsque le navigateur les expose ; les noms imprimés sur les boutons peuvent varier. **Configurer ma manette** permet d'assigner sept commandes à une croix, un stick ou des boutons et mémorise le réglage pour ce modèle. Garder le stick au repos en lançant la configuration. Utiliser FERMER au tactile pour annuler.

La partie se met en pause à la déconnexion ou à la perte de focus. Un bouton maintenu lors d'une connexion ne lance pas automatiquement une action. Le tactile et le clavier restent utilisables.

Le Hub V2-test ouvre actuellement Lumi dans un nouvel onglet : aucune modification de son lecteur n'est nécessaire. Pour une intégration future dans une iframe provenant d'une autre origine, déléguer la fonctionnalité avec `allow="gamepad"` et une politique compatible sur le site parent. L'accès doit être autorisé par le navigateur et se fait sur HTTPS (ou localhost pour le développement).

Références : [Gamepad API](https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API/Using_the_Gamepad_API), [Permissions Policy gamepad](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Permissions-Policy/gamepad).

Les commandes ont été testées avec des données de manettes simulées et l'interface a été vérifiée dans le navigateur. Une validation matérielle sur DualSense et Chrome Android reste à faire.

## Tests

## Plein écran

Sur mobile, la partie tient également dans l'écran **sans activer le plein écran**. Tous les niveaux mobiles utilisent une grille paysage de 33 × 17. Un rail gauche réserve la place du HUD et du joystick fixe ; une zone droite accueille le bouton Bond. Aucun contrôle ne couvre les cases. Chaque niveau conserve le nombre de lucioles et de fleurs de sa version PC. Les niveaux PC gardent leur grille et leur génération d'origine. La page est immobilisée seulement pendant le gameplay. Le retour au menu rétablit le défilement.

Tactile : glissements courts pour changer de direction et double appui proche en moins de 320 ms pour effectuer un bond. Un glissement n'est pas compté comme un appui. Les gestes sont capturés sur le jeu pour éviter le défilement ou le zoom de la page. Les réglages ouverts peuvent toujours défiler. Les pressions actives sont libérées à l'annulation du geste et à la perte de focus. Les commandes affichées restent disponibles sur les grands écrans.

Le bouton ⛶ dans l'en-tête ou au-dessus de la partie active le plein écran sur une action explicite du joueur. Le bouton SORTIR ou Échap sur PC permet d'en sortir. Le labyrinthe conserve ses proportions et adapte sa taille à la hauteur et à la largeur disponibles. En portrait mobile, un écran illustré demande de tourner le téléphone et suspend la simulation sans annuler une pause manuelle. Le retour en paysage conserve la partie.

Si le navigateur refuse ou ne propose pas l'API, le mode agrandi reste disponible avec un message explicatif. Les dialogs et réglages restent accessibles. Une iframe doit autoriser le plein écran (`allowfullscreen` / `allow="fullscreen"`) ; le Hub ouvre actuellement Lumi dans un nouvel onglet.

Référence : [Fullscreen API](https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API). Vérification dans le navigateur sur PC et dimensions mobiles portrait/paysage ; test matériel Chrome Android à réaliser sur le téléphone.

## Exécuter les tests

Avec Node.js : `node --test tests/*.cjs`. Aucun paquet à installer. Héberger avec un serveur statique pour une sauvegarde stable ; les polices Google sont facultatives.

## Image d'accueil

`assets/lumi-accueil.png` a été créée avec l'outil intégré de génération d'images. Brief : renard orange original aux grandes oreilles, queue blanche et foulard menthe, clairière nocturne, lucioles vertes et fleurs de lune roses, illustration de jeu douce, sans texte, espace sombre à gauche pour le titre.
