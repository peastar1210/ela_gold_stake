import type { Metadata } from "next";
import Provider from "@/components/shared/Provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Elastos Staking App",
  description: "Elastos Smart Chain Staking and Trading Analatics App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
