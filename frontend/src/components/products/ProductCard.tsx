import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { toggleWishlistItem } from '../../store/slices/wishlistSlice';
import { openAuthModal } from '../../store/slices/uiSlice';
import { Product } from '../../types/product.types';
import { Heart, Star, Sparkles } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);

  const isWishlisted = wishlistItems.some((item) => item.product?.id === product.id);
  const [isHovered, setIsHovered] = useState(false);

  const primaryImage = product.images?.find((img) => img.isPrimary)?.imageUrl || product.images?.[0]?.imageUrl || 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80';
  const secondaryImage = product.images?.[1]?.imageUrl || primaryImage;

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      dispatch(openAuthModal('login'));
      return;
    }
    dispatch(toggleWishlistItem({ productId: product.id, isWishlisted }));
  };

  const basePrice = Number(product.basePrice);
  const discountPrice = product.discountPrice ? Number(product.discountPrice) : null;
  const hasDiscount = discountPrice !== null && discountPrice < basePrice;
  const discountPercent = hasDiscount ? Math.round(((basePrice - discountPrice!) / basePrice) * 100) : 0;

  // Available unique sizes
  const sizes = Array.from(new Set(product.variants?.map((v) => v.size) || []));

  return (
    <div
      className="group relative flex flex-col glass-panel rounded-xl overflow-hidden border border-gentborder hover:border-luxury-500/50 transition-all duration-300 shadow-lg hover:shadow-2xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container with hover transition */}
      <Link to={`/products/${product.slug}`} className="relative aspect-[3/4] overflow-hidden bg-[#12151b] block">
        <img
          src={isHovered ? secondaryImage : primaryImage}
          alt={product.name}
          className="w-full h-full object-cover object-center transition-all duration-700 group-hover:scale-105"
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.isBestSeller && (
            <span className="px-2.5 py-0.5 rounded text-[10px] uppercase tracking-wider font-semibold bg-gold-500 text-gentblack shadow-md flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span>Bestseller</span>
            </span>
          )}
          {hasDiscount && (
            <span className="px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-bold bg-red-600/90 text-white shadow-md">
              -{discountPercent}%
            </span>
          )}
          {product.isNewArrival && !hasDiscount && !product.isBestSeller && (
            <span className="px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-semibold bg-luxury-900 border border-luxury-500/40 text-luxury-200 shadow-md">
              New Arrival
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistClick}
          className="absolute top-3 right-3 p-2 rounded-full bg-[#0b0d10]/70 backdrop-blur border border-white/10 text-gray-300 hover:text-red-400 hover:scale-110 transition-all z-10"
          aria-label="Toggle Wishlist"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-300'
            }`}
          />
        </button>

        {/* Size Bar on Hover */}
        {sizes.length > 0 && (
          <div className="absolute bottom-0 inset-x-0 bg-black/75 backdrop-blur-sm px-3 py-2 text-center transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 text-[11px] text-gray-300 flex items-center justify-center gap-1.5 flex-wrap">
            <span className="text-gray-400 text-[10px] uppercase mr-1">Sizes:</span>
            {sizes.slice(0, 6).map((size) => (
              <span key={size} className="px-1.5 py-0.5 bg-white/10 rounded font-mono text-[10px]">
                {size}
              </span>
            ))}
          </div>
        )}
      </Link>

      {/* Details Section */}
      <div className="p-4 sm:p-5 flex flex-col flex-grow justify-between space-y-3">
        <div className="space-y-1">
          {product.brand && (
            <p className="text-[11px] uppercase tracking-widest text-luxury-400 font-medium truncate">
              {product.brand.name}
            </p>
          )}

          <Link to={`/products/${product.slug}`} className="block">
            <h3 className="font-serif font-semibold text-white text-sm group-hover:text-gold-300 transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>

          {product.fabric && (
            <p className="text-xs text-gray-400 truncate">{product.fabric}</p>
          )}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-gentborder/60">
          <div className="flex items-baseline gap-2">
            {hasDiscount ? (
              <>
                <span className="font-serif font-bold text-white text-base">
                  ${discountPrice?.toFixed(2)}
                </span>
                <span className="text-xs text-gray-500 line-through">
                  ${basePrice.toFixed(2)}
                </span>
              </>
            ) : (
              <span className="font-serif font-bold text-white text-base">
                ${basePrice.toFixed(2)}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 text-[11px] text-gray-400">
            <Star className="w-3.5 h-3.5 text-gold-400 fill-gold-400" />
            <span>{Number(product.averageRating || 5.0).toFixed(1)}</span>
            <span className="text-gray-600">({product.reviewCount || 0})</span>
          </div>
        </div>
      </div>
    </div>
  );
};
