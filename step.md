# Etape 1

La pages index
=> Description
=> bouton de démarrage
=> classement

La page de jeu
=> Affichage du chrono
=> Affichage du nombre de coups
=> Affichage du nombre de paires

Création du dispositf de chrono
création d'un premier objet memory dans localStorage en guise de stockage "persistant"

Dans cette étape des placeholders seront mis pour le classement
Et un bouton est mis dans la page de jeu pour revenir vers l'index

Cette partie met le gros du design en place

# Etape2

Créer des objets cartes
Générer un paquet comme une collection de cartes
Mélanger le paquet

Premier affichage en disposant par rangée les cartes mélangées

# Etape3

Trouver image atout et dos de carte
Permettre l'acion de retournée les cartes
Affichage des éléments caché lorsque la carte est retournée
Incrémenter le nombre de coup sur l'action d'afficher

Premier essai de css pour les cartes

# Etape4

Compter le nombre de carte retournée
=> vérifier dans le cas de 2 cartes, s'il y a une paire
==> incrémenter le nombre de paires trouvées

Changer l'identification des paires trouvées pour ne pas les inclure dans les recherches de carte retournée

# Etape5

Retirer le bouton de retour au menu
Ajouter condition de fin de jeu quand le nombre de paire correspond au nombre de carte différent du premier paquet de carte
Déplacer la logique dernière le boutton de retour dans la logique de fin de partie
gestion timer, nombre de coup et nombre de paire dans l'objet memory dans local storage
=> servira pour le calcul du score

# Etape6

Calcul du score final au retour dans le menu principal
Ajout au classement s'il fait partie des 10 meilleurs scores
=> Demander un pseudo
==>si pas de pseudo, alors pas de classement

# Etape 7

Les bonus:

confort de navigation:
.Remettre un boutton de retour au menu
=> pas de calcul de score

animation:
.animation du retournement des cartes

design:
.repenser un peu le design des pages
