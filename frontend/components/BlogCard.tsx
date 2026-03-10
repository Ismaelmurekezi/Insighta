import { Heart, MessageCircle, MessageSquare, MessageSquareText, User } from "lucide-react";
import Image from "next/image";

export default function BlogCard() {
  return (
    <div className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden">
      <div className="relative h-48 w-full">
        <Image
          src="/blog.png"
          alt="Blog Image"
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
        />
      </div>

      <div className="p-4">
        <div className="flex gap-2 mb-2">
          <span className="text-xs bg-[#E33629] text-white px-2 py-1 rounded-full">
            Web design
          </span>
          <span className="text-xs bg-[#E33629] text-white px-2 py-1 rounded-full">
            Programming
          </span>
        </div>

        <h3 className="text-green-600 font-semibold text-lg mb-2">
          Iwork Project
        </h3>

        <p className="text-gray-500 text-sm mb-3">
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard dummy text ever
          since the 1500s.
        </p>

        <p className="text-sm text-black mb-3">Posted: Dec,12,2025</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 flex items-center justify-center bg-gray-200 rounded-full">
              <User className="w-5 h-5 text-gray-500" />
            </div>
            <span className="text-sm">Bryan Mike</span>
          </div>

          <div className="flex gap-4 text-black text-sm">
            <span className="flex gap-1">
              <Heart className="w-5 h-5" /><span> 8</span>
            </span>
            <span className="flex gap-1">
              <MessageCircle className="w-5 h-5" /> <span>13</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
