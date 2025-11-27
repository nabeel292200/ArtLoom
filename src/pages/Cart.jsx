// Cart.jsx
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { FaTrash, FaShoppingBag, FaArrowRight } from "react-icons/fa";

export default function Cart() {
  const { cart, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();

  const totalPrice = cart.reduce((t, p) => t + p.price, 0);

  const handleBuyNow = () => {
    if (cart.length === 0) return;

    navigate("/payment", {
      state: {
        cartItems: cart,
        total: totalPrice * 1.1
      }
    });
  };

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Your Shopping Cart</h1>
        <p className="text-gray-600 mb-8">Review your selected artworks</p>

        {cart.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <FaShoppingBag className="mx-auto text-gray-400 text-5xl mb-4" />
            <p className="text-gray-600 text-lg mb-4">Your cart is empty</p>
            <button
              onClick={() => window.history.back()}
              className="bg-amber-500 text-white py-2 px-6 rounded-lg hover:bg-amber-600 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((product) => (
                <div
                  key={product.id}
                  className="bg-white p-6 shadow-lg rounded-xl flex flex-col sm:flex-row gap-4"
                >
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full sm:w-32 h-32 object-cover rounded-lg"
                  />

                  <div className="flex-grow">
                    <h2 className="font-semibold text-lg text-gray-800 mb-2">
                      {product.title}
                    </h2>
                    <p className="text-gray-600 text-sm mb-1">
                      By {product.author}
                    </p>
                    <p className="text-gray-500 text-sm mb-3">
                      {product.category}
                    </p>
                    <p className="font-bold text-amber-600 text-xl">
                      ${product.price}
                    </p>
                  </div>

                  <button
                    onClick={() => removeFromCart(product.id)}
                    className="flex items-center gap-2 bg-red-50 text-red-600 py-2 px-4 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    <FaTrash size={14} />
                    <span className="text-sm">Remove</span>
                  </button>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 shadow-lg rounded-xl sticky top-6">
                <h3 className="text-xl font-bold mb-4">Order Summary</h3>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Items ({cart.length})</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between text-gray-600">
                    <span>Tax</span>
                    <span>${(totalPrice * 0.1).toFixed(2)}</span>
                  </div>

                  <hr className="my-2" />

                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-amber-600">
                      ${(totalPrice * 1.1).toFixed(2)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleBuyNow}
                  className="w-full bg-amber-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-amber-600 flex items-center justify-center gap-3 mb-3"
                >
                  <FaShoppingBag />
                  <span>Proceed to Checkout</span>
                  <FaArrowRight />
                </button>

                <button
                  onClick={() => clearCart()}
                  className="w-full text-red-600 py-2 px-6 rounded-lg font-medium hover:bg-red-50 mt-3"
                >
                  Clear Entire Cart
                </button>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
