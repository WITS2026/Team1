function Contact() {
  return (
    <div className="container mx-auto px-6 py-14">
      <div className="page-section max-w-6xl mx-auto">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="space-y-6">
            <p className="text-sm uppercase tracking-[0.35em] text-[#c9b18a]">Contact</p>
            <h1 className="text-4xl md:text-5xl font-semibold text-white">We'd love to hear from you.</h1>
            <p className="text-lg leading-relaxed text-[#c9b18a]">
              Reach out with questions, custom requests, or styling guidance. Our team is here to make your jewelry experience effortless.
            </p>

            <div className="rounded-[30px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] p-8 shadow-[0_22px_60px_rgba(0,0,0,0.16)]">
              <div className="mb-6">
                <p className="text-sm uppercase tracking-[0.3em] text-[#c9b18a]">Phone</p>
                <a href="tel:+15551234567" className="text-lg text-white hover:text-[#f8e6b0]">+1 (555) 123-4567</a>
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-[#c9b18a]">Email</p>
                <a href="mailto:support@example.com" className="text-lg text-white hover:text-[#f8e6b0]">support@example.com</a>
              </div>
            </div>
          </div>

          <form className="space-y-5 input-panel">
            <input placeholder="Name" />
            <input placeholder="Email" />
            <textarea rows="5" placeholder="Message" />
            <button type="submit" className="btn-gold w-full rounded-full py-3 text-sm font-semibold uppercase tracking-[0.2em]">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Contact;
