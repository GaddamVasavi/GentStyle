import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { categoryService } from '../../services/category.service';
import { Category } from '../../types/product.types';
import { ChevronRight } from 'lucide-react';

export const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await categoryService.getCategories();
        setCategories(res.data || []);
      } catch (err) {
        console.error('Failed to load categories', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs uppercase tracking-[0.3em] text-gold-400 font-semibold">The Wardrobe Departments</span>
        <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white">Sartorial Taxonomy</h1>
        <p className="text-xs sm:text-sm text-gray-400">
          Browse by specialized garment craftsmanship, tailoring categories, and accessories.
        </p>
      </div>

      {isLoading ? (
        <div className="py-20 text-center text-xs text-gray-400">Loading departments...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="glass-panel rounded-2xl p-6 border border-gentborder hover:border-luxury-500/40 transition-all space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-xl font-bold text-white">{cat.name}</h3>
                <span className="text-xs text-gold-400 font-mono font-semibold">
                  {cat._count?.products || 0} Pieces
                </span>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">{cat.description}</p>

              {cat.subcategories && cat.subcategories.length > 0 && (
                <div className="pt-3 border-t border-gentborder/60 space-y-2">
                  <p className="text-[11px] uppercase tracking-wider text-luxury-300 font-semibold">Sub-disciplines</p>
                  <div className="flex flex-wrap gap-1.5">
                    {cat.subcategories.map((sub) => (
                      <Link
                        key={sub.id}
                        to={`/shop?category=${cat.slug}&subcategory=${sub.slug}`}
                        className="px-2.5 py-1 rounded bg-[#12151b] border border-gentborder hover:border-luxury-500 text-[11px] text-gray-300 transition-colors"
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-2">
                <Link
                  to={`/shop?category=${cat.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs text-luxury-400 hover:text-luxury-300 font-semibold uppercase tracking-wider"
                >
                  <span>Explore Department</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
