function Contact() {
  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">Contact Us</h1>

      <form className="space-y-4">
        <input className="w-full border p-3 rounded" placeholder="Name" />

        <input className="w-full border p-3 rounded" placeholder="Email" />

        <textarea
          className="w-full border p-3 rounded"
          rows="5"
          placeholder="Message"
        />

        <button className="bg-black text-white px-6 py-3 rounded">
          Send Message
        </button>
      </form>
    </div>
  );
}

export default Contact;
