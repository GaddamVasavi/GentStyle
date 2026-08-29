import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { fetchProductBySlug } from '../../store/slices/productSlice';
import { toggleWishlistItem } from '../../store/slices/wishlistSlice';
import { openAuthModal, addToast } from '../../store/slices/uiSlice';
import { Button } from '../../components/common/Button';
import { SizeGuideModal } from '../../components/products/SizeGuideModal';
import { ProductCard } from '../../components/products/ProductCard';
import {
  Star,
  Heart,
  Truck,
  RotateCcw,
  ShieldCheck,
  Ruler,
  Check,
  Sparkles,
  ShoppingBag,
  Info,
} from 'lucide-react';
import { ProductVariant } from '../../types/product.types';

export const ProductDetailsPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { currentProduct: product, isLoading, error } = useSelector((state: RootState) => state.products);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);

  const [selectedImage, setSelectedImage] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (slug) {
      dispatch(fetchProductBySlug(slug));
      setSelectedSize('');
      setSelectedColor('');
      setValidationError(null);
    }
  }, [slug, dispatch]);

  useEffect(() => {
    if (product?.images && product.images.length > 0) {
      const primary = product.images.find((img) => img.isPrimary) || product.images[0];
      setSelectedImage(primary.imageUrl);
    }
    if (product?.variants && product.variants.length > 0) {
      // Auto pre-select first unique color if only one exists
      const colors = Array.from(new Set(product.variants.map((v) => v.colorName)));
      if (colors.length === 1) setSelectedColor(colors[0]);
    }
  }, [product]);

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center space-y-3 flex-col">
        <Sparkles className="w-8 h-8 text-luxury-400 animate-spin" />
        <p className="text-xs text-gray-400">Loading sartorial masterpiece...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-serif text-white font-bold">Product Not Found</h2>
        <p className="text-xs text-gray-400">The requested luxury garment is no longer in our active catalog.</p>
        <Link to="/shop">
          <Button variant="gold" size="md">Return to Catalog</Button>
        </Link>
      </div>
    );
  }

  const isWishlisted = wishlistItems.some((item) => item.product?.id === product.id);

  // Extract unique available sizes and colors
  const availableSizes = Array.from(new Set(product.variants?.map((v) => v.size) || []));
  const availableColors = Array.from(
    new Set(product.variants?.map((v) => JSON.stringify({ name: v.colorName, hex: v.colorHex })) || [])
  ).map((str) => JSON.parse(str));

  // Find active variant matching selected size & color
  const activeVariant: ProductVariant | undefined = product.variants?.find(
    (v) => (!selectedSize || v.size === selectedSize) && (!selectedColor || v.colorName === selectedColor)
  );

  const stockAvailable = activeVariant?.inventory ? activeVariant.inventory.quantity : 0;
  const isOutOfStock = product.variants && product.variants.length > 0 && stockAvailable <= 0 && selectedSize && selectedColor;

  const basePrice = Number(product.basePrice);
  const discountPrice = product.discountPrice ? Number(product.discountPrice) : null;
  const priceAdjustment = activeVariant?.priceAdjustment ? Number(activeVariant.priceAdjustment) : 0;
  const finalPrice = (discountPrice || basePrice) + priceAdjustment;

  const handleAddToCart = () => {
    if (!selectedSize) {
      setValidationError('Please select your preferred garment size.');
      return;
    }
    if (!selectedColor && availableColors.length > 0) {
      setValidationError('Please select your desired fabric color.');
      return;
    }
    if (stockAvailable <= 0) {
      setValidationError('Selected variant is currently out of stock.');
      return;
    }

    setValidationError(null);
    dispatch(
      addToast({
        type: 'success',
        message: `Added ${product.name} (${selectedSize} / ${selectedColor}) to your wardrobe cart.`,
      })
    );
  };

  const handleBuyNow = () => {
    if (!selectedSize || (!selectedColor && availableColors.length > 0)) {
      setValidationError('Please select required size and color before proceeding to checkout.');
      return;
    }
    handleAddToCart();
    navigate('/checkout');
  };

  const handleWishlistToggle = () => {
    if (!isAuthenticated) {
      dispatch(openAuthModal('login'));
      return;
    }
    dispatch(toggleWishlistItem({ productId: product.id, isWishlisted }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-gray-400">
        <Link to="/" className="hover:text-luxury-300">Storefront</Link>
        <span>/</span>
        <Link to="/shop" className="hover:text-luxury-300">Shop</Link>
        <span>/</span>
        {product.category && (
          <>
            <Link to={`/categories/${product.category.slug}`} className="hover:text-luxury-300">
              {product.category.name}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-gray-200 font-medium truncate max-w-[200px]">{product.name}</span>
      </nav>

      {/* Main Showcase Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left: Image Gallery & Zoom */}
        <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto sm:max-h-[600px] shrink-0">
              {product.images.map((img) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImage(img.imageUrl)}
                  className={`relative w-16 sm:w-20 aspect-[3/4] rounded-lg overflow-hidden border transition-all ${
                    selectedImage === img.imageUrl
                      ? 'border-gold-400 ring-2 ring-gold-400/40'
                      : 'border-gentborder opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img.imageUrl} alt={img.altText || ''} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Featured Large View */}
          <div className="relative flex-1 aspect-[3/4] rounded-2xl overflow-hidden glass-panel border border-gentborder bg-[#12151b] group">
            <img
              src={selectedImage || 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1200&q=85'}
              alt={product.name}
              className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
            />
          </div>
        </div>

        {/* Right: Product Attributes & Acquisition */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-2 border-b border-gentborder pb-6">
            {product.brand && (
              <p className="text-xs uppercase tracking-[0.3em] text-luxury-400 font-semibold">
                {product.brand.name}
              </p>
            )}
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white leading-tight">
              {product.name}
            </h1>
            <p className="text-xs text-gray-500 font-mono">SKU: {product.sku}</p>

            {/* Price & Rating */}
            <div className="flex items-center justify-between pt-3">
              <div className="flex items-baseline gap-3">
                <span className="text-2xl font-serif font-bold text-white">
                  ${finalPrice.toFixed(2)}
                </span>
                {discountPrice && (
                  <span className="text-sm text-gray-500 line-through">
                    ${basePrice.toFixed(2)}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1.5 text-xs text-gray-300">
                <div className="flex text-gold-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(Number(product.averageRating || 5))
                          ? 'fill-gold-400 text-gold-400'
                          : 'text-gray-600'
                      }`}
                    />
                  ))}
                </div>
                <span className="font-semibold">{Number(product.averageRating || 5.0).toFixed(1)}</span>
                <span className="text-gray-500">({product.reviewCount || 0} Reviews)</span>
              </div>
            </div>
          </div>

          {/* Validation Warning Alert */}
          {validationError && (
            <div className="p-3.5 bg-red-950/60 border border-red-800/80 rounded-xl flex items-center gap-2.5 text-red-200 text-xs">
              <Info className="w-4 h-4 text-red-400 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Color Selector */}
          {availableColors.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold uppercase tracking-wider text-gray-300">
                  Fabric Hue: <span className="text-luxury-300 font-normal">{selectedColor || 'Select color'}</span>
                </span>
              </div>
              <div className="flex items-center gap-3">
                {availableColors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => {
                      setSelectedColor(color.name);
                      setValidationError(null);
                    }}
                    title={color.name}
                    className={`relative w-8 h-8 rounded-full border-2 transition-all flex items-center justify-center ${
                      selectedColor === color.name
                        ? 'border-gold-400 ring-2 ring-gold-400/40 scale-110'
                        : 'border-gentborder hover:border-gray-400'
                    }`}
                    style={{ backgroundColor: color.hex }}
                  >
                    {selectedColor === color.name && (
                      <Check className="w-4 h-4 text-white drop-shadow" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size Selector */}
          {availableSizes.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold uppercase tracking-wider text-gray-300">
                  Tailored Size: <span className="text-luxury-300 font-normal">{selectedSize || 'Select size'}</span>
                </span>
                <button
                  type="button"
                  onClick={() => setIsSizeGuideOpen(true)}
                  className="inline-flex items-center gap-1 text-luxury-400 hover:text-luxury-300 transition-colors"
                >
                  <Ruler className="w-3.5 h-3.5" />
                  <span>Size Matrix Guide</span>
                </button>
              </div>

              <div className="grid grid-cols-5 gap-2">
                {availableSizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => {
                      setSelectedSize(size);
                      setValidationError(null);
                    }}
                    className={`py-2 text-center text-xs font-mono rounded-lg border transition-all ${
                      selectedSize === size
                        ? 'border-gold-400 bg-gold-400/20 text-gold-300 font-bold shadow-md'
                        : 'border-gentborder bg-[#12151b] text-gray-300 hover:border-gray-500'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Stock Status Indicator */}
          {selectedSize && selectedColor && (
            <div className="text-xs">
              {stockAvailable > 5 ? (
                <span className="text-emerald-400 flex items-center gap-1 font-medium">
                  ● In Stock – Available for Immediate White-Glove Dispatch
                </span>
              ) : stockAvailable > 0 ? (
                <span className="text-amber-400 flex items-center gap-1 font-semibold">
                  ● Only {stockAvailable} bespoke units remaining in stock
                </span>
              ) : (
                <span className="text-red-400 flex items-center gap-1 font-semibold">
                  ● Sold Out in Selected Specification
                </span>
              )}
            </div>
          )}

          {/* Actions: Add to Cart, Buy Now, Wishlist */}
          <div className="space-y-3 pt-2">
            <div className="flex gap-3">
              <Button
                variant="gold"
                size="lg"
                className="flex-1"
                onClick={handleAddToCart}
                disabled={Boolean(isOutOfStock)}
                leftIcon={<ShoppingBag className="w-4 h-4" />}
              >
                Add to Wardrobe
              </Button>

              <button
                onClick={handleWishlistToggle}
                className="p-3.5 rounded-lg glass-panel border border-gentborder hover:border-luxury-500/40 text-gray-300 hover:text-red-400 transition-colors"
                title="Save to Wishlist"
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
              </button>
            </div>

            <Button
              variant="outline"
              size="lg"
              className="w-full"
              onClick={handleBuyNow}
              disabled={Boolean(isOutOfStock)}
            >
              Acquire Now with Fast Checkout
            </Button>
          </div>

          {/* Luxury Commitments */}
          <div className="pt-6 border-t border-gentborder space-y-3 text-xs text-gray-400">
            <div className="flex items-center gap-3">
              <Truck className="w-4 h-4 text-luxury-400 shrink-0" />
              <span>Complimentary expedited delivery on all orders over $250</span>
            </div>
            <div className="flex items-center gap-3">
              <RotateCcw className="w-4 h-4 text-luxury-400 shrink-0" />
              <span>30-Day doorstep size exchange and alteration guarantee</span>
            </div>
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-4 h-4 text-luxury-400 shrink-0" />
              <span>100% Genuine artisanal mastercraft verified</span>
            </div>
          </div>
        </div>
      </div>

      {/* Specifications & Garment Anatomy */}
      <section className="glass-panel rounded-2xl p-8 sm:p-10 border border-gentborder space-y-6">
        <h3 className="font-serif text-xl font-bold text-white">Sartorial Specifications</h3>
        <p className="text-xs text-gray-300 leading-relaxed max-w-3xl">
          {product.description}
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-4 border-t border-gentborder">
          {product.material && (
            <div>
              <p className="text-[11px] uppercase tracking-wider text-luxury-400 font-semibold">Material</p>
              <p className="text-xs text-white font-medium mt-1">{product.material}</p>
            </div>
          )}
          {product.fabric && (
            <div>
              <p className="text-[11px] uppercase tracking-wider text-luxury-400 font-semibold">Fabric & Weave</p>
              <p className="text-xs text-white font-medium mt-1">{product.fabric}</p>
            </div>
          )}
          {product.fit && (
            <div>
              <p className="text-[11px] uppercase tracking-wider text-luxury-400 font-semibold">Cut & Fit</p>
              <p className="text-xs text-white font-medium mt-1">{product.fit}</p>
            </div>
          )}
          {product.careInstructions && (
            <div>
              <p className="text-[11px] uppercase tracking-wider text-luxury-400 font-semibold">Care Regimen</p>
              <p className="text-xs text-white font-medium mt-1">{product.careInstructions}</p>
            </div>
          )}
        </div>
      </section>

      {/* Related Sartorial Pieces */}
      {product.relatedProducts && product.relatedProducts.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-2xl font-bold text-white">Harmonious Pairings</h3>
            <Link to="/shop" className="text-xs text-luxury-400 hover:text-luxury-300 font-semibold uppercase tracking-wider">
              Explore More
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {product.relatedProducts.map((rel) => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </section>
      )}

      {/* Size Guide Modal */}
      <SizeGuideModal isOpen={isSizeGuideOpen} onClose={() => setIsSizeGuideOpen(false)} />
    </div>
  );
};
