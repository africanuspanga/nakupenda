import type { Metadata } from "next";
import { Great_Vibes, Lora } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { LanguageProvider } from "@/context/LanguageContext";
import { LanguageModal } from "@/components/LanguageModal";
import { Footer } from "@/components/Footer";
import "./globals.css";

const greatVibes = Great_Vibes({
  weight: "400",
  variable: "--font-script",
  subsets: ["latin"],
  display: "swap",
});

const lora = Lora({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nakupenda - Create beautiful letters for your loved ones | Waandikie wapendwa wako barua za kipekee",
  description: "Create and share beautiful digital love letters with your special someone. Tengeneza na ushiriki barua za mapenzi na mpenzi wako. A romantic way to express your feelings.",
  keywords: ["love letters", "digital letters", "romantic", "Valentine", "Tanzania", "barua za mapenzi", "Nakupenda"],
  icons: {
    icon: [
      { url: '/heart-icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/heart-icon.svg',
    shortcut: '/heart-icon.svg',
  },
  openGraph: {
    title: "Nakupenda - Digital Love Letters",
    description: "Create beautiful letters for your loved ones | Waandikie wapendwa wako barua za kipekee",
    url: "https://nakupenda.co.tz",
    siteName: "Nakupenda",
    type: "website",
    images: [
      {
        url: '/heart.png',
        width: 1200,
        height: 630,
        alt: 'Nakupenda - Digital Love Letters',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Nakupenda - Digital Love Letters",
    description: "Create beautiful letters for your loved ones | Waandikie wapendwa wako barua za kipekee",
    images: ['/heart.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${greatVibes.variable} ${lora.variable} antialiased bg-cream min-h-screen`}
      >
        <LanguageProvider>
          <Toaster position="bottom-center" />
          <LanguageModal />
          <div className="pb-16">
            {children}
          </div>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
