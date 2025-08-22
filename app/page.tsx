"use client";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Home() {
  const router = useRouter();
  const [value, setValue] = useState("");

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const slug = value.trim();
    if (!slug) return;
    router.push(`/${encodeURIComponent(slug)}`);
  };

  return (
    <div className="min-h-screen bg-white text-black flex flex-col p-6">
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-2xl">
          <h1 className="text-3xl font-bold text-center">Random Page</h1>
          <p className="mt-3 text-center">Enter <i>anything</i> to generate a random webpage</p>

          <form onSubmit={onSubmit} className="mt-8">
            <div className="flex items-stretch shadow-lg rounded-lg">
              <label className="flex font-bold items-center select-none whitespace-nowrap rounded-l-md border border-r-0 border-black/20 bg-white px-2 py-2 text-sm">
                randompage.vercel.app/
              </label>
              <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="your-prompt"
                className="flex-1 rounded-r-md border border-black/20 bg-white px-2 py-2 text-base outline-none"
              />
            </div>
          </form>
        </div>
      </div>
      <div className="text-center text-sm mt-8">
        <Link href="https://github.com/bpluhar" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600">
          Made by Brian Pluhar
        </Link>
      </div>
    </div>
  );
}
