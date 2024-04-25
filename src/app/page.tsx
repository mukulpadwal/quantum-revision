import Image from "next/image";
import { MdEditNotifications } from "react-icons/md";
import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="relative flex justify-start items-stretch md:justify-center md:items-center min-w-screen min-h-screen p-2 md:p-8">
      <div className="flex flex-col justify-center items-center md:flex-row md:justify-evenly md:items-center w-full h-auto md:h-screen p-2 md:p-8">
        <div className="w-full h-auto md:h-full m-4 flex justify-center md:justify-center md:items-center">
          <Image
            src={"/images/three.jpeg"}
            height={300}
            width={300}
            alt="Quantum Revision Logo"
            className="border p-2 rounded-full"
          />
        </div>
        <div className="w-full h-auto md:h-full flex flex-col justify-center items-center gap-y-4 m-4">
          <h1 className="text-3xl md:text-7xl text-center">Quantum Revision</h1>
          <p className="text-lg md:text-xl text-center">
            Transform Your Study Sessions with QuantumRevision!
          </p>
          <Link
            href={"/login"}
            className="w-fit flex flex-row justify-center items-center border px-4 py-3 rounded-lg gap-x-3"
          >
            <MdEditNotifications className="h-6 w-6" />
            <span>Start Revising</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
