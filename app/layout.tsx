import type { Metadata } from "next";
import { Anton, Bebas_Neue, Archivo } from "next/font/google";
import ConditionalMarquee from "@/components/ConditionalMarquee";
import SiteFooter from "@/components/SiteFooter";
import "../style.css";

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-anton",
  display: "swap",
});

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
  display: "swap",
});

const archivo = Archivo({
  weight: ["400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Set Life Entertainment — The Voice. The Culture. The Future.",
  description:
    "Set Life Entertainment shines a spotlight on the indie film industry, celebrating rising talent and untold stories across cinema.",
  icons: { icon: "/assets/favicon.png" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${anton.variable} ${bebasNeue.variable} ${archivo.variable}`}>
      <body>
        <ConditionalMarquee />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
