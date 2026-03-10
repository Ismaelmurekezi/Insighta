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
        <h1 className="text-[#75B06F] font-bold text-2xl">OTP VERIFICATION </h1>
        <p className="text-center max-w-lg">
          Enter verification code sent to your email. Be careful not to share
          the code with anyone
        </p>

        <form action="" className="flex  flex-col items-center gap-6 p-4 ">
          <div className="w-full flex  gap-4">
            <input
              type="text"
              className="w-12 h-12 border p-2 border-gray-500 rounded-md  max-w-xs"
            />
            <input
              type="text"
              className="w-12 h-12 border p-2 border-gray-500 rounded-md  max-w-xs"
            />
            <input
              type="text"
              className="w-12 h-12 border p-2 border-gray-500 rounded-md  max-w-xs"
            />
            <input
              type="text"
              className="w-12 h-12 border p-2 border-gray-500 rounded-md  max-w-xs"
            />
            <input
              type="text"
              className="w-12 h-12 border p-2 border-gray-500 rounded-md  max-w-xs"
            />
            <input
              type="text"
              className="w-12 h-12 border p-2 border-gray-500 rounded-md  max-w-xs"
            />
          </div>
          <div className="w-full flex flex-col  items-center">
            <Button
              type="submit"
              className="bg-[#75B06F] text-white p-2 rounded-md mt-4 w-full hover:bg-[#A2CB8B]"
            >
              Verify
            </Button>
            <Button
              type="submit"
              variant={"outline"}
              className="border-[1px] border-gray-700 text-gray-700 p-2 rounded-md mt-4 w-full"
            >
              Cancel
            </Button>
            <p className="text-sm  mt-2">
              Didn't receive the code?{" "}
              <Link href="/resend-otp" className="text-[#75B06F] underline">
                Resend
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
