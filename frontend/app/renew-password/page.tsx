import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function PasswordRenew() {
  return (
    <div className="w-full flex justify-center items-center h-screen">
      <Link href="/">
        <Image
          src="/logo.svg"
          alt="Insighta Logo"
          width={100}
          height={100}
          className="absolute top-6 left-4"
        />
      </Link>
      <div className="max-w-lg py-6 px-6 flex flex-col items-center gap-6 border-2 border-gray-100 shadow-xl rounded-lg">
        <h1 className="text-[#75B06F] font-bold text-2xl">
          New password Creation{" "}
        </h1>
        <p className="text-center max-w-lg">
          Enter strong new password and confirms it
        </p>

        <form
          action=""
          className="w-full flex  flex-col items-center gap-6 p-4 "
        >
          <div className="w-full flex flex-col gap-2">
            <label htmlFor="email">New Password</label>
            <input
              type="password"
              id="password"
              placeholder="Write new password"
              className="w-full h-12 border p-2 rounded-md"
            />
          </div>    
          <div className="w-full flex flex-col gap-2">
            <label htmlFor="password">Confirm New Password</label>
            <input
              type="password"
              id="password"
              placeholder="Rewrite new password"
              className="w-full h-12 border p-2 rounded-md"
            />
          </div>
          <div className="w-full flex flex-col  items-center">
            <Button
              type="submit"
              className="w-full bg-[#75B06F]  text-white p-2 h-10 rounded-md mt-4  cursor-pointer hover:bg-[#A2CB8B]"
            >
              Confirm
            </Button>
            <Button
              type="submit"
              variant={"outline"}
              className="p-2 h-10  border-[1px] border-gray-400 mt-4 w-full cursor-pointer"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
