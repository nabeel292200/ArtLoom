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

  // Paginationte logic
  const [currentPage, setCurrentPage] = useState(() => {
    return Number(localStorage.getItem("currentPage")) || 1;
  });

  const itemsPerPage = 6;

  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  // paginationl  localStorage save cheyan
  useEffect(() => {
    localStorage.setItem("currentPage", currentPage);
  }, [currentPage]);

  //  products load cheyan
  useEffect(() => {
    fetch("http://localhost:3001/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setFilteredProducts(data);
      });
  }, []);

  // Filter and Sort amount case
  useEffect(() => {
    let updatedList = [...products];

    if (searchTerm.trim() !== "") {
      updatedList = updatedList.filter((item) =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (priceSort === "low-high") updatedList.sort((a, b) => a.price - b.price);
    else if (priceSort === "high-low")
      updatedList.sort((a, b) => b.price - a.price);

    setFilteredProducts(updatedList);
    setCurrentPage(1);
  }, [searchTerm, priceSort, products]);

  // filter Reset cheyan
  const resetFilters = () => {
    setSearchTerm("");
    setPriceSort("none");
    setFilteredProducts(products);
    setCurrentPage(1);
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirst, indexOfLast);

  const goToPage = (page) => {
    setCurrentPage(page); 
  };

  // Add to cart button
  const handleAddToCart = (product) => {
    addToCart(product);
    toast.success(`${product.title} added to cart!`);
  };

  // Wishlist icon
  const handleWishlistToggle = (product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      toast.info(`${product.title} removed from wishlist`);
    } else {
      addToWishlist(product);
      toast.success(`${product.title} added to wishlist`);
    }
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

        {/* Product box */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentItems.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isWishlisted={isInWishlist(product.id)}
              onAddToCart={() => handleAddToCart(product)}
              onToggleWishlist={() => handleWishlistToggle(product)}
            />
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-10 gap-3">
          {/* Prev button */}
          <button
            className={`px-4 py-2 rounded-lg border ${
              currentPage === 1
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-white hover:bg-gray-200"
            }`}
            disabled={currentPage === 1}
            onClick={() => goToPage(currentPage - 1)}
          >
             Prev
          </button>

         
          {[...Array(totalPages).keys()].map((num) => (
            <button
              key={num}
              onClick={() => goToPage(num + 1)}
              className={`px-4 py-2 rounded-lg border ${
                currentPage === num + 1
                  ? "bg-orange-500 text-white font-bold"
                  : "bg-white hover:bg-gray-200"
              }`}
            >
              {num + 1}
            </button>
          ))}

          {/* Next button*/}
          <button
            className={`px-4 py-2 rounded-lg border ${
              currentPage === totalPages
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-white hover:bg-gray-200"
            }`}
            disabled={currentPage === totalPages}
            onClick={() => goToPage(currentPage + 1)}
          >
            Next 
          </button>
        </div>
      </div>

      <Footer />
    </>
  );
}
