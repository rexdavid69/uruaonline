import React from "react";

interface ProductCardProps {
  name: string;
  description: string;
  price: number;
  image: string | null;
}

const ProductCard: React.FC<ProductCardProps> = ({ name, description, price, image }) => {
  return (
    <div className="relative bg-white dark:bg-gray-900 shadow-lg rounded-2xl overflow-hidden flex flex-col group transition-transform duration-300 hover:scale-105">
      {/* Image */}
      <div className="h-56 w-full relative overflow-hidden">
        <img
          src={image || "https://via.placeholder.com/400"}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button className="px-5 py-2 bg-primary-light dark:bg-primary-dark text-white rounded-md font-bold hover:bg-blue-500 dark:hover:bg-blue-600 transition-colors">
            Add to Cart
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-xl font-extrabold text-gray-900 dark:text-gray-100">{name}</h3>
          <p className="text-gray-700 dark:text-gray-300 mt-2">{description}</p>
        </div>
        <div className="mt-4">
          <span className="text-lg font-bold text-primary-light dark:text-primary-dark">
            ${price.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
