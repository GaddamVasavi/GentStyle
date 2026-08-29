import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { fetchProducts } from '../../store/slices/productSlice';
import { categoryService } from '../../services/category.service';
import { ProductCard } from '../../components/products/ProductCard';
import { Button } from '../../components/common/Button';
import { SlidersHorizontal, Sparkles, Check } from 'lucide-react';
import { Category, Brand } from '../../types/product.types';

export const ShopPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [searchParams, setSearchParams] = useSearchParams();
  const { items: products, isLoading, pagination } = useSelector((state: RootState) => state.products);

  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Filter local state derived from query params
  const currentCategory = searchParams.get('category') || '';
  const currentBrand = searchParams.get('brand') || '';
  const currentSort = searchParams.get('sortBy') || 'newest';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const currentSize = searchParams.get('size') || '';

  useEffect(() => {
    async function loadTaxonomy() {
      try {
        const [catRes, brandRes] = await Promise.all([
          categoryService.getCategories(),
          categoryService.getBrands(),
        ]);
        setCategories(catRes.data || []);
        setBrands(brandRes.data || []);
      } catch (err) {
        console.error('Failed to load filter metadata', err);
      }
    }
    loadTaxonomy();
  }, []);

  useEffect(() => {
    dispatch(
      fetchProducts({
        categorySlug: currentCategory || undefined,
        brandSlug: currentBrand || undefined,
        sortBy: currentSort || undefined,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        size: currentSize || undefined,
        page: Number(searchParams.get('page')) || 1,
      })
    );
  }, [dispatch, searchParams, currentCategory, currentBrand, currentSort, minPrice, maxPrice, currentSize]);

  const updateParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value) {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    next.set('page', '1');
    setSearchParams(next);
  };

  const clearAllFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '38R', '40R', '42R', '8.0', '9.0', '10.0', '11.0'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-gentborder">
        <div>
          <span className="text-xs uppercase tracking-[0.3em] text-luxury-400 font-semibold">The Complete Wardrobe</span>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white mt-1">Sartorial Catalog</h1>
          <p className="text-xs text-gray-400 mt-1">Discover handcrafted luxury garments, tailored formalwear, and curated accessories.</p>
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-3">
          <label htmlFor="shop-sort-by" className="text-xs text-gray-400 uppercase tracking-wider">Sort By:</label>
          <select
            id="shop-sort-by"
            value={currentSort}
            onChange={(e) => updateParam('sortBy', e.target.value)}
            className="bg-[#12151b] border border-gentborder text-xs rounded-lg px-3 py-2 text-white focus:outline-none focus:border-luxury-500"
          >
            <option value="newest">Newest Arrivals</option>
            <option value="popular">Most Popular</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
            <option value="discount">Biggest Savings</option>
          </select>

          <Button
            variant="secondary"
            size="sm"
            className="lg:hidden"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            leftIcon={<SlidersHorizontal className="w-3.5 h-3.5" />}
          >
            Filters
          </Button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Desktop Filters Sidebar */}
        <aside className="hidden lg:block w-64 shrink-0 space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-sm uppercase tracking-wider text-white">Refine Wardrobe</h3>
            {(currentCategory || currentBrand || currentSize || minPrice || maxPrice) && (
              <button
                onClick={clearAllFilters}
                className="text-xs text-luxury-400 hover:text-luxury-300 transition-colors"
              >
                Clear All
              </button>
            )}
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-luxury-300">Department</h4>
            <div className="space-y-1">
              <button
                onClick={() => updateParam('category', '')}
                className={`w-full text-left text-xs py-1.5 px-2 rounded transition-colors ${
                  !currentCategory ? 'text-gold-400 font-semibold bg-luxury-950/60' : 'text-gray-400 hover:text-white'
                }`}
              >
                All Departments
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => updateParam('category', cat.slug)}
                  className={`w-full text-left text-xs py-1.5 px-2 rounded transition-colors flex items-center justify-between ${
                    currentCategory === cat.slug
                      ? 'text-gold-400 font-semibold bg-luxury-950/60'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <span>{cat.name}</span>
                  {cat._count && <span className="text-[10px] text-gray-500">{cat._count.products}</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Brands */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-luxury-300">Sartorial Maison</h4>
            <div className="space-y-1 max-h-48 overflow-y-auto pr-2">
              {brands.map((brand) => (
                <button
                  key={brand.id}
                  onClick={() => updateParam('brand', currentBrand === brand.slug ? '' : brand.slug)}
                  className={`w-full text-left text-xs py-1.5 px-2 rounded transition-colors flex items-center justify-between ${
                    currentBrand === brand.slug
                      ? 'text-gold-400 font-semibold bg-luxury-950/60'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <span>{brand.name}</span>
                  {currentBrand === brand.slug && <Check className="w-3 h-3 text-gold-400" />}
                </button>
              ))}
            </div>
          </div>

          {/* Sizes */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-luxury-300">Size</h4>
            <div className="grid grid-cols-4 gap-1.5">
              {sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => updateParam('size', currentSize === s ? '' : s)}
                  className={`py-1.5 text-center text-xs font-mono rounded border transition-colors ${
                    currentSize === s
                      ? 'border-gold-400 bg-gold-400/20 text-gold-300 font-bold'
                      : 'border-gentborder text-gray-400 hover:border-gray-500 hover:text-white'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-luxury-300">Price ($ USD)</h4>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => updateParam('minPrice', e.target.value)}
                className="w-full bg-[#12151b] border border-gentborder text-xs px-2.5 py-1.5 rounded text-white focus:outline-none focus:border-luxury-500"
              />
              <span className="text-gray-500">-</span>
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => updateParam('maxPrice', e.target.value)}
                className="w-full bg-[#12151b] border border-gentborder text-xs px-2.5 py-1.5 rounded text-white focus:outline-none focus:border-luxury-500"
              />
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1 space-y-8">
          {isLoading ? (
            <div className="py-24 text-center space-y-3">
              <Sparkles className="w-8 h-8 text-luxury-400 animate-spin mx-auto" />
              <p className="text-xs text-gray-400">Curating luxury menswear catalog...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="glass-panel rounded-2xl p-16 text-center border border-gentborder space-y-4">
              <h3 className="font-serif text-xl text-white">No Sartorial Pieces Found</h3>
              <p className="text-xs text-gray-400 max-w-md mx-auto">
                No products match the selected criteria. Try removing some filters or browsing all departments.
              </p>
              <Button variant="outline" size="sm" onClick={clearAllFilters}>
                Reset Filter Parameters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6 border-t border-gentborder">
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => updateParam('page', pageNum.toString())}
                  className={`w-9 h-9 rounded-lg text-xs font-mono transition-colors ${
                    pagination.page === pageNum
                      ? 'bg-luxury-600 text-white font-bold'
                      : 'bg-[#12151b] text-gray-400 hover:text-white border border-gentborder'
                  }`}
                >
                  {pageNum}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
