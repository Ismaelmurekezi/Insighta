import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import GoogleLoginButton from "@/components/GoogleLoginButton";
import { Eye, LucideLock, Mail, User } from "lucide-react";
import Link from "next/link";

const RegisterForm = () => {
  return (
    <div className="w-full max-w-max flex flex-col gap-6 items-center mx-auto p-10 bg-white rounded-lg shadow-2xl border border-gray-100">
      <h1 className="text-[#75B06F] font-bold text-lg">CREATE YOUR ACCOUNT</h1>
      <h3 className="text-lg ">
        Welcome to Blogging! Let’s set your account up
      </h3>
      <GoogleLoginButton />
      <div className="w-full flex justify-around items-center ">
        <span className="w-40 h-0.5 bg-gray-300"></span>
        <span className="text-gray-600">OR</span>
        <span className="w-40 h-0.5 bg-gray-300"></span>
      </div>
      <form action="" className=" w-full max-w-96 space-y-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="">Username</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              id="input-field-username"
              type="text"
              placeholder="Your username"
              className="py-5 pl-13"
            />
          </div>
        </div>
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
        </div>

        <Button className="w-full text-lg py-6">Create Account</Button>
        <div className="flex flex-col items-center">
          <p className="text-sm  mt-2">
            Have an account?{" "}
            <Link href="/login" className="text-[#75B06F] font-bold underline">
              Sign In
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
