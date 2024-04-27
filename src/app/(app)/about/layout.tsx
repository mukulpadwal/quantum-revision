import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quantum Revision | About",
  description: "About Page of QuantumRevision!",
};

export default function AboutPageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section className="relative flex  justify-center items-start min-w-screen min-h-screen p-2 md:p-8">
      {children}
    </section>
  );
}