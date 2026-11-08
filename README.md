# Secret Santa

Organise un Secret Santa : création de l'événement, participants, tirage au sort confidentiel et e-mail avec un lien secret pour chacun.

Stack : Next.js (App Router) + TypeScript + Tailwind, Neon Postgres + Drizzle, Resend, déployé sur Vercel.

## Développement

```bash
cp .env.example .env.local   # renseigner les variables
npm install
npm run dev
npm test
```

Migrations : `npm run db:generate` puis `npm run db:migrate`.

## Mise en production (Vercel)

1. Importer le dépôt dans Vercel.
2. Ajouter l'intégration **Neon** (Vercel > Storage) : elle fournit `DATABASE_URL`.
3. Appliquer le schéma une fois : `DATABASE_URL=… npm run db:migrate`.
4. Créer un compte **Resend**, vérifier le domaine `abdennour.tech` (enregistrements SPF et DKIM dans le DNS) et renseigner `RESEND_API_KEY` et `MAIL_FROM`.
5. Définir `APP_URL` sur l'adresse publique (ex. `https://santa.abdennour.tech`) et ajouter ce domaine dans Vercel.

Sans `RESEND_API_KEY`, les e-mails ne sont pas envoyés mais écrits dans les logs du serveur (pratique en local).
