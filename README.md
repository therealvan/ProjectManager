![Generated Image](./generated_image.jpg)

# ProjectManager

## Description
ProjectManager est un outil de gestion de projet automatisé utilisant Node.js et Git. Il permet d'initialiser, mettre à jour et gérer un dépôt GitHub, de générer une arborescence de fichiers, de lister les fonctions des fichiers JS, et de regrouper le code dans un fichier exploitable.

## Prérequis
- Node.js installé
- Git installé et configuré
- Accès au dépôt GitHub : [https://github.com/therealvan/ProjectManager](https://github.com/therealvan/ProjectManager)

## Structure du projet
```
├── src/
│   └── GitHub/
│       ├── DiagGitHub.js  # Logs d'erreurs
│       └── GitHub.js      # Fonctions Git
├── Arborescence.js        # Génère l'arborescence
├── Code.js                # Regroupe le code JS
├── Fonctions.js           # Liste les fonctions
├── Readme.js              # Met à jour ce README
├── StartProject.js        # Initialise le projet
├── UpdateProject.js       # Met à jour le projet
├── README.md              # Ce fichier
├── Branche.git            # Branche active
└── *.grok                 # Fichiers générés
```

## Fonctionnalités
- Clonage du dépôt depuis GitHub
- Nettoyage et gestion des fichiers locaux
- Création et suppression de branches distantes
- Push forcé priorisant le local
- Génération d’arborescence et de listes de fonctions
- Mise à jour automatique du README à chaque push

## Contribution
1. Forkez le projet
2. Créez une branche pour vos modifications
3. Soumettez une pull request

## Dernière mise à jour
15/03/2025 12:28:44

## Licence
Aucune licence spécifiée pour le moment.
