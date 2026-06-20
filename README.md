# Refactoring

Phase 3 - Test &lt;/Alt>
> Comportement conservé :
les remises par paliers s'écrasent mutuellement.
Le code legacy signale ce comportement comme un "bug intentionnel".


---

# Installation

## Prérequis

- TypeScript version 5.9
- NPM version 10.9

## Commandes

Commande pour installer les dépendances
`npm install`

Exécution de l'ancien code
`npm legacy`

Exécuter le code refactoré
`npm start`

Commande pour lancer tous les tests
`npm test`

## Choix de Refactoring

### Problèmes Identifiés dans le Legacy

1. Grosse répétition de la fonction de parsing du CSV : Gros bloc de code, peu digeste, susceptible d'apporter des
   erreurs

- Impact : gros risques d'erreur et gros inconfort pour le développeur

2. Les fonctions sont trop "multitache" : la plupart des fonctions de l'application exécutent plusieurs missions.

- Impact : faire une modification implique de devoir potentiellement modifier des fonctionnalités sans lien avec la
  modification initiale

3. Les règles "bonus" sont mélangées aux fonctions : Les règles de calcul sont disséminées au sein des fonctions

- Impact : si la règle doit être utilisée dans plusieurs cas, il faut la dupliquer

4. Le système de points de fidélité parait bancal : L'application part de 0 et ajoute les points en fonction des
   commandes.

- Impact : des points de fidélités sont probablements oubliés par moment. Chaque solde de point est réinitialisé lors de
  l'importation d'un nouveau fichier de commandes.

### Solutions Apportées

1. [Amélioration 1] : Les parsing de fichiers sont chacun dans un fichier séparé, dans un dossier dédié au parsing

- Justification : La séparation des responsabilités : une fonction pour un parsing.

2. [Amélioration 2] : Sortir les règles des blocs de fonctionnalités. Les différentes règles sont dans des services dédiés en fonction du type de règle (promotion? gestion?)

- Justification : permet de réutiliser les règles si besoin. Elles sont aussi différenciées pour pouvoir les retrouver facilement.

3. [Amélioration 3] : Le système de points de fidélité mériterait d'avoir un solde attribué. Soit dans le fichier
   Customers.csv soit un fichier nouveau avec les soldes actuels du client.

- Justification : les points ne seraient plus calculés à la volée, le solde serait stable et justifiable.

## Architecture Choisie

Découpage de l'arborescence en utilité :

- dossier models pour stocker les Schema, pour la bibliothèque Zod
- dossier services pour les méthodes métier de l'application
- fichier global.constants.ts pour ranger les constantes globales de l'application
- dossier parsing pour ranger les fonctions servant à parser les fichiers CSV

## Limites et Améliorations Futures

### Ce qui n'a pas été fait (par manque de temps)

- Ajout de try/catch pour remonter les erreurs
- Tests unitaires : Vérifier que les fonctions fonctionnent comme souhaitées
- Tests de non régression : Vérifier que les fonctions fonctionnent ensemble
- Vérification des calculs : le test de comparaison montre une différence de résultats
- Création du JSON résumé des informations

### Compromis Assumés

- Le code a été testé localement : une vérification manuelle a été faite pour vérifier le bon fonctionnement
- Le code se lance sans erreurs : même en l'absence de tests, le code devait fonctionner

### Pistes d'Amélioration Future

- Ajouter les tests unitaires pour chaque fonction
- Ajouter les tests de non-régression