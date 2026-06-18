import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Maruti | Premium Digital Experiences",
  description: "A state-of-the-art interactive web experience built with Next.js 14, Tailwind CSS, and GSAP.",
  openGraph: {
    title: "Maruti | Premium Digital Experiences",
    description: "Interactive brand storytelling and digital engineering.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${jakartaSans.variable} font-sans antialiased bg-[#0A0F1E] text-white`}>
        {children}
      </body>
    </html>
  );
}
