# Lumi — La forêt des lucioles

Jeu arcade original de CJAJLK Games. Site statique : déposer le dossier sur un hébergement et ouvrir `index.html`, ou l'intégrer avec une iframe.

## Parcours

Accueil illustré → menu → partie. Le menu contient le refuge des renards, les défis quotidiens et les instructions. Le retour au menu depuis une partie active demande de confirmer le départ ; les Éclats déjà gagnés sont conservés.

Sur téléphone, l'accueil du menu affiche le compagnon, les deux modes, Jouer et un objectif de collection compact. La barre du bas ouvre Accueil, Carte, Refuge et Défis ; une pastille signale les récompenses quotidiennes disponibles. Le bouton Réglages réunit son, plein écran, manette, joystick, aide et lien du profil Hub. Les records restent visibles dans les boutons de mode. En paysage court, Lumi occupe la gauche, les commandes le centre et l'objectif la droite. La navigation disparaît pendant une partie. Le menu PC garde sa disposition existante. Sur une très petite hauteur ou avec une taille de texte agrandie, le menu peut défiler pour garder toutes les actions accessibles.

## Progression

- 10 lucioles : 1 Éclat. Le reste est conservé entre les parties.
- Clairière terminée : 25 Éclats au niveau 1, puis +5 par niveau, plafonné à 125 au niveau 21.
- Trois défis quotidiens : lucioles, bonds et fleurs de lune. Récompenses de 30, 20 et 25 Éclats, à récupérer une seule fois par jour.
- Lumi est disponible dès le départ. Aurore coûte 150 Éclats, Brume 300, Sylve 650, Nyx 1 200 et Astre 2 400. Les pouvoirs des compagnons sont actifs en Aventure ; Classique conserve les mêmes règles pour tous.
- Les gardiens des forêts complètent le refuge : Flora 450, Sélène 900, Vesper 1 800 et Solstice 3 200 Éclats. Le prix reflète leur rareté visuelle et leur spécialisation, sans multiplicateur de récompenses.

## Les gardiens des quatre forêts

| Compagnon | Forêt | Bonus en Aventure |
| --- | --- | --- |
| Flora · Rare | Émeraude | Premier bond réussi de chaque clairière rechargé immédiatement. Un mur ne consomme pas ce cadeau ; perdre une vie ou mettre en pause ne le renouvelle pas. |
| Sélène · Épique | Lunaire | Après une fleur, le prochain bond réussi se recharge en 14 pas de simulation au lieu de 28. Une seule réserve, sans cumul ; perdue après une vie perdue. |
| Vesper · Épique | Violette | Le bond réussi et les deux pas de simulation suivants bénéficient d'une protection contre les collisions. Les murs restent infranchissables. |
| Solstice · Légendaire | Dorée | À 20 lucioles normales restantes ou moins, recharge en 18 pas au lieu de 28. Les fleurs ne comptent pas dans ce seuil. |

Le choix « En faire mon objectif » est indépendant de l'achat. Il affiche le compagnon souhaité, les Éclats disponibles, le montant manquant et un bouton pour jouer. Cet objectif apparaît au menu et dans le bilan de clairière ; il passe à un compagnon encore verrouillé après acquisition. Il est conservé sous `lumi-collection-goal-v1`, sans changer `lumi-progress-v1` ni attribuer de récompense supplémentaire. Les dix compagnons sont utilisables en Classique sans pouvoir.

Les quatre nouveaux PNG transparents sont en 512 × 512, environ 350–485 Kio chacun, chargés à la demande. Les briefs exacts et leur provenance imagegen sont dans `assets/guardian-art.md`.
- Sauvegarde locale dans `lumi-progress-v1`. Le record précédent `lumi-best` est conservé. Renouvellement des missions à minuit selon l'heure de l'appareil. Sans accès au stockage, l'interface avertit que la sauvegarde n'est valable que pour la session.

Pour ajouter de futurs personnages, étendre le catalogue dans `progression.js` et leur dessin dans `game.js`. Un compte et une sauvegarde serveur seront nécessaires pour partager une progression entre appareils.

## Classique et Aventure

Le mode se choisit au menu avant JOUER. Classique est le choix initial afin de préserver les règles et le record existants. Aventure active un seul pouvoir, celui du compagnon sélectionné. Le choix est conservé pour les prochaines parties ; une partie commencée garde son mode et son compagnon jusqu'à sa fin.

