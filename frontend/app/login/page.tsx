import GoogleLoginButton from "@/components/GoogleLoginButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, LucideLock, Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Login() {
  return (
    <div className="w-full flex justify-center items-center h-screen relative">
      <Link href="/">
        <Image
          src="/logo.svg"
          alt="Insighta Logo"
          width={100}
          height={100}
          className="absolute top-6 left-4"
        />
      </Link>
      <div className="w-full max-w-max flex flex-col gap-6 items-center mx-auto p-10 bg-white rounded-lg shadow-2xl border border-gray-100">
        <h1 className="text-[#75B06F] font-bold text-lg">
          CREATE YOUR ACCOUNT
        </h1>
        <h3 className="text-lg ">
          Welcome to Blogging! Let’s set your account up
        </h3>
        <GoogleLoginButton />
        <div className="w-full flex justify-around items-center ">
          <span className="w-40 h-0.5 bg-gray-300"></span>
          <span className="text-gray-600">OR</span>
          <span className="w-40 h-0.5 bg-gray-300"></span>
        </div>
        <form
          action=""
          className="flex flex-col w-full max-w-96 space-y-4 relative"
        >
          <div className="flex flex-col gap-2">
            <label htmlFor="">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                id="input-field-email"
                type="email"
                placeholder="Your email"
                className="py-5 pl-13"
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="">Password</label>
            <div className="relative">
              <LucideLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                id="input-field-password"
                type="password"
                placeholder="Your password"
                className="py-5 pl-13"
              />
              <Eye className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            <span className="text-sm text-right mt-1 text-[#36C0C9] font-bold cursor-pointer">
              Forget password
            </span>
          </div>
          <div className="flex flex-col items-center">
            <Button className="w-full text-lg py-6">Create Account</Button>
            <p className="text-sm  mt-2">
              Don't have an account?{" "}
              <Link
                href="/register"
                className="text-[#75B06F] font-bold underline"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
