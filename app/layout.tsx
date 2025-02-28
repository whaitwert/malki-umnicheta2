import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { UserProvider } from "@/contexts/UserContext";
import Header from "@/components/header";
import Footer from "@/components/footer";
import CartoonCharacters from "@/components/cartoon-characters";

const inter = Inter({ subsets: ["latin", "cyrillic"] });

export const metadata: Metadata = {
  title: "Малки Умничета",
  description: "Образователни игри за деца от 1 до 4 клас",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bg" className="h-full" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `window.IMGBB_API_KEY = "${process.env.NEXT_PUBLIC_IMGBB_API_KEY}";`,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var htmlElement = document.documentElement;
                var attributesToRemove = ['data-qb-extension-installed', 'data-qb-installed'];
                attributesToRemove.forEach(function(attr) {
                  if (htmlElement.hasAttribute(attr)) {
                    htmlElement.removeAttribute(attr);
                  }
                });
              })();
            `,
          }}
        />
      </head>
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <div className="moving-background fixed inset-0">
          <CartoonCharacters />
        </div>

        <UserProvider>
          <div className="flex flex-col flex-1 relative z-10">
            <Header />
            <main className="flex-1 flex flex-col">{children}</main>
            <Footer />
          </div>
        </UserProvider>
      </body>
    </html>
  );
}
