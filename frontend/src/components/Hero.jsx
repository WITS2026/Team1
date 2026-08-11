function Hero() {
  return (
    <section className="hero-banner h-[84vh] flex items-center justify-center text-center px-6 md:px-10">
      <div className="relative z-10 max-w-3xl">
        <p className="mb-6 text-sm uppercase tracking-[0.35em] text-[#c9b18a]">Luxury Jewelry</p>
        <h1 className="text-4xl md:text-6xl font-black leading-tight text-white drop-shadow-[0_18px_50px_rgba(0,0,0,0.42)]">
          Where Timeless Beauty Meets Modern Design
        </h1>
        <p className="mt-6 text-base md:text-lg text-[#efdfc0] max-w-2xl mx-auto leading-relaxed">
          Discover signature pieces crafted for every milestone, designed to make every moment unforgettable.
        </p>
      </div>
    </section>
  );
}

export default Hero;
