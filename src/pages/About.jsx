import Footer from "../components/footer";

export default function About() {
  return (
    <section className="min-h-screen flex flex-col justify-between bg-gradient-to-b from-white to-gray-100">

     
      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="max-w-4xl text-center">

          
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-wide mb-6 font-serif">
            About Our Art Space
          </h1>

         
          <p className="text-lg md:text-xl text-gray-600 leading-relaxed mb-10">
            We believe art has the power to transform spaces and emotions.
            Our gallery brings together <strong>unique hand-crafted artworks</strong> from talented artists
            across the world — making creativity accessible to all art lovers.
          </p>

          <div className="bg-white shadow-lg rounded-2xl p-8 border border-gray-200 mb-10">
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">
              What We Offer 🎨
            </h2>
            <ul className="text-gray-600 space-y-2">
              <li>✨ Curated premium paintings</li>
              <li>🎭 Modern, abstract & traditional art styles</li>
              <li>📦 Safe worldwide shipping</li>
              <li>🖼️ Custom framing options</li>
              <li>💳 Secure checkout</li>
            </ul>
          </div>

          
          <p className="text-lg md:text-xl text-gray-700 italic font-serif">
            “Art is not what you see, but what you make others see.”
          </p>

         
          <a
            href="/Gallery"
            className="mt-10 inline-block bg-gray-900 hover:bg-gray-800 text-white 
            font-medium py-3 px-8 rounded-full shadow-md transition transform 
            hover:-translate-y-1"
          >
            Explore Our Gallery
          </a>

        </div>
      </div>

    
      <Footer />
    </section>
  );
}
