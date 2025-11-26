// import { FaStar, FaHeart } from "react-icons/fa";
// import { useState } from "react";

// export default function ProductCard({ product }) {
//   const [liked, setLiked] = useState(false);

//   return (
//     <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden hover:-translate-y-2">
      
//       {/* IMAGE SECTION */}
//       <div className="relative h-56 w-full overflow-hidden">
//         <img
//           src={product.image}
//           alt={product.title}
//           className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
//         />

//         {/* Wishlist Heart Icon */}
//         <button 
//           onClick={() => setLiked(!liked)}
//           className="absolute top-3 right-3 p-2 bg-white/90 rounded-full shadow-md hover:scale-110 transition"
//         >
//           <FaHeart className={liked ? "text-red-600" : "text-gray-400"} size={18} />
//         </button>

//         {/* Badge */}
//         <span className="absolute top-3 left-3 bg-black/70 text-white text-xs px-2 py-1 rounded-md">
//           New
//         </span>
//       </div>

//       {/* CONTENT SECTION */}
//       <div className="p-4 space-y-3">
//         <h2 className="text-lg font-semibold text-gray-800 line-clamp-1">
//           {product.title}
//         </h2>

//         {/* Ratings */}
//         <div className="flex items-center gap-1 text-yellow-400">
//           {[...Array(5)].map((_, i) => (
//             <FaStar key={i} />
//           ))}
//         </div>

//         {/* Price */}
//         <p className="text-2xl font-bold text-blue-600">
//           ${product.price}
//         </p>

//         {/* Description */}
//         <p className="text-sm text-gray-600 line-clamp-2">
//           {product.description || "Premium artwork for your home décor"}
//         </p>

//         {/* Add to Cart */}
//         <button className="w-full mt-3 bg-gradient-to-r from-yellow-600 to-blue-800 text-white py-2 rounded-lg font-medium shadow-md hover:shadow-xl hover:from-yellow-700 hover:to-blue-900 transition-all">
//           Add to Cart
//         </button>
//       </div>
//     </div>
//   );
// }




import { FaStar, FaHeart } from "react-icons/fa";
import { useState } from "react";
import { useWishlist } from "../context/WishlistContext";

export default function ProductCard({ product }) {
  const [liked, setLiked] = useState(false);
  const { addToWishlist } = useWishlist();

  const handleWishlist = () => {
    setLiked(!liked);
    addToWishlist(product); // ADD PRODUCT TO WISHLIST
  };

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden hover:-translate-y-2">

      <div className="relative h-56 w-full overflow-hidden">
        <img
          src={product.image}
          alt={product.title}
          className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
        />

        <button
          onClick={handleWishlist}
          className="absolute top-3 right-3 p-2 bg-white/90 rounded-full shadow-md hover:scale-110 transition"
        >
          <FaHeart className={liked ? "text-red-600" : "text-gray-400"} size={18} />
        </button>

        <span className="absolute top-3 left-3 bg-black/70 text-white text-xs px-2 py-1 rounded-md">
          New
        </span>
      </div>

      <div className="p-4 space-y-3">
        <h2 className="text-lg font-semibold text-gray-800 line-clamp-1">
          {product.title}
        </h2>

        <div className="flex items-center gap-1 text-yellow-400">
          {[...Array(5)].map((_, i) => (
            <FaStar key={i} />
          ))}
        </div>

        <p className="text-2xl font-bold text-blue-600">${product.price}</p>

        <p className="text-sm text-gray-600 line-clamp-2">
          {product.description || "Premium artwork for your home décor"}
        </p>

        <button className="w-full mt-3 bg-gradient-to-r from-yellow-600 to-blue-800 text-white py-2 rounded-lg font-medium shadow-md hover:shadow-xl">
          Add to Cart
        </button>
      </div>
    </div>
  );
}
