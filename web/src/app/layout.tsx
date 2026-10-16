import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

const manrope = localFont({
  src: "../fonts/Manrope-VariableFont_wght.ttf",
  variable: "--font-manrope",
  weight: "200 800",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Alanyo Group — The Art of Refined Living",
  description:
    "Luxury sanitaryware and bathroom and kitchen fixtures, composed like architecture.",
};

export const viewport: Viewport = {
  themeColor: "#f7f6f2",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${manrope.variable} antialiased`}>
      <body>
        <noscript>
          <style>{`.reveal{opacity:1!important}`}</style>
        </noscript>
        {children}
      </body>
    </html>
  );
}
