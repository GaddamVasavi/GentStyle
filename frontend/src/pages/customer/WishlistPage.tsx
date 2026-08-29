import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { fetchWishlist } from '../../store/slices/wishlistSlice';
import { Link } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { ProductCard } from '../../components/products/ProductCard';
import { Heart, ArrowRight } from 'lucide-react';

export const WishlistPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items, isLoading } = useSelector((state: RootState) => state.wishlist);

  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-serif font-bold text-white">Saved Sartorial Wardrobe</h2>
        <p className="text-xs text-gray-400 mt-1">
          Your curated selection of luxury menswear garments and bespoke acquisitions.
        </p>
      </div>

      {isLoading ? (
        <div className="py-20 text-center text-xs text-gray-400">Loading saved garments...</div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 glass-panel rounded-2xl border border-gentborder space-y-4">
          <Heart className="w-12 h-12 text-luxury-400 mx-auto opacity-70" />
          <h3 className="font-serif text-xl text-white">Your Saved Wardrobe is Empty</h3>
          <p className="text-xs text-gray-400 max-w-md mx-auto">
            Discover exquisite tailoring, blazers, dress shirts, and Goodyear welted shoes to save to your personal lookbook.
          </p>
          <Link to="/shop">
            <Button variant="gold" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Explore Luxury Catalog
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <ProductCard key={item.id} product={item.product} />
          ))}
        </div>
      )}
    </div>
  );
};
