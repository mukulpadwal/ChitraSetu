/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import { IProduct } from "@/models/products.models";
import Link from "next/link";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import Loader from "@/components/Loader";

const ProductsPage = () => {
  const { status } = useSession();
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products");
        const data = await response.json();

        if (response.ok) {
          setProducts(data.data);
          toast.success(data.message);
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading || status === "loading") {
    return <Loader />;
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-semibold text-center mb-8">Our Products</h1>
      <p className="text-center mb-12 text-lg text-gray-600">
        Explore our collection of high-quality products.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard
            key={`${product._id}-${product.name}`}
            product={product}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductsPage;
