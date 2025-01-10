"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import { IProduct } from "@/models/products.models";
import Link from "next/link";
import { Camera } from "lucide-react";

const ProductsPage = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products");
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        setProducts(data.data);
        setLoading(false);
      } catch (err) {
        setError((err as Error).message);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // If data is loading or there's an error, display appropriate messages
  if (loading) {
    return (
      <div className="w-full h-screen flex justify-center items-center gap-2">
        <Camera className="animate-pulse" size={25} />
        Loading products...
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-screen flex justify-center items-center gap-2">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Page Header */}
      <h1 className="text-3xl font-semibold text-center mb-8">Our Products</h1>
      <p className="text-center mb-12 text-lg text-gray-600">
        Explore our collection of high-quality products.
      </p>

      {/* Grid Layout for Product Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Link
            key={product?._id?.toString()}
            href={`/products/${product._id}`}
            passHref
          >
            <div className="cursor-pointer">
              <ProductCard product={product} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ProductsPage;
