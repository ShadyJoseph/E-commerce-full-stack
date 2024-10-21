
import React from 'react';

const AboutUsPage = () => {
  return (
    <div className="bg-gray-100 min-h-screen mt-16 p-6">
      <div className="container mx-auto bg-white rounded-xl shadow-xl p-12 md:p-16 lg:p-20">
        <h1 className="text-5xl font-extrabold mb-8 text-center text-green-700">About Us</h1>
        
        {/* Mission Section */}
        <section className="mb-12">
          <h2 className="text-4xl font-bold mb-6 text-green-600">Our Mission</h2>
          <p className="text-gray-800 text-lg leading-relaxed">
            At <strong>Good Grabs</strong>, our mission is to create a world where food waste is minimized, and everyone has access to fresh, affordable meals. We bridge the gap between local restaurants with surplus food and customers looking for quality meals at a discount. Together, we aim to reduce waste and fight hunger, one meal at a time.
          </p>
        </section>

        {/* Vision Section */}
        <section className="mb-12">
          <h2 className="text-4xl font-bold mb-6 text-green-600">Our Vision</h2>
          <p className="text-gray-800 text-lg leading-relaxed">
            We envision a sustainable future where no food goes to waste. By partnering with local restaurants and our passionate community, we strive to build a system where everyone benefits—helping the environment, supporting local businesses, and providing affordable meals to those in need.
          </p>
        </section>

        {/* Values Section */}
        <section className="mb-12">
          <h2 className="text-4xl font-bold mb-6 text-green-600">Our Core Values</h2>
          <ul className="list-disc pl-6 text-gray-800 text-lg leading-relaxed">
            <li className="mb-4"><span className="font-semibold">✨ Sustainability</span>: We’re committed to eco-friendly practices, reducing food waste, and promoting a circular food economy.</li>
            <li className="mb-4"><span className="font-semibold">🤝 Community</span>: We believe in the power of collaboration, supporting local businesses, and strengthening our neighborhoods.</li>
            <li className="mb-4"><span className="font-semibold">❤️ Compassion</span>: By connecting surplus food with those who need it most, we act with empathy and aim to make a difference.</li>
            <li className="mb-4"><span className="font-semibold">🌱 Innovation</span>: We leverage technology to revolutionize how food is distributed and to ensure everyone has access to nutritious meals.</li>
          </ul>
        </section>

        {/* Join Us Section */}
        <section>
          <h2 className="text-4xl font-bold mb-6 text-green-600">Join Us on Our Journey!</h2>
          <p className="text-gray-800 text-lg leading-relaxed mb-6">
            Whether you're a restaurant owner looking to reduce food waste or someone who wants to support sustainable dining, we invite you to be part of our mission. Join us as we build a more sustainable and compassionate food system—one where every meal counts.
          </p>
          <p className="text-gray-800 text-lg leading-relaxed">
            Ready to make a difference? Explore our platform, connect with local restaurants, and help create a brighter future—together, we can save food and improve lives!
          </p>
        </section>
      </div>
    </div>
  );
};

export default AboutUsPage;
