import LoginForm from "@/components/RegisterForm";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="w-full flex justify-center items-center h-screen relative">
      <Link href="/"><Image src="/logo.svg" alt="Insighta Logo" width={100} height={100} className="absolute top-6 left-4" /></Link>
      <LoginForm />
    </div>
  );
}
