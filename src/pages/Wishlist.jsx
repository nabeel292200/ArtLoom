import { Link } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { FaHeart, FaShoppingCart, FaTrash } from "react-icons/fa";

export default function Wishlist() {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleAddToCart = (product, e) => {
    e.preventDefault();
    e.stopPropagation();

    addToCart(product);          
    removeFromWishlist(product.id);   // ✅ REMOVE FROM WISHLIST when added to cart

    alert(`${product.title} added to cart!`);
  };

  const handleRemoveFromWishlist = (productId, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm("Are you sure you want to remove this item from your wishlist?")) {
      removeFromWishlist(productId);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Your Wishlist</h1>
          <p className="text-gray-600 text-lg">
            {wishlist.length === 0 
              ? "Save your favorite artworks for later" 
              : `You have ${wishlist.length} item${wishlist.length !== 1 ? 's' : ''} in your wishlist`}
          </p>
        </div>

        {wishlist.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center max-w-2xl mx-auto">
            <FaHeart className="mx-auto text-gray-400 text-6xl mb-6" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Your wishlist is empty</h2>
            <p className="text-gray-600 mb-8 text-lg">
              Start exploring our art collection and save your favorite pieces for later!
            </p>
            <Link
              to="/"
              className="bg-amber-500 text-white py-3 px-8 rounded-lg font-semibold hover:bg-amber-600 transition-colors inline-flex items-center gap-2"
            >
              Explore Artworks
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlist.map((product) => (
              <Link 
                key={product.id} 
                to={`/ProductDetail/${product.id}`}
                className="block"
              >
                <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group">

                  {/* Image Container */}
                  <div className="relative overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                    />

                    {/* Remove Button */}
                    <button
                      onClick={(e) => handleRemoveFromWishlist(product.id, e)}
                      className="absolute top-3 right-3 p-2 bg-white/90 rounded-full shadow-md hover:scale-110 transition-all duration-200 group/remove"
                    >
                      <FaTrash className="text-red-500 group-hover/remove:text-red-600" size={16} />
                    </button>

                    {/* Category Badge */}
                    <span className="absolute top-3 left-3 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                      {product.category}
                    </span>
                  </div>

                  {/* Product Info */}
                  <div className="p-5">
                    <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 group-hover:text-amber-600 transition-colors h-14">
                      {product.title}
                    </h3>
                    
                    <p className="text-gray-600 text-sm mb-2 line-clamp-1">
                      By {product.author}
                    </p>

                    <div className="flex items-center justify-between mb-3">
                      <span className="text-2xl font-bold text-amber-600">
                        ${product.price}
                      </span>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {product.place}
                      </span>
                    </div>

                    {/* Add to Cart Button */}
                    <button
                      onClick={(e) => handleAddToCart(product, e)}
                      className="w-full bg-amber-500 text-white py-3 rounded-lg font-medium hover:bg-amber-600 transition-colors flex items-center justify-center gap-2 group/cart"
                    >
                      <FaShoppingCart className="group-hover/cart:scale-110 transition-transform" />
                      <span>Add to Cart</span>
                    </button>

                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Clear All */}
        {wishlist.length > 0 && (
          <div className="mt-12 text-center">
            <div className="bg-white rounded-xl shadow-sm p-6 max-w-2xl mx-auto">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Love your collection?
              </h3>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">

                <Link
                  to="/"
                  className="bg-gray-800 text-white py-3 px-8 rounded-lg font-semibold hover:bg-gray-900 transition-colors"
                >
                  Continue Shopping
                </Link>

                <button
                  onClick={() => {
                    if (window.confirm("Are you sure you want to clear your entire wishlist?")) {
                      wishlist.forEach(product => removeFromWishlist(product.id));
                    }
                  }}
                  className="border border-red-500 text-red-600 py-3 px-8 rounded-lg font-semibold hover:bg-red-50 transition-colors"
                >
                  Clear All Items
                </button>

              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
