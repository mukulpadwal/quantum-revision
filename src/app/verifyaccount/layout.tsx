import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quantum Revision | VerifyAccount",
  description: "VerifyAccount Page of QuantumRevision!",
};

export default function VerifyAccountLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section className="relative flex  justify-center items-center min-w-screen min-h-screen p-2 md:p-8">
      {children}
    </section>
  );
}