- Lumi — Second souffle : après une vie perdue, le premier bond réussi reste immédiatement disponible.
- Aurore — Fleur enchantée : protection des fleurs prolongée de 20 %.
- Brume — Pas léger : recharge du bond réduite de 28 à 24 pas de simulation.
- Sylve — Sentier lumineux : indication périodique du chemin vers la luciole normale la plus proche lorsqu'il en reste au maximum 10.
- Nyx — Voile lunaire : pendant 20 pas après une fleur, les papillons avancent deux fois moins souvent.
- Astre — Étoile gardienne : une collision mortelle absorbée par partie, suivie de 8 pas de protection. La protection ne se renouvelle pas à un nouveau niveau ou à la reprise d'une pause.

Le record historique reste dans `lumi-best` (Classique). Aventure utilise `lumi-best-adventure-v1`, et le choix du mode `lumi-mode-v1`. Les Éclats, achats et défis continuent d'utiliser `lumi-progress-v1`, sans changement des récompenses. Les timers des bonus sont suspendus avec la simulation, notamment en portrait mobile. Voir [COMPANION-POWERS.md](COMPANION-POWERS.md).

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

## Forêts, carnet et confort tactile

Les clairières 1–5 sont émeraude, 6–10 lunaires, 11–15 violettes et 16–20 dorées. Ce cycle visuel revient tous les vingt niveaux, sans changer les labyrinthes, ennemis, difficultés, récompenses ou règles de progression. Chaque forêt possède sa palette, ses petits décors et une séquence sonore synthétisée discrète. Le son reste désactivé par défaut et les ambiances s'arrêtent en pause ou en portrait.

La carte des clairières conserve les étapes atteintes séparément en Classique et en Aventure dans `lumi-journey-v1`. Elle constitue un carnet, sans sélection libre de niveau : une nouvelle partie commence toujours au niveau 1. Les anciens scores ne permettent pas de reconstituer les niveaux auparavant terminés ; le carnet commence à enregistrer avec cette version.

Une clairière terminée affiche le score gagné, les Éclats gagnés et les vies restantes. Le bonus de fin, de 25 à 125 Éclats selon le niveau, est inclus et attribué une seule fois. « Continuer » reprend le niveau suivant avec le même score, les mêmes vies et les pouvoirs restants du voyage.

« Confort tactile », au menu ou via ⚙ pendant une partie, propose un joystick de 76, 88 ou 104 px à gauche ou à droite. Ces préférences sont enregistrées indépendamment dans `lumi-touch-v1`. La taille se réduit si la hauteur est insuffisante. Le plateau conserve ses cases carrées et ses deux zones de commandes. Fermer les réglages laisse la partie en pause ; appuyer sur Reprendre pour continuer. Glissements et double appui restent disponibles.

Les particules sont limitées à 72, utilisent leur propre générateur déterministe et respectent la préférence de réduction des animations. La carte utilise quatre illustrations originales allégées dans assets/forest-*.jpg, également reprises pour le prochain objectif. Les briefs exacts sont dans assets/forest-art.md. Aucun fichier audio supplémentaire n'est nécessaire.

## Image d'accueil

`assets/lumi-accueil.png` a été créée avec l'outil intégré de génération d'images. Brief : renard orange original aux grandes oreilles, queue blanche et foulard menthe, clairière nocturne, lucioles vertes et fleurs de lune roses, illustration de jeu douce, sans texte, espace sombre à gauche pour le titre.

## Équilibrage de la progression

Les trois premiers niveaux gardent leur vitesse : 140, 135 et 130 ms par pas. Ensuite, le pas se réduit de 2,5 ms par niveau jusqu’à 80 ms au niveau 23. Les papillons passent progressivement de 0,5 déplacement par pas aux niveaux 1–3 à 1 au niveau 23 (+0,025 par niveau), sans le doublement brutal de l’ancien niveau 4. Un accumulateur conserve cette cadence fractionnaire, suspendu en pause et en portrait et remis à zéro à l’apparition du joueur. Les fleurs conservent leur cadence de trois pas, et le voile de Nyx la ralentit toujours de moitié.

Le bonus de fin vaut `25 + 5 × (niveau − 1)`, plafonné à 125 Éclats. Il est identique dans les deux modes, versé une seule fois et affiché dans la carte et le bilan. Exemples : niveau 1, 25 ; 4, 40 ; 6, 50 ; 11, 75 ; 16, 100 ; 21 et suivants, 125. La collecte (10 lucioles = 1 Éclat), les prix, les défis et les sauvegardes existantes sont conservés.
