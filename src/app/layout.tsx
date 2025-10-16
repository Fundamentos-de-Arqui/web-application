import type { Metadata } from "next";
import "./globals.css";
import {ThemeProviderWrapper} from "@/app/providers/theme";
import React from "react";

export const metadata: Metadata = {
  title: "Therapy System",
  description: "Handle with care",
};

export default function RootLayout(
    {children}: Readonly<{ children: React.ReactNode; }>
) {
  return (
      <html lang="en">
          <body>
              <ThemeProviderWrapper>
                  {children}
              </ThemeProviderWrapper>
          </body>
      </html>
  );
}
