
import React from 'react';
import { CheckCircle2, Info } from 'lucide-react';

const ProfessionalTips: React.FC = () => {
  const tips = [
    {
      title: "Lighting is Everything",
      desc: "For the best AI transformation, upload a photo taken in natural light. Standing near a window during the day provides soft, even lighting that helps the AI understand your facial features more accurately."
    },
    {
      title: "Eye Level Matters",
      desc: "Try to use a photo where the camera is at eye level. High or low angles can distort facial proportions, making it harder for the AI to generate a perfectly balanced professional portrait."
    },
    {
      title: "Neutral Expressions",
      desc: "While a big smile is great, a natural, slight smile or a neutral expression often yields the most versatile results for corporate environments. Avoid exaggerated expressions for your base photo."
    },
    {
      title: "High Resolution",
      desc: "The clearer your original photo, the better the final result. Avoid using screenshots or photos that have been heavily compressed by social media apps before uploading."
    }
  ];

  return (
    <section className="py-16 sm:py-24 w-full border-t border-slate-800">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">Expert Tips for the Perfect AI Headshot</h2>
          <p className="text-slate-400 mb-8 leading-relaxed">
            Getting a studio-quality result starts with your input. While our AI is incredibly powerful, following these simple guidelines will ensure your generated headshots are indistinguishable from professional photography. We've analyzed thousands of generations to bring you these best practices.
          </p>
          
          <div className="space-y-6">
            {tips.map((tip, i) => (
              <div key={i} className="flex gap-4">
                <div className="mt-1">
                  <CheckCircle2 className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">{tip.title}</h4>
                  <p className="text-sm text-slate-400 leading-relaxed">{tip.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-900/20 to-slate-800/40 p-8 sm:p-10 rounded-3xl border border-indigo-500/20">
          <div className="flex items-center gap-3 mb-6">
            <Info className="w-6 h-6 text-indigo-400" />
            <h3 className="text-xl font-bold text-white">Why Quality Input Matters</h3>
          </div>
          <div className="space-y-4 text-slate-300 leading-relaxed">
            <p>
              Artificial Intelligence works by analyzing the patterns and textures in your original image. When you provide a high-quality, well-lit photo, the AI has more data to work with, allowing it to preserve your unique features while applying professional enhancements.
            </p>
            <p>
              Think of your uploaded photo as the "canvas" and our AI as the "artist." A clean, smooth canvas allows the artist to create a masterpiece. If the canvas is blurry or poorly lit, the artist has to guess at the details, which can lead to less realistic results.
            </p>
            <p>
              By spending just 30 seconds taking a good selfie against a plain wall in daylight, you're setting yourself up for a headshot that will impress recruiters, clients, and colleagues alike. It's the easiest way to ensure you get the most value out of our platform.
            </p>
            <p>
              Remember, your headshot is an investment in your career. Taking that extra moment to get the right base photo pays off in the quality of your digital identity for years to come.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfessionalTips;
