import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { categoryService } from '../../services/category.service';
import { Collection } from '../../types/product.types';
import { ArrowRight } from 'lucide-react';

export const CollectionsPage: React.FC = () => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadCollections() {
      try {
        const res = await categoryService.getCollections();
        setCollections(res.data || []);
      } catch (err) {
        console.error('Failed to load collections', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadCollections();
  }, []);

  const collectionImages: Record<string, string> = {
    'office-wear': 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1000&q=80',
    'weekend-casual': 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=1000&q=80',
    'party-wear': 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=80',
    'summer-collection': 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1000&q=80',
    'winter-collection': 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=1000&q=80',
    'wedding-collection': 'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?auto=format&fit=crop&w=1000&q=80',
    'streetwear': 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1000&q=80',
    'premium-collection': 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=1000&q=80',
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs uppercase tracking-[0.3em] text-gold-400 font-semibold">Seasonal Lookbooks</span>
        <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white">Curated Collections</h1>
        <p className="text-xs sm:text-sm text-gray-400">
          Explore complete sartorial ensembles meticulously curated by GentStyle master stylists.
        </p>
      </div>

      {isLoading ? (
        <div className="py-20 text-center text-xs text-gray-400">Loading seasonal lookbooks...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {collections.map((col) => (
            <Link
              key={col.id}
              to={`/shop?collection=${col.slug}`}
              className="group glass-panel rounded-2xl overflow-hidden border border-gentborder hover:border-luxury-500/50 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-[#12151b]">
                <img
                  src={col.bannerUrl || collectionImages[col.slug] || 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1000&q=80'}
                  alt={col.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                {col.season && (
                  <div className="absolute top-4 right-4 bg-black/80 backdrop-blur border border-white/10 text-gold-300 text-[10px] uppercase font-semibold px-3 py-1 rounded-full">
                    {col.season}
                  </div>
                )}
              </div>

              <div className="p-6 space-y-3">
                <h3 className="text-xl font-serif font-bold text-white group-hover:text-gold-300 transition-colors">
                  {col.title}
                </h3>
                <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">
                  {col.description}
                </p>
                <div className="pt-2 flex items-center justify-between text-xs text-luxury-400 font-semibold uppercase tracking-wider">
                  <span>Explore Lookbook</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
