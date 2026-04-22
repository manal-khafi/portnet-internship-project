import type { Metadata } from "next";
import "../styles/index.css";

export const metadata: Metadata = {
  title: "PORTNET - Port Management System",
  description: "Secure maritime operations platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
