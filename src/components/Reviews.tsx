import React from 'react';
import { Star, CheckCircle, Quote } from 'lucide-react';
import { TESTIMONIALS } from '../data/servicesData';

export const Reviews: React.FC = () => {
  return (
    <section id="reviews" className="py-16 bg-neutral-50/60 border-t border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <div className="inline-flex items-center gap-1 text-xs font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-full">
            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span>4.9 / 5 Star Rating from 18,400+ Users</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-neutral-900">
            Real Reviews from Indian Creators
          </h2>
          <p className="text-sm text-neutral-500">
            See how everyday YouTubers, reel creators, and business owners grew their reach with our services.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-6 sm:p-7 border border-neutral-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4 relative"
            >
              <Quote className="w-8 h-8 text-neutral-100 absolute top-5 right-5 pointer-events-none" />

              <div className="space-y-3">
                <div className="flex items-center gap-1">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed italic">
                  "{t.comment}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-neutral-100">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-11 h-11 rounded-full object-cover border-2 border-purple-200"
                />
                <div>
                  <div className="flex items-center gap-1">
                    <h4 className="font-bold text-sm text-neutral-900">{t.name}</h4>
                    {t.verified && (
                      <CheckCircle className="w-3.5 h-3.5 text-blue-600 fill-blue-600/10" />
                    )}
                  </div>
                  <span className="text-[11px] text-neutral-500 block leading-tight">{t.role}</span>
                  <span className="text-[10px] text-purple-700 font-semibold">{t.platform}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
