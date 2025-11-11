import Image from "next/image";
import Calendar from "./calendar";


export default function Home() {
  return (
    <div className="flex min-h-screen justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="mt-5 h-full w-full max-w-4xl rounded-lg bg-white p-10 shadow-lg dark:bg-zinc-900">
       <Calendar />
      </main>
    </div>
  );
}
