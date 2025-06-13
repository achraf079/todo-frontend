# Todo List Fullstack Project

Ce projet est une application Todo List développée avec **React** pour le front-end et **NestJS** pour le back-end.  
Elle permet de gérer des tâches simples : création, modification, suppression et affichage en temps réel.

---

## Fonctionnalités

- Lister toutes les tâches existantes
- Ajouter une nouvelle tâche
- Modifier le nom d’une tâche (la modification n’est possible que si le nom change réellement)
- Supprimer une tâche
- Interface utilisateur moderne et responsive basée sur Material UI
- Validation côté serveur et côté client pour éviter les erreurs

---

## Technologies utilisées

### Back-end

- [NestJS](https://nestjs.com/) : Framework Node.js pour construire l’API REST
- [Prisma](https://www.prisma.io/) : ORM pour gérer la base de données
- Base de données (PostgreSQL, MySQL, SQLite selon ta configuration)
- TypeScript

### Front-end

- [React](https://reactjs.org/) avec hooks et TypeScript
- [Material UI](https://mui.com/) pour les composants graphiques
- Vite pour le bundling et le dev server
- Fetch API pour les appels réseau, encapsulé dans un hook custom `useFetch`

---

## Prérequis

- Node.js >= 16.x
- npm ou yarn installé globalement
- Base de données configurée et accessible

---

## Installation et lancement

### Back-end

1. Clone le projet ou récupère le code dans un dossier `backend`
2. Installe les dépendances

```bash
cd backend
npm install
# ou yarn install
````

3. Configure ta base de données dans le fichier `.env` (ou selon la config Prisma)

4. Lance la migration Prisma (si besoin)

```bash
npx prisma migrate dev
```

5. Démarre le serveur NestJS en mode développement

```bash
npm run start:dev
# ou yarn start:dev
```

Le serveur tournera sur `http://localhost:3000`

---

### Front-end

1. Depuis la racine du projet, entre dans le dossier `frontend`

```bash
cd frontend
```

2. Installe les dépendances

```bash
npm install
# ou yarn install
```

3. Lance le serveur de développement Vite

```bash
npm run dev
# ou yarn dev
```

L’application sera accessible sur `http://localhost:5173`

---

## Utilisation

* L’interface principale affiche la liste des tâches récupérées depuis le back-end.
* Pour ajouter une tâche : clique sur le bouton "Ajouter une tâche", saisis le nom puis valide.
* Pour modifier une tâche : clique sur le nom de la tâche, modifie le texte puis clique sur "Modifier".
* Pour supprimer une tâche : clique sur la corbeille à côté de la tâche.
* Les actions déclenchent des requêtes HTTP vers l’API, et la liste se rafraîchit automatiquement.

---

## Architecture & organisation du code

### Back-end (NestJS)

* `src/controllers/TaskController.ts` : Point d’entrée HTTP des tâches, routes GET, POST, PATCH, DELETE
* `src/useCases/` : Logique métier (création, suppression, modification, lecture)
* `src/repositories/` : Abstraction d’accès à la base de données via Prisma
* `src/entities/` : Définition des entités et DTOs

### Front-end (React)

* `src/components/TodoPage.tsx` : Composant principal de la Todo List avec UI et appels API
* `src/hooks/useFetch.ts` : Hook personnalisé pour centraliser les appels fetch (GET, POST, PATCH, DELETE)
* `src/index.tsx` : Entrée React

---

## Conseils & améliorations possibles

* Ajouter une authentification JWT pour sécuriser les accès
* Améliorer la gestion des erreurs et afficher des messages utilisateur
* Ajouter un loader / spinner pendant les appels API
* Implémenter des tests unitaires (Jest pour backend, React Testing Library pour frontend)
* Mettre en place une CI/CD (GitHub Actions, GitLab CI)
* Dockeriser l’application pour déploiement facilité

---

## Contact

Pour toute question, problème ou suggestion :
Email : Achrafsaber007@hotmail.com
GitHub : https://github.com/achraf079
