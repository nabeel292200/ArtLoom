import { Link } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import { useState, useEffect } from "react";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { toast } from "react-toastify";

export default function ProductCard({ product }) {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();

  // Initialize liked state from wishlist
  const [liked, setLiked] = useState(() => isInWishlist?.(product.id) || false);

  // Keep local liked state in sync with wishlist changes
  useEffect(() => {
    const current = isInWishlist?.(product.id) || false;
    if (current !== liked) setLiked(current);
  }, [product.id, isInWishlist]);

  // Handle wishlist toggle with toast
  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (liked) {
      removeFromWishlist(product.id);
      toast.error(`${product.title} removed from wishlist!`);
    } else {
      addToWishlist(product);
      toast.info(`${product.title} added to wishlist!`);
    }

    setLiked(!liked);
  };

  // Handle add to cart with toast
  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    toast.success(`${product.title} added to cart!`);
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
      <Link to={`/ProductDetail/${product.id}`}>
        <div className="relative overflow-hidden">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-64 object-cover transition-transform duration-300 hover:scale-105"
          />

          {/* Wishlist Button */}
          <button
            onClick={handleWishlist}
            className="absolute top-3 right-3 p-2 bg-white/90 rounded-full shadow-md hover:scale-110 transition"
          >
            <FaHeart className={liked ? "text-red-600" : "text-gray-400"} size={18} />
          </button>

          {/* New Badge */}
          <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            New
          </span>
        </div>
      </Link>

      <div className="p-6">
        <Link to={`/products/${product.id}`}>
          <h3 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-1 hover:text-blue-600">
            {product.title}
          </h3>
        </Link>

        <p className="text-gray-600 text-sm mb-3 line-clamp-1">
          By {product.author}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-amber-600">${product.price}</span>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {product.category}
          </span>
          <span className="text-xs text-gray-500">{product.place}</span>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          className="w-full mt-3 bg-gradient-to-r from-yellow-600 to-blue-800 text-white py-2 rounded-lg font-medium shadow-md hover:shadow-xl transition-all"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
