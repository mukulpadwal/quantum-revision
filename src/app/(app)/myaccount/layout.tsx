import { Separator } from "@/components/ui/separator";
import { SidebarNav } from "@/components/ui/sidebar-nav";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quantum Revision | Profile",
  description: "Profile Page of QuantumRevision!",
};

const sidebarNavItems = [
  {
    title: "My Profile",
    href: "/myaccount/profile",
  },
  {
    title: "Change Password",
    href: "/myaccount/changepassword",
  },
  {
    title: "Delete Account",
    href: "/myaccount/delete",
  },
];

export default function MyAccountLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section className="min-w-screen min-h-screen">
      <div className="space-y-6 p-5 md:p-10 md:pb-16 md:block">
        <div className="space-y-0.5 text-center md:text-left">
          <h2 className="text-2xl font-bold tracking-tight">My Account</h2>
          <p className="text-muted-foreground">
            Manage your account settings here.
          </p>
        </div>
        <Separator className="my-6" />
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="overflow-auto lg:w-1/5">
            <SidebarNav items={sidebarNavItems} />
          </aside>
          <div className="flex-1 lg:max-w-2xl">{children}</div>
        </div>
      </div>
    </section>
  );
}
