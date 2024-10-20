import React from 'react';

const AboutUsPage = () => {
  return (
    <div className="bg-gray-100 min-h-screen mt-16 p-6">
      <div className="container mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-4xl font-bold mb-6 text-center">About Us</h1>
        
        {/* Mission Section */}
        <section className="mb-8">
          <h2 className="text-3xl font-semibold mb-4">Our Mission</h2>
          <p className="text-gray-700 text-lg">
            At FoodSaver, our mission is to combat food waste and hunger by connecting consumers with local restaurants. We believe that everyone deserves access to quality food, and by facilitating the sale of unsold meals at a discount, we aim to make a positive impact on both the environment and our community.
          </p>
        </section>

        {/* Vision Section */}
        <section className="mb-8">
          <h2 className="text-3xl font-semibold mb-4">Our Vision</h2>
          <p className="text-gray-700 text-lg">
            We envision a world where no food goes to waste and everyone has access to delicious, affordable meals. By partnering with local restaurants and engaging our community, we strive to create a sustainable food system that benefits everyone involved.
          </p>
        </section>

        {/* Values Section */}
        <section className="mb-8">
          <h2 className="text-3xl font-semibold mb-4">Our Values</h2>
          <ul className="list-disc pl-5 text-gray-700">
            <li className="mb-2">✨ **Sustainability**: We prioritize environmentally-friendly practices in our operations.</li>
            <li className="mb-2">🤝 **Community**: We believe in the power of community and collaboration.</li>
            <li className="mb-2">❤️ **Compassion**: We are dedicated to helping those in need by reducing food waste.</li>
            <li className="mb-2">🌱 **Innovation**: We embrace technology to improve our services and reach more people.</li>
          </ul>
        </section>

        {/* Join Us Section */}
        <section>
          <h2 className="text-3xl font-semibold mb-4">Join Us in Making a Difference!</h2>
          <p className="text-gray-700 text-lg mb-4">
            Whether you're a food lover, a restaurant owner, or someone passionate about sustainability, we invite you to join our mission. Together, we can make a significant impact on our environment and our communities.
          </p>
          <p className="text-gray-700 text-lg mb-4">
            Explore our platform today and become part of the solution. Let's save food and save lives!
          </p>
        </section>
      </div>
    </div>
  );
};

export default AboutUsPage;
