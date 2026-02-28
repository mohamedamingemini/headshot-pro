
import React from 'react';
import { Star, Quote } from 'lucide-react';

const Testimonials: React.FC = () => {
  const testimonials = [
    {
      name: "Sarah Jenkins",
      role: "Marketing Director",
      text: "I was skeptical about AI headshots, but ProHeadshot AI completely changed my mind. The lighting and background are indistinguishable from a real studio session. I used my new photo for a keynote presentation and received so many compliments!",
      rating: 5
    },
    {
      name: "David Chen",
      role: "Software Engineer",
      text: "As someone who hates being in front of a camera, this was a lifesaver. I just uploaded a decent selfie from my vacation, and the AI transformed it into a professional LinkedIn photo that helped me land my current role at a top tech firm.",
      rating: 5
    },
    {
      name: "Elena Rodriguez",
      role: "Real Estate Agent",
      text: "In real estate, your image is everything. I needed a fresh look for my new listings but didn't have time for a shoot. ProHeadshot AI gave me exactly what I needed in minutes. The 'Outdoor Professional' style is perfect for my brand.",
      rating: 5
    }
  ];

  return (
    <section className="py-16 sm:py-24 w-full border-t border-slate-800">
      <div className="text-center mb-16">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">What Our Users Say</h2>
        <p className="text-slate-400 max-w-2xl mx-auto">Join thousands of professionals who have transformed their digital presence with our AI technology.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map((t, i) => (
          <div key={i} className="bg-slate-800/20 p-8 rounded-3xl border border-slate-700/50 relative">
            <Quote className="absolute top-6 right-6 w-8 h-8 text-indigo-500/20" />
            <div className="flex gap-1 mb-4">
              {[...Array(t.rating)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
              ))}
            </div>
            <p className="text-slate-300 mb-6 italic leading-relaxed">"{t.text}"</p>
            <div>
              <p className="text-white font-bold">{t.name}</p>
              <p className="text-indigo-400 text-sm">{t.role}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16 text-center text-slate-500 text-sm max-w-3xl mx-auto leading-relaxed">
        <p>
          Our users come from diverse backgrounds, including Fortune 500 executives, freelance creatives, and recent university graduates. We are proud to support their professional journeys by providing high-quality, accessible visual branding tools. Every testimonial reflects our commitment to quality, privacy, and user satisfaction.
        </p>
      </div>
    </section>
  );
};

export default Testimonials;
