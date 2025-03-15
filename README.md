# ProjectManager

## Description
ProjectManager est un outil de gestion de projet automatisé utilisant Node.js et Git. Il permet d'initialiser, mettre à jour et gérer un dépôt GitHub, de générer une arborescence de fichiers, de lister les fonctions des fichiers JS, et de regrouper le code dans un fichier exploitable.

## Prérequis
- Node.js installé
- Git installé et configuré
- Accès au dépôt GitHub : [https://github.com/therealvan/ProjectManager](https://github.com/therealvan/ProjectManager)

## Installation
1. Clonez le dépôt :
   ```bash
   git clone https://github.com/therealvan/ProjectManager.git
   ```
2. Accédez au dossier :
   ```bash
   cd ProjectManager
   ```
3. Exécutez le script d'initialisation :
   ```bash
   node StartProject.js
   ```

## Utilisation
- **Initialiser le projet** : `node StartProject.js`
- **Mettre à jour le projet** : `node UpdateProject.js`
- **Gérer les branches** :
  - Créer une branche distante : Modifier `UpdateProject.js` pour appeler `createBranch('nom')`
  - Supprimer une branche distante : Modifier `UpdateProject.js` pour appeler `deleteBranch('nom')`
- **Pousser les modifications** : Modifier `UpdateProject.js` pour appeler `pushChanges()`

## Structure du projet
```
├── src/
│   └── GitHub/
│       ├── DiagGitHub.js  # Logs d'erreurs
│       └── GitHub.js      # Fonctions Git
├── Arborescence.js        # Génère l'arborescence
├── Code.js                # Regroupe le code JS
├── Fonctions.js           # Liste les fonctions
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

## Contribution
1. Forkez le projet
2. Créez une branche pour vos modifications
3. Soumettez une pull request

## Licence
Aucune licence spécifiée pour le moment.
