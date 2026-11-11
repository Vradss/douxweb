import type { Metadata } from "next";
import { Dongle } from "next/font/google";
import "./globals.css";

const dongle = Dongle({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  variable: "--font-dongle",
});

export const metadata: Metadata = {
  title: "Doux Bébé — Coming soon",
  description: "Doux Bébé. Muy pronto.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={dongle.variable}>
      <body>{children}</body>
    </html>
  );
}
