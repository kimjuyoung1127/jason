/** Root layout defining HTML structure, font loading, and metadata. */
import type { Metadata } from "next";
import { Syne, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  weight: ["400", "500", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "JASON. | Independent Developer",
  description:
    "\uC6F9\uC0AC\uC774\uD2B8, AI \uC11C\uBE44\uC2A4, \uC778\uD130\uB799\uD2F0\uBE0C \uACBD\uD5D8\uC744 \uC124\uACC4\uD558\uACE0 \uAD6C\uD604\uD558\uB294 Jason\uC758 \uD3EC\uD2B8\uD3F4\uB9AC\uC624\uC785\uB2C8\uB2E4.",
  openGraph: {
    title: "JASON. | Independent Developer",
    description:
      "\uC6F9\uC0AC\uC774\uD2B8, AI \uC11C\uBE44\uC2A4, \uC778\uD130\uB799\uD2F0\uBE0C \uACBD\uD5D8\uC744 \uC124\uACC4\uD558\uACE0 \uAD6C\uD604\uD558\uB294 Jason\uC758 \uD3EC\uD2B8\uD3F4\uB9AC\uC624\uC785\uB2C8\uB2E4.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={`${syne.variable} ${jetbrains.variable}`}>
      <body>{children}</body>
    </html>
  );
}
