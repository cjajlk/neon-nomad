# Pouvoirs des compagnons

Le mode Aventure active un seul pouvoir par partie. Classique conserve les valeurs précédentes, quelle que soit la mascotte. Les niveaux, collisions avec les murs, prix, scores des objets, récompenses, défis quotidiens et système CJ universel sont conservés.

| Compagnon | Pouvoir Aventure | Valeur et déclenchement |
|---|---|---|
| Lumi | Second souffle | Après une vie perdue, le premier bond réussi donne une recharge de 0 au lieu de 28 pas. Une seule charge ; un bond bloqué contre un mur ne la consomme pas. |
| Aurore | Fleur enchantée | Une fleur donne 72 pas de protection au lieu de 60, y compris pendant un bond. |
| Brume | Pas léger | Recharge du bond de 24 pas au lieu de 28, soit une réduction de 14,3 %, présentée comme environ 15 %. |
| Sylve | Sentier lumineux | Pour les 10 dernières lucioles normales : plus court chemin visible pendant 14 pas, avec un intervalle de 42 pas entre deux révélations. Le chemin est recalculé depuis la position courante et ne traverse aucun mur. Les fleurs restent à chercher normalement. |
| Nyx | Voile lunaire | Après une fleur, intervalle de déplacement des ennemis doublé pendant 20 pas. Le voile est rafraîchi, pas cumulé, avec une nouvelle fleur. |
| Astre | Étoile gardienne | Absorbe une collision mortelle, une fois par partie, puis ignore les collisions mortelles pendant 8 pas. Aucun point ni Éclat accordé par le bouclier. Les collisions sous protection d'une fleur gardent leur score normal. |

Les durées suivent les pas de la simulation existante : elles évoluent avec la vitesse des niveaux. Aucun pouvoir n'avance pendant une pause, un écran de rotation ou une suspension de la simulation. Lumi avance automatiquement comme auparavant ; les pouvoirs ne modifient pas la longueur maximale du bond (3 cases).

## Cycle de vie

Le mode et le compagnon sont fixés au nouveau départ. Reprendre une pause ne recrée pas le pouvoir. Les effets temporaires sont vidés lors d'une réapparition ou d'un nouveau niveau. L'étoile déjà consommée par Astre reste consommée jusqu'à la prochaine partie. Le premier bond gratuit de Lumi est accordé après la réapparition consécutive à une vie perdue.

La réapparition rechargeait déjà le bond pour tous les personnages dans le jeu précédent. Le bonus de Lumi rend donc le premier bond suivant immédiatement réutilisable, plutôt que de modifier la réapparition commune.

## Sauvegardes et records

- `lumi-progress-v1` : progression existante, inchangée.
- `lumi-best` : record historique, réservé au mode Classique.
- `lumi-best-adventure-v1` : nouveau record Aventure.
- `lumi-mode-v1` : préférence de mode. Sans préférence existante, Classique est sélectionné.

Les deux modes gagnent les mêmes Éclats selon les mêmes règles. Un score Aventure n'écrit jamais dans le record Classique. Les scores historiques ne sont ni réinitialisés ni attribués à l'Aventure. En cas de stockage indisponible, les nouveaux records et le choix restent utilisables en mémoire.

## Interface et validation

Le menu montre les deux modes, leur record et le pouvoir du compagnon. Le refuge décrit le pouvoir sur chaque carte, avant l'achat. Le HUD indique le mode et le pouvoir, dans l'espace déjà réservé à l'interface. Les effets visuels du sentier et de l'étoile sont dessinés dans le canvas.

Les tests couvrent chaque pouvoir dans le moteur, les limites et renouvellements, les récompenses identiques, les records séparés, la pause/rotation et une clairière complète avec ennemis actifs pour les six compagnons. La difficulté et le ressenti sur téléphone restent à valider par les joueurs.
