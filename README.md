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
