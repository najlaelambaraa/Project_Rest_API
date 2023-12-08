# Rest API

Cette application backend, construite avec Node.js et le framework Express, constitue une API REST qui communique avec une base de données MySQL via la bibliothèque mysql2. Elle propose diverses fonctionnalités, dont la gestion d'utilisateurs, d'univers, de personnages, de conversations, ainsi que des échanges de messages et la génération d'images avec une IA. Les opérations CRUD (Create, Read, Update, Delete) sont disponibles pour chaque entité, incluant des fonctionnalités telles que l'authentification, la création d'univers, la modification de personnages, et la gestion des conversations.

## Pré-requis

   - Langage : Node.js v18.18.2
   - Gestionnaire de dépendances : npm v9.8.1
  -  Moteur de base de données : MySQL v8.0

## Installation

1. **Clonez le dépôt depuis GitHub**:

    ```bash
    git clone https://github.com/najlae-lambaraa/Project_Rest_API
    cd Project_Rest_API
    ```
2. **Accédez au répertoire du projet**:

    ```bash
    cd Project_Rest_API
    ```
3. **Installation des dépendances**:

    ```bash
    npm install
    ```

4. **Mise en place de la structure de la base de données**:

    - Importez le fichier SQL dans votre base de données phpMyAdmin.

4. **Mise en place de l’environnement**:

    - Créez un fichier .env à la racine du projet, en vous basant sur le modèle fourni dans le fichier .env.example ou Copiez le fichier .env.example en un nouveau fichier .env :
    ```bash
    cp .env.example .env
    ```
    - Configurez les variables d'environnement nécessaires comme suit :

 ```bash
OPENAI_KEY=VotreCleOpenAI
CLIPDROP_API_KEY=VotreCleClipDrop
SECRET_KEY=VotreSecretKeyDuToken
DB_TYPE=MySQL
DB_HOST=localhost
DB_USER=VotreNomUtilisateurBDD
DB_PASSWORD=VotreMotDePasseBDD
DB_DATABASE=VotreNomDeBaseDeDonnées
```


## Lancement

Utilisez la commande suivante pour lancer l'application :

```bash
npm start
```
- L'application sera accessible à l'adresse http://localhost:8080.
##  Utilisation
 - Assurez-vous que l'application est en cours d'exécution.
 - Utilisez Postman pour effectuer des requêtes HTTP à l'API.
   

| Methodes               | URL                     | ACTION                |
| ----------------------- | ----------------------- | --------------------- |
| POST                    | /users                  | Création d'un utilisateur |
| POST                    | /auth                   | Identification (obtention du token JWT) |
| PUT                     | /users/:userId              | Modification d'un utilisateur (vérification du token) |
| GET                     | /users/:userId             | Récupération d'un utilisateur |
| GET                     | /users                  | Récupération de tous les utilisateurs |
| GET                     | /universes              | Récupération de tous les univers |
| POST                    | /universes              | Création d'un univers |
| GET                     | /universes/:universeId           | Récupération d'un univers |
| PUT                     | /universes/:universeId           | Modification d'un univers |
| DELETE                  | /universes/:universeId            | Suppression d'un univers et de tous les personnages associés |
| GET                     | /universes/:univerId/characters | Récupération de tous les personnages d'un univers |
| POST                    | /Universes/:univerId/characters | Création d'un personnage dans un univers |
| PUT                     | /universes/:univerId/characters/:charactersId | Modification d'un personnage dans un univers |
| DELETE                  | /universes/:univerId/characters/:charactersId | Suppression d'un personnage dans un univers |
| GET                     | /conversations          | Récupération des conversations en cours  |
| POST                    | /conversations          | Création d'une nouvelle conversation avec un personnage |
| GET                     | /conversations/:conversationId  | Récupération d'une conversation avec le personnage et l'univers complet |
| DELETE                  | /conversation/:character_id        | Suppression d'une conversation avec un personnage |
| GET                     | /conversations/:conversationId/messages | Récupération de l'historique des messages d'une conversation |
| POST                    | /conversations/:conversationId/messages | Envoi d'un nouveau message dans la conversation  |
| PUT                     | /conversations/:conversationId        | Régénération du dernier message d'une conversation |

## Auteur :
* <a >NAJLAE LAMBARAA</a>
