import { Resend } from "resend";

export function appUrl(): string {
  return (process.env.APP_URL ?? "http://localhost:3000").replace(/\/$/, "");
}

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("fr-FR", { dateStyle: "full", timeZone: "UTC" }).format(new Date(`${iso}T00:00:00Z`));
}

type Content = { subject: string; html: string; text: string };
type Mail = Content & { to: string; idempotencyKey?: string };

/** Sends through Resend. Without an API key (local dev), logs the mail instead. */
export async function sendMail(mail: Mail): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.info(`[mail non envoyé, RESEND_API_KEY absent] à ${mail.to} : ${mail.subject}\n${mail.text}`);
    return;
  }
  const from = process.env.MAIL_FROM ?? "Secret Santa <santa@abdennour.tech>";
  const { error } = await new Resend(key).emails.send(
    { from, to: mail.to, subject: mail.subject, html: mail.html, text: mail.text },
    mail.idempotencyKey ? { idempotencyKey: mail.idempotencyKey } : undefined,
  );
  if (error) throw new Error(`Envoi impossible : ${error.message}`);
}

/** Email-safe layout: inline styles, no web fonts, no animation. */
function layout(title: string, bodyHtml: string, button: { label: string; url: string }, note = "Ce lien est personnel et secret : ne le transfère à personne."): string {
  return `<!doctype html><html lang="fr"><body style="margin:0;background:#fbf6ef;font-family:Arial,Helvetica,sans-serif;color:#2a1a1f">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:24px 12px">
<table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden">
<tr><td style="background:#8e1328;padding:28px 24px;text-align:center;color:#ffffff;font-family:Georgia,serif;font-size:26px">&#10052; ${esc(title)} &#10052;</td></tr>
<tr><td style="height:4px;background:#d4a64a;line-height:4px;font-size:0">&nbsp;</td></tr>
<tr><td style="padding:28px 24px;font-size:16px;line-height:1.5">${bodyHtml}
<p style="text-align:center;margin:28px 0"><a href="${esc(button.url)}" style="background:#c41e3a;color:#ffffff;text-decoration:none;font-weight:bold;padding:14px 28px;border-radius:12px;display:inline-block">${esc(button.label)}</a></p>
<p style="font-size:13px;color:#6b5a5e">${esc(note)}</p>
</td></tr></table></td></tr></table></body></html>`;
}

export function organizerMail(p: { santaName: string; url: string }): Content {
  return {
    subject: `Ton Secret Santa « ${p.santaName} » est créé`,
    html: layout("Secret Santa", `<p>Ton événement <strong>${esc(p.santaName)}</strong> est créé. Garde ce lien : il te permet de gérer les participants et de lancer le tirage.</p>`, {
      label: "Ouvrir mon tableau de bord",
      url: p.url,
    }),
    text: `Ton événement « ${p.santaName} » est créé. Tableau de bord (lien secret) : ${p.url}`,
  };
}

export function recoveryMail(events: { name: string; url: string }[]): Content {
  return {
    subject: "Retrouve tes accès organisateur Secret Santa",
    html: layout("Tes accès organisateur", `<p>Voici les Secret Santa associés à ton adresse organisateur :</p><ul>${events.map((s) => `<li><a href="${esc(s.url)}">${esc(s.name)}</a></li>`).join("")}</ul><p>Ces liens sont valables une heure. Confirme l’ouverture de chaque tableau de bord pour obtenir un nouvel accès privé. L’ancien accès sera alors remplacé. Le tirage et les liens des participants restent inchangés.</p>`, {
      label: "Mes Secret Santa", url: `${appUrl()}/mes-secret-santa`,
    }, "Ces liens sont personnels. Si tu n’as pas fait cette demande, ignore cet e-mail : tes accès actuels restent valides."),
    text: `Retrouve tes tableaux de bord Secret Santa :\n${events.map((s) => `${s.name} : ${s.url}`).join("\n")}\nLiens valables une heure. La confirmation remplace l’ancien accès organisateur, sans modifier le tirage ni les liens participants. Si tu n’as pas fait cette demande, ignore cet e-mail.`,
  };
}

export function participantMail(p: {
  santaName: string; participantName: string; organizerName: string; exchangeDate: string; budget: number; currency: string; message: string; url: string;
}): Content {
  const when = formatDate(p.exchangeDate);
  const msg = p.message ? `<p style="background:#fbf6ef;border-left:4px solid #d4a64a;padding:12px 16px;margin:16px 0">${esc(p.message)}</p>` : "";
  return {
    subject: `Secret Santa « ${p.santaName} » : découvre à qui tu offres un cadeau`,
    html: layout(p.santaName, `<p>Bonjour ${esc(p.participantName)},</p>
<p>${esc(p.organizerName)} t'invite au Secret Santa <strong>${esc(p.santaName)}</strong>. Le tirage est fait !</p>
<p>Échange des cadeaux : <strong>${esc(when)}</strong><br>Budget : <strong>${p.budget}&nbsp;${esc(p.currency)}</strong></p>${msg}
<p>Clique ci-dessous pour découvrir à qui tu offres un cadeau.</p>`, { label: "Découvrir mon destinataire", url: p.url }),
    text: `Bonjour ${p.participantName}, le tirage du Secret Santa « ${p.santaName} » est fait. Échange le ${when}, budget ${p.budget} ${p.currency}.${p.message ? `\n${p.message}` : ""}\nDécouvre ton destinataire (lien secret) : ${p.url}`,
  };
}

/**
 * Heads-up for a new anonymous message. It never carries the text, the sender's name or a personal link
 * (links are only stored hashed): the reader returns through the link of their draw email.
 */
export function messageMail(p: { santaName: string; toName: string; fromGiver: boolean; senderName: string }): Content {
  const who = p.fromGiver ? "Ton Père Noël secret" : p.senderName;
  const action = p.fromGiver ? "t'a écrit" : "t'a répondu";
  return {
    subject: `${who} ${action} (Secret Santa « ${p.santaName} »)`,
    html: layout("Un nouveau message", `<p>Bonjour ${esc(p.toName)},</p>
<p><strong>${esc(who)}</strong> ${action} dans le Secret Santa <strong>${esc(p.santaName)}</strong>.</p>
<p>Pour le lire, rouvre ton lien personnel, celui du mail du tirage, et va dans l'onglet « Messages ».</p>`, { label: "Ouvrir Secret Santa", url: appUrl() }, "Pour garder le secret, ce mail ne contient ni le message ni de lien personnel."),
    text: `Bonjour ${p.toName}, ${who} ${action} dans le Secret Santa « ${p.santaName} ». Pour le lire, rouvre ton lien personnel (celui du mail du tirage) et va dans l'onglet « Messages ».`,
  };
}
