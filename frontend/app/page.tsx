import BlogSection from "@/components/BlogSection";
import Footer from "@/components/footer";
import Hero from "@/components/HeroSection";
import Navbar from "@/components/NavBar";
import Link from "next/link";

export default function Home() {
  return (
    <div className="relative" >
      <Navbar />
      <Hero />
      <BlogSection />
      <Footer />
    </div>
  );
}
