import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "University of Nigeria, Nsukka - Official Website",
  description: "Nigeria's first autonomous university, founded in 1955 by Dr. Nnamdi Azikiwe. Offering world-class education across 17 faculties with over 300 academic programs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
