import Footer from "../components/footer";

export default function Contact() {
  return (
    <>
      <div
        className="min-h-screen bg-gradient-to-br from-yellow-100 via-white to-orange-200 flex items-center justify-center py-16 px-5"
        style={{
          backgroundImage:
            "url('https://img.freepik.com/premium-photo/flat-style-vector-art-featuring-painter-dark-colors_1141064-24224.jpg?w=2000')",
        }}
      >
        <div className="bg-white/90 backdrop-blur-md shadow-2xl rounded-3xl max-w-4xl w-full grid md:grid-cols-2 gap-10 p-10">
          
         
          <div className="flex flex-col justify-center">
            <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-orange-600 drop-shadow-md">
              Contact Us 🎨
            </h2>
            <p className="text-gray-600 mt-3">
              Have a question or want a custom art piece? We’d love to hear from you!
            </p>

            <div className="mt-6 space-y-3 text-gray-700">
              <p><strong>Email:</strong> support@artloom.com</p>
              <p><strong>Phone:</strong> +91 98765 43210</p>
              <p><strong>Location:</strong> Mumbai, India</p>
            </div>
          </div>

        
          <form className="space-y-5">
            <input
              type="text"
              placeholder="Full Name"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500"
              required
            />

            <input
              type="email"
              placeholder="Email Address"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500"
              required
            />

            <textarea
              placeholder="Your Message..."
              rows="4"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500"
              required
            ></textarea>

            <button
              type="submit"
              className="w-full bg-yellow-500 hover:bg-yellow-700 text-white py-3 rounded-lg font-semibold shadow-lg transition-all"
            >
              Send Message ✉
            </button>
          </form>

        </div>
      </div>

      
      <Footer />
    </>
  );
}
