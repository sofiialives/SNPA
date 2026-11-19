# SNPA — Site vitrine + CRM (première version de travail)

Première version fonctionnelle du site d'adoption et du CRM du refuge, construite à partir des
maquettes, de la charte graphique et de l'ensemble des échanges avec Sophie Morin.

**Stack :** Next.js (App Router, rendu serveur) pour le site public · Node.js + Express pour
l'API · PostgreSQL pour la base de données.

## 1. Installation

Prérequis : Node.js 18+, PostgreSQL 14+ (local ou distant).

```bash
# Backend
cd backend
npm install
cp .env.example .env         # puis renseigner DATABASE_URL, JWT_SECRET, etc.
npm run migrate               # crée les tables
npm run seed                  # données de démonstration (écrase les données existantes)
npm run dev                   # démarre l'API sur http://localhost:4000

# Frontend (dans un second terminal)
cd frontend
npm install
cp .env.example .env.local    # NEXT_PUBLIC_API_URL=http://localhost:4000
npm run dev                   # démarre le site + CRM sur http://localhost:3000
```

Site public : http://localhost:3000
CRM : http://localhost:3000/crm/login

## 2. Comptes de démonstration (mot de passe commun : `snpa2026`)

| Email | Rôle | Statut |
|---|---|---|
| sophie@snpa-refuge.fr | Administrateur·rice | Actif |
| ines@snpa-refuge.fr | Membre du personnel | Actif |
| karim@snpa-refuge.fr | Responsable des adoptions | Actif |
| lucie.benevole@example.com | Bénévole | Actif |
| marc.benevole@example.com | Bénévole | **En attente de validation** (pour tester l'écran « Équipe ») |

## 3. Ce qui est couvert

**Site public**
- Accueil, catalogue filtrable (type, compatibilité enfants/chats/chiens, tri « attend depuis le plus longtemps »)
- Fiche animal avec badges de compatibilité, formulaire de demande d'adoption (reprend tous les champs du questionnaire papier de Sophie)
- Suivi de dossier par **lien personnel** (sans création de compte), envoyé par email à la famille
- Page bénévolat (auto-inscription, mise en attente de validation par l'administrateur)
- À propos, Contact

**CRM** (accès par rôle : Administrateur, Vétérinaire, Responsable des adoptions, Personnel, Bénévole)
- Tableau de bord, gestion des animaux (statuts, interdiction de sortie)
- Demandes d'adoption : cycle de vie complet (Nouvelle → En cours d'examen → Rencontre programmée → Approuvée/Refusée → Adoptée), assignation d'un responsable
- Rendez-vous : uniquement le samedi, créneaux de 30 min, 2 familles max par créneau
- Promenades : grille du jour par animal, 2 sorties max/jour/bénévole, blocage automatique des animaux « en soins »/sous interdiction, vue « non sorties depuis plusieurs jours », pensé mobile (le bénévole réserve/démarre/termine depuis son téléphone dans la cour)
- Dossiers médicaux : historique **non modifiable**, active/lève l'interdiction de sortie, rappels de vaccin
- Équipe : invitation d'un salarié, validation des bénévoles en attente, changement de rôle
- Statistiques : vue d'ensemble uniquement — **aucune statistique individuelle par employé**, à la demande explicite de Sophie

## 4. Règles métier implémentées (issues des échanges avec Sophie)

- Un animal « En soins » ne peut pas recevoir de nouvelle demande d'adoption
- Max. 2 demandes actives par famille, et une seule par couple famille/animal
- Rencontres uniquement le samedi, créneaux de 30 min, 2 familles par créneau
- Max. 2 promenades par jour et par bénévole ; un animal sous interdiction de sortie ne peut pas être réservé
- Un compte bénévole en attente ne peut pas se connecter tant qu'il n'est pas validé par un administrateur
- Suivi familial par lien personnel (sans compte) envoyé par email
- Aucune charge de travail ni statistique par employé n'est affichée

## 5. Limites connues de cette première version (à discuter avec Sophie)

- **Emails simulés** : aucun SMTP réel n'est branché. Les emails (confirmation de demande, lien de suivi, changement de statut, invitation salarié) sont enregistrés et consultables sur `GET /api/dev/outbox` côté backend, pour vérifier que le contenu est correct avant de connecter un vrai service d'envoi (ex. Resend, Postmark).
- **Logo provisoire** : un espace réservé a été utilisé en attendant la validation du conseil d'administration — à remplacer dès que le logo définitif est prêt.
- **Photos** : seules des URLs d'images sont stockées pour le moment ; il n'y a pas encore d'upload/stockage de fichiers.
- **Base de données** : accès via `pg` (sans ORM), pour un maximum de portabilité — la configuration de connexion à votre environnement de production reste à faire (`DATABASE_URL` dans `backend/.env`).
- **Palette de couleurs** légèrement assombrie par rapport à la charte brute, pour rester lisible en extérieur en plein soleil (retour que Sophie avait fait sur une précédente version) — à valider ou ajuster.

## 6. Structure du projet

```
snpa/
├── backend/        API Node.js + Express + PostgreSQL
│   ├── migrations/ schéma SQL
│   ├── scripts/    migrate.js, seed.js
│   └── src/        routes, middleware, utils
└── frontend/       Next.js (site public + CRM)
    └── app/
        ├── (pages publiques)
        └── crm/    (pages protégées par rôle)
```
