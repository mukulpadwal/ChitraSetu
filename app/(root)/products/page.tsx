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

  useEffect(() => {
    fetch("/api/products")
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          toast.success(data.message);
          setProducts(data.data);
        } else {
          toast.error(data.message);
        }
      });
  }, []);

  return (
    <>
      {status === "loading" ? (
        <Loader />
      ) : (
        <div className="max-w-7xl mx-auto p-6">
          <h1 className="text-3xl font-semibold text-center mb-8">
            Our Products
          </h1>
          <p className="text-center mb-12 text-lg text-gray-600">
            Explore our collection of high-quality products.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Link
                key={product?._id?.toString()}
                href={`/products/${product._id}`}
                className="cursor-pointer"
              >
                <ProductCard product={product} />\
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default ProductsPage;
