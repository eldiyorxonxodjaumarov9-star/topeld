import type { Metadata } from "next";
import { Inter, Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import { ContactModalProvider } from "@/components/providers/contact-modal-provider";
import { PageLoader } from "@/components/providers/page-loader";
import { VisitConsentModal } from "@/components/modals/visit-consent-modal";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "TOP ELD SOLUTIONS INC | Professional ELD & Trucking Support",
    template: "%s | TOP ELD SOLUTIONS INC",
  },
  description:
    "TOP ELD SOLUTIONS INC provides premium ELD, compliance, IFTA, dispatch, accounting, MC setup, and driver hiring for US trucking companies. 24/7 support nationwide.",
  keywords: [
    "ELD solutions",
    "trucking support services",
    "logistics outsourcing",
    "ELD service",
    "IFTA reporting",
    "dispatch service",
    "MC setup",
    "trucking compliance",
    "TOP ELD SOLUTIONS",
  ],
  authors: [{ name: "TOP ELD SOLUTIONS INC" }],
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "TOP ELD SOLUTIONS INC | Professional ELD & Trucking Support",
    description:
      "Outsource compliance, dispatch, and back-office operations to TOP ELD SOLUTIONS. Trusted by 1,000+ US carriers.",
    type: "website",
    locale: "en_US",
    siteName: "TOP ELD SOLUTIONS INC",
  },
  twitter: {
    card: "summary_large_image",
    title: "TOP ELD SOLUTIONS INC | ELD & Trucking Support",
    description:
      "Premium ELD and logistics outsourcing for US trucking companies. 24/7 support.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${plusJakarta.variable} ${playfair.variable} scroll-smooth scroll-pt-28`}
    >
      <body className="min-h-screen w-full max-w-full overflow-x-hidden font-sans antialiased">
        <div className="w-full max-w-full overflow-x-hidden">
          <ContactModalProvider>
            <VisitConsentModal />
            <PageLoader>{children}</PageLoader>
          </ContactModalProvider>
        </div>
      </body>
    </html>
  );
}
