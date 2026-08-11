function About() {
  return (
    <div className="container mx-auto px-6 py-14">
      <div className="page-section max-w-5xl mx-auto">
        <div className="mb-10 max-w-3xl">
          <p className="text-sm uppercase tracking-[0.35em] text-[#c9b18a] mb-4">Our Story</p>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-white mb-6">
            Luxury jewelry made to celebrate every moment.
          </h1>
          <p className="text-lg leading-relaxed text-[#d8c4a3]">
            At Gemini, we blend modern design with classic craftsmanship to create pieces that feel personal, polished, and perfectly made. Every item is designed with lasting beauty in mind.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <div className="rounded-[30px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] p-8 shadow-[0_25px_70px_rgba(0,0,0,0.18)]">
            <h2 className="text-2xl font-semibold text-white mb-4">Ethical Sourcing</h2>
            <p className="text-[#c9b18a] leading-relaxed">
              We use responsibly sourced gems and precious metals, ensuring every design is as thoughtful as it is stunning.
            </p>
          </div>

          <div className="rounded-[30px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] p-8 shadow-[0_25px_70px_rgba(0,0,0,0.18)]">
            <h2 className="text-2xl font-semibold text-white mb-4">Modern Craftsmanship</h2>
            <p className="text-[#c9b18a] leading-relaxed">
              Each piece is carefully crafted to balance refined elegance with everyday luxury, designed to be treasured for years to come.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
