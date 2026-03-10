import BlogCard from "./BlogCard";

export default function BlogSection() {
  const blogs = Array(6).fill(0);

  return (
    <section className="bg-gray-50 py-14">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-center text-3xl font-semibold text-[#75B06F] mb-2">
          Stories that inspire and inform
        </h2>

        <p className="text-center text-gray-500 mb-8">
          Discover insights from creators, thinkers, and experts on topics that
          matter to you.
        </p>

        <div className="flex justify-between items-center mb-6">
          <h3 className="text-[#75B06F] font-semibold">Latest Blogs</h3>

          <input
            placeholder="Search an article"
            className="border rounded-full px-4 py-2"
          />
        </div>

        <div className="flex gap-3 flex-wrap mb-8">
          {[
            "All",
            "Technology",
            "Programming",
            "Design",
            "AI",
            "Web development",
            "Productivity",
          ].map((cat) => (
            <button
              key={cat}
              className="bg-gray-200 px-4 py-1 rounded-full text-sm"
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {blogs.map((_, i) => (
            <BlogCard key={i} />
          ))}
        </div>

        <div className="flex justify-center mt-10 gap-3">
          <button className="border px-4 py-1 rounded">Previous</button>

          <button className="bg-[#75B06F] text-white px-3 py-1 rounded">
            1
          </button>

          <button className="border px-3 py-1 rounded">2</button>
          <button className="border px-3 py-1 rounded">3</button>

          <button className="border px-4 py-1 rounded">Next</button>
        </div>
      </div>
    </section>
  );
}
