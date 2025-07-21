# TeamTrack

Projet de gestion d'équipe et de tâches développé avec MongoDB, Express.js et Nuxt.js.

## Configuration et installation

### Backend

#### Configuration de l'environnement

1. Dupliquez le fichier `.env.example` et renommez-le en `.env`
2. Modifiez les variables suivantes dans le fichier `.env` :

```env
CONNECTION_STRING="votre_lien_de_bdd_mongodb"
TOKEN_SECRET='votre_secret_jwt_genere'
```

#### Génération du secret JWT

Pour générer un secret sécurisé pour les tokens JWT, vous pouvez utiliser une des méthodes suivantes :

**Méthode 1 : Node.js**

```javascript
require("crypto").randomBytes(64).toString("hex");
```

**Méthode 2 : Ligne de commande (Linux/Mac)**

```bash
openssl rand -hex 64
```

#### Lancement du backend

1. Installez les dépendances : `npm install`
2. Démarrez le serveur : `npm run dev`
3. Le backend doit tourner sur le **port 3001**
4. Attendez de voir le message `"Database connected"` dans le terminal avant de continuer

### Frontend (Nuxt.js)

#### Configuration

Aucun fichier `.env` n'est nécessaire pour le frontend.

Si vous souhaitez modifier l'URL d'appel de l'API, modifiez le fichier `nuxt.config.ts` :

```typescript
nitro: {
  devProxy: {
    "/api": {
      target: "http://localhost:3001",
      changeOrigin: true,
      prependPath: false,
    },
  },
}
```

Et le fichier `utils/auth.js`

#### Lancement du frontend

1. Installez les dépendances : `npm install`
2. Démarrez l'application : `npm run dev`

## Fonctionnalités

### Authentification

- **Inscription** : Créer un nouveau compte utilisateur
- **Connexion** : Se connecter avec ses identifiants
- **Déconnexion** : Se déconnecter de l'application

### Gestion des projets

- **Visualisation** : Voir tous les projets dont vous êtes propriétaire ou collaborateur
- **Suppression** : Supprimer un projet (uniquement si vous êtes le propriétaire)

### Gestion des tâches

- **Visualisation** : Voir toutes les tâches d'un projet
- **Création** : Créer une nouvelle tâche (si vous êtes collaborateur ou propriétaire du projet)
- **Modification du statut** : Changer le statut d'une tâche (uniquement par la personne assignée ou le créateur de la tâche)
- **Suppression** : Supprimer une tâche (uniquement par la personne qui l'a créée)

### Gestion du profil

- **Modification** : Modifier votre nom d'utilisateur ou email

## Notes

- Le backend doit être démarré avant le frontend
- Assurez-vous que MongoDB est accessible via votre CONNECTION_STRING
- Les ports par défaut sont 3001 (backend) et 3000 (frontend)
