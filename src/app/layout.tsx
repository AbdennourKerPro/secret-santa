import type { Metadata } from "next";
import { Fraunces, Inter, Mountains_of_Christmas } from "next/font/google";
import "./globals.css";
import { SnowLayer } from "@/components/SnowProvider";

const fraunces = Fraunces({ variable: "--font-fraunces", subsets: ["latin"], weight: ["600"] });
const inter = Inter({ variable: "--font-inter", subsets: ["latin"], weight: ["400", "600"] });
const christmas = Mountains_of_Christmas({ variable: "--font-christmas", subsets: ["latin"], weight: ["700"] });

export const metadata: Metadata = {
  title: "Secret Santa",
  description: "Organise ton Secret Santa : tirage au sort confidentiel et e-mails pour chaque participant.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${fraunces.variable} ${inter.variable} ${christmas.variable}`}>
      <body className="relative min-h-dvh">
        <SnowLayer />
        <div className="relative z-10 flex min-h-dvh flex-col">{children}</div>
      </body>
    </html>
  );
}
