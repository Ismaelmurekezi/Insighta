export default function Hero() {
  return (
    <section
      className="h-[600px] bg-cover bg-center flex items-center"
      style={{
        backgroundImage: "url('/hero.png')",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 text-white">
        <h1 className="text-5xl text-[#75B06F] font-semibold leading-tight mb-4">
          Get Stories <br />
          That inspire and inform <br />
          in various aspect of life
        </h1>

        <p className="max-w-lg text-white mb-6">
          Facilitating effective access to land, soil and crop information data
          by making existing resources better findable, accessible,
          interoperable and reusable.
        </p>

        <div className="flex gap-4">
          <button className="bg-[#75B06F] px-6 py-3 rounded-md">
            Get Started
          </button>

          <button className="border border-white  px-6 py-3 rounded-md">
            Explore Articles
          </button>
        </div>
      </div>
    </section>
  );
}
