function Hero() {
  return (
    <section className="h-[80vh] bg-gradient-to-r from-black to-gray-800 flex items-center justify-center text-center text-white">
      <div>
        <h1 className="text-6xl font-bold mb-4">Timeless Elegance</h1>

        <p className="text-xl text-gray-300 mb-6">
          Discover handcrafted luxury jewelry.
        </p>

        <button className="bg-yellow-500 px-6 py-3 rounded-lg text-black font-semibold">
          Shop Now
        </button>
      </div>
    </section>
  );
}

export default Hero;
