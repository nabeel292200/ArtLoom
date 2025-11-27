import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import Footer from "../components/footer";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { toast } from "react-toastify";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  const [searchTerm, setSearchTerm] = useState(""); 
  const [priceSort, setPriceSort] = useState("none");

  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();

  useEffect(() => {
    fetch("http://localhost:3001/products")
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setFilteredProducts(data);
      });
  }, []);

  // Filter & Sort
  useEffect(() => {
    let updatedList = [...products];

    if (searchTerm.trim() !== "") {
      updatedList = updatedList.filter((item) =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (priceSort === "low-high") updatedList.sort((a,b) => a.price - b.price);
    else if (priceSort === "high-low") updatedList.sort((a,b) => b.price - a.price);

    setFilteredProducts(updatedList);
  }, [searchTerm, priceSort, products]);

  // Reset Filters
  const resetFilters = () => {
    setSearchTerm("");
    setPriceSort("none");
    setFilteredProducts(products);
  };

  // Add to Cart with toast
  const handleAddToCart = (product) => {
    addToCart(product);
    toast.success(`${product.title} added to cart!`);
  };

  // Add to Wishlist with toast
  const handleAddToWishlist = (product) => {
    addToWishlist(product);
    toast.info(`${product.title} added to wishlist!`);
  };

  return (
    <>
      <div className="p-6 bg-gray-100 min-h-screen">
        <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-10 bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 bg-clip-text text-transparent drop-shadow-lg">
          Art Gallery
        </h1>

        {/* Filters */}
        <div className="flex flex-col md:flex-row justify-center gap-6 mb-10">
          <input
            type="text"
            placeholder="Search artworks..."
            className="px-4 py-2 rounded-lg border bg-white shadow-sm w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <select
            className="px-4 py-2 rounded-lg border bg-white shadow-sm"
            value={priceSort}
            onChange={(e) => setPriceSort(e.target.value)}
          >
            <option value="none">Sort by Price</option>
            <option value="low-high">Low → High</option>
            <option value="high-low">High → Low</option>
          </select>

          <button
            onClick={resetFilters}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg shadow"
          >
            Reset
          </button>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={() => handleAddToCart(product)}
              onAddToWishlist={() => handleAddToWishlist(product)}
            />
          ))}
        </div>
      </div>

      <Footer />
    </>
  );
}
