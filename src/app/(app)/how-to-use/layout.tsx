import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quantum Revision | How To Use",
  description: "How To Use Page of QuantumRevision!",
};

export default function HowToUsePageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="relative flex  justify-center items-start min-w-screen min-h-screen p-2 md:p-8">
      {children}
    </main>
  );
}
