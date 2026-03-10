import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function OTPPage() {
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
          Reset your password{" "}
        </h1>
        <p className="text-center max-w-lg">
          Enter your email address and we'll send you a link to reset your
          password.
        </p>

        <form
          action=""
          className="w-full flex  flex-col items-center gap-6 p-4 "
        >
                  <div className="w-full flex flex-col gap-2">
            <label htmlFor="email">Email</label>
            <input
              type="text"
              id="email"
              placeholder="Enter your email"
              className="w-full h-12 border p-2 rounded-md"
            />
          </div>
          <div className="w-full flex flex-col  items-center">
            <Button
              type="submit"
              className="w-full bg-[#75B06F] text-white p-2 h-10 rounded-md mt-4  cursor-pointer hover:bg-[#A2CB8B]"
            >
              Send Reset Link
            </Button>
            <Button
              type="submit"
              variant={"secondary"}
              className="p-2 h-10  mt-4 w-full cursor-pointer"
            >
              Back to home
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
