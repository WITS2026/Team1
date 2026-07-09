function Contact() {
  return (
    <div className="max-w-5xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">Contact Us</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Contact Information Column */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Get in Touch</h2>
          <p className="text-gray-600">
            Have questions? We would love to hear from you. Send us a message or
            reach out directly.
          </p>

          <div className="space-y-4">
            <div>
              <p className="font-medium text-gray-500">Phone</p>
              <a
                href="tel:+15551234567"
                className="text-lg hover:underline text-black"
              >
                +1 (555) 123-4567
              </a>
            </div>

            <div>
              <p className="font-medium text-gray-500">Email</p>
              <a
                href="mailto:support@example.com"
                className="text-lg hover:underline text-black"
              >
                support@example.com
              </a>
            </div>
          </div>
        </div>

        {/* Form Column */}
        <form className="space-y-4">
          <input className="w-full border p-3 rounded" placeholder="Name" />

          <input className="w-full border p-3 rounded" placeholder="Email" />

          <textarea
            className="w-full border p-3 rounded"
            rows="5"
            placeholder="Message"
          />

          <button className="bg-black text-white px-6 py-3 rounded w-full md:w-auto">
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
}

export default Contact;
