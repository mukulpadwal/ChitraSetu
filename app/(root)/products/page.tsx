"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import { IProduct } from "@/models/products.models";
import toast from "react-hot-toast";
import Loader from "@/components/Loader";

const ProductsPage = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProducts = async () => {
      await fetch("/api/products")
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            setProducts(data.data);
            toast.success(data.message);
          } else {
            toast.error(data.message);
          }
        })
        .catch(() =>
          toast.error("Failed to load products. Please try again later.")
        )
        .finally(() => setLoading(false));
    };

    fetchProducts();
  }, []);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="max-w-7xl mx-auto p-4">
          <h1 className="text-3xl font-semibold text-center mb-8">
            Our Products
          </h1>
          <p className="text-center mb-12 text-lg text-gray-600">
            Explore our collection of high-quality products.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={`${product._id}-${product.name}`}
                product={product}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default ProductsPage;
