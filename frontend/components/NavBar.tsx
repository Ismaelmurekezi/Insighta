"use client"

import Link from "next/link";
import { Button } from "./ui/button";
import { use, useState } from "react";

export default function Navbar() {

    const [isLoggin, setIsLoggedIn] = useState(true)
  return (
    <nav className="w-full bg-white shadow-sm absolute top-0 left-0 z-10">
      <div className="max-w-7xl mx-auto flex items-center justify-between py-4 px-6">
        <div className="flex items-center gap-2">
          <img src="/logo.svg" alt="Insighta Logo" className="w-28 h-1w-28" />
        </div>

        <div className="flex gap-8 text-gray-700">
          <a className="hover:text-[#75B06F]">Home</a>
          <a className="hover:text-[#75B06F]">Learn</a>
          <a className="hover:text-[#75B06F]">Blogs</a>
              </div>
              {isLoggin ? (
                <div className="flex gap-4">
                  <Button className="bg-[#75B06F] text-white px-6 py-2 rounded-full hover:bg-[#A2CB8B]   ">
                    Dashboard
                  </Button>
                  <Button onClick={() => setIsLoggedIn(false)} variant={"destructive"} className=" px-6 py-2 rounded-full  hover:bg-red-500  ">
                    Logout
                  </Button>
                </div>
              ) : (
                <Link href="/login">
                  <Button className="bg-[#75B06F] text-white px-6 py-2 rounded-full hover:bg-[#A2CB8B]   ">
                    Login
                  </Button>
                </Link>
              )}
        {/* <Link href="/login">
          <Button  className="bg-[#75B06F] text-white px-6 py-2 rounded-full hover:bg-[#A2CB8B]   ">
            Login
          </Button>
        </Link> */}
      </div>
    </nav>
  );
}
