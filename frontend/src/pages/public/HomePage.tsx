import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { ArrowRight, Sparkles, ChevronRight } from 'lucide-react';

export const HomePage: React.FC = () => {
  const collections = [
    {
      title: 'The Sartorial Executive',
      desc: 'Bespoke double-breasted suits and Italian wool blazers.',
      slug: 'office-wear',
      image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80',
      badge: 'Boardroom',
    },
    {
      title: 'Riviera Summer Linen',
      desc: 'Breathable Mediterranean flax shirts and tailored shorts.',
      slug: 'summer-collection',
      image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
      badge: 'Resort',
    },
    {
      title: 'Midnight Black Tie',
      desc: 'Peak-lapel tuxedoes and silk-jacquard evening wear.',
      slug: 'party-wear',
      image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80',
      badge: 'Ceremonial',
    },
  ];

  const featuredCategories = [
    { name: 'Suits & Blazers', count: '48 Designs', slug: 'suits-blazers', img: 'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?auto=format&fit=crop&w=600&q=80' },
    { name: 'Bespoke Dress Shirts', count: '64 Styles', slug: 'shirts', img: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=600&q=80' },
    { name: 'Handcrafted Footwear', count: '32 Models', slug: 'shoes', img: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=600&q=80' },
    { name: 'Chronographs & Ties', count: '55 Items', slug: 'watches-accessories', img: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80' },
  ];

  return (
    <div className="space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        {/* Ambient Dark Overlay with high luxury hero background */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b0d10] via-[#0b0d10]/80 to-transparent z-10" />
        <img
          src="https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=2000&q=85"
          alt="GentStyle Luxury Menswear"
          className="absolute inset-0 w-full h-full object-cover object-center scale-105 transition-transform duration-1000"
        />

        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20">
          <div className="max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-luxury-950/80 border border-luxury-500/40 text-gold-400 text-xs tracking-widest uppercase font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Autumn/Winter 2026 Collection Unveiled</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-bold text-white tracking-tight leading-[1.1]">
              The Pinnacle of <br />
              <span className="gold-gradient-text">Modern Sartorial</span> Elegance.
            </h1>

            <p className="text-gray-300 text-sm sm:text-base leading-relaxed max-w-xl font-light">
              Crafted from the world's most prestigious textile mills. Explore hand-canvassed suits, Egyptian cotton shirts, and Goodyear-welted footwear tailored for the distinguished gentleman.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <Link to="/shop">
                <Button variant="gold" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Explore The Collection
                </Button>
              </Link>
              <Link to="/categories/suits-blazers">
                <Button variant="outline" size="lg">
                  Suits & Tailoring
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Curated Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-luxury-400 font-semibold">The Wardrobe Repertoire</span>
            <h2 className="text-3xl font-serif font-bold text-white mt-1">Curated Departments</h2>
          </div>
          <Link to="/shop" className="text-xs text-luxury-400 hover:text-luxury-300 flex items-center gap-1 uppercase tracking-wider font-semibold">
            <span>View All Departments</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredCategories.map((cat) => (
            <Link
              key={cat.slug}
              to={`/categories/${cat.slug}`}
              className="group relative h-96 rounded-xl overflow-hidden glass-panel border border-gentborder hover:border-luxury-500/50 transition-all duration-300 shadow-xl flex flex-col justify-end p-6"
            >
              <img
                src={cat.img}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 brightness-75 group-hover:brightness-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b0d10] via-[#0b0d10]/40 to-transparent" />
              <div className="relative z-10 space-y-1">
                <span className="text-[11px] uppercase tracking-widest text-luxury-300 font-medium">{cat.count}</span>
                <h3 className="text-xl font-serif font-bold text-white group-hover:text-gold-300 transition-colors">{cat.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Curated Fashion Discovery Collections */}
      <section className="bg-[#07090c] py-20 border-y border-gentborder">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs uppercase tracking-[0.3em] text-gold-400 font-semibold">Signature Curations</span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white">Fashion Collections</h2>
            <p className="text-xs sm:text-sm text-gray-400">
              Impeccably coordinated ensembles designed for life's most defining occasions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {collections.map((col) => (
              <div
                key={col.slug}
                className="group glass-panel rounded-xl overflow-hidden border border-gentborder hover:border-luxury-500/40 transition-all duration-300"
              >
                <div className="relative h-72 overflow-hidden">
                  <img
                    src={col.image}
                    alt={col.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-4 right-4 bg-luxury-950/80 border border-luxury-500/40 text-luxury-200 text-[10px] uppercase tracking-widest px-3 py-1 rounded-full font-semibold">
                    {col.badge}
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <h3 className="text-xl font-serif font-bold text-white group-hover:text-gold-300 transition-colors">
                    {col.title}
                  </h3>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    {col.desc}
                  </p>
                  <Link
                    to={`/collections/${col.slug}`}
                    className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-luxury-400 hover:text-luxury-300"
                  >
                    <span>Explore Lookbook</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Heritage & Craft Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-2xl overflow-hidden glass-panel border border-luxury-500/30 p-8 sm:p-16 flex flex-col lg:flex-row items-center justify-between gap-10">
          <div className="space-y-6 max-w-xl">
            <span className="text-xs uppercase tracking-[0.3em] text-gold-400 font-semibold">Sartorial Precision</span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white leading-tight">
              Bespoke Made-To-Measure & Alteration Guarantee
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              Every GentStyle suit undergoes a 120-point hand inspection. Our master tailors ensure immaculate lapel roll, chest drape, and shoulder expression tailored to your physique.
            </p>
            <div className="flex gap-4 pt-2">
              <Link to="/size-guide">
                <Button variant="secondary" size="md">
                  View Sartorial Size Guide
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 w-full lg:w-auto shrink-0">
            <div className="glass-panel p-6 rounded-xl border border-gentborder text-center space-y-1">
              <p className="text-3xl font-serif font-bold text-gold-400">100%</p>
              <p className="text-xs text-gray-300 font-medium">Virgin Super Wool</p>
            </div>
            <div className="glass-panel p-6 rounded-xl border border-gentborder text-center space-y-1">
              <p className="text-3xl font-serif font-bold text-gold-400">30-Day</p>
              <p className="text-xs text-gray-300 font-medium">Complimentary Swap</p>
            </div>
            <div className="glass-panel p-6 rounded-xl border border-gentborder text-center space-y-1">
              <p className="text-3xl font-serif font-bold text-gold-400">50K+</p>
              <p className="text-xs text-gray-300 font-medium">Distinguished Clients</p>
            </div>
            <div className="glass-panel p-6 rounded-xl border border-gentborder text-center space-y-1">
              <p className="text-3xl font-serif font-bold text-gold-400">4.9/5</p>
              <p className="text-xs text-gray-300 font-medium">Client Rating</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
