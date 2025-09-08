"use client"

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "./components/header";

export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = sessionStorage.getItem("access_token")
    setIsLoggedIn(!!token)
  }, [])

  const handleLogin = () => {
    if (isLoggedIn) {
      router.push("/home");
    } else {
      router.push("/login");
    }
  };

  return (
    <main
     style={{
         backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('/bg.png')`, 
         backgroundSize: 'cover', 
         backgroundRepeat: 'no-repeat',
         backgroundPosition: 'center'
     }}
     className="relative min-h-screen"
    >
      <div><Header /></div>
      <div className="absolute inset-0 flex flex-col justify-center items-center px-30">
        <Image
          src="/logo2.png"
          alt="Molca Logo"
          width={70}
          height={70}
          className="object-contain"
        />
        <p className="text-5xl/15 text-center font-semibold title py-5 px-60">Operating System for Industrial Infrastructure</p>
        <p className="text-sm text-center px-100">Powered by Digital Twin, AR/VR, & Smart Manufacturing Solutions</p>
        <button type="button" onClick={handleLogin} className="button bg-[var(--color-primary)] text-[var(--color-base)] w-1/2">Login</button>
      </div>
    </main>
  );
}
