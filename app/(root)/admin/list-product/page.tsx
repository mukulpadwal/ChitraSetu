"use client";

import { useState } from "react";
import FileUpload from "@/components/FileUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IKUploadResponse } from "imagekitio-next/dist/types/components/IKUpload/props";
import Image from "next/image";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const IMAGE_VARIANTS = ["SQUARE", "WIDE", "PORTRAIT"];
const LICENSE_TYPES = ["personal", "commercial"];

function ListProductPage() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    variant: "",
    price: "",
    license: "",
    imageUrl: "",
    previewUrl: "",
    fileId: "",
  });

  const router = useRouter();

  const onSuccess = (response: IKUploadResponse) => {
    setFormData((prev) => ({
      ...prev,
      imageUrl: response.url,
      previewUrl: response.thumbnailUrl,
      fileId: response.fileId,
    }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.description ||
      !formData.variant ||
      !formData.price ||
      !formData.license ||
      !formData.imageUrl
    ) {
      toast.error("All fields are required.");
      return;
    }

    const productData = {
      name: formData.name,
      description: formData.description,
      imageUrl: formData.imageUrl,
      previewUrl: formData.previewUrl,
      fileId: formData.fileId,
      variants: [
        {
          type: formData.variant,
          price: parseFloat(formData.price),
          license: formData.license,
        },
      ],
    };

    // Add your API call logic here
    fetch("/api/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          toast.success(data.message);
          router.push(`/products/${data.data._id}`);
        } else {
          toast.error(data.message);
        }
      });
  };

  return (
    <div className="max-w-2xl min-h-screen mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold text-center">List a New Product</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Product Name */}
        <div>
          <Label htmlFor="name">Product Name</Label>
          <Input
            id="name"
            name="name"
            placeholder="Enter product name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        {/* Product Description */}
        <div>
          <Label htmlFor="description">Product Description</Label>
          <Textarea
            id="description"
            name="description"
            placeholder="Enter product description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        {/* Variant Selector */}
        <div>
          <Label htmlFor="variant">Select Variant</Label>
          <Select
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, variant: value }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Choose a variant" />
            </SelectTrigger>
            <SelectContent>
              {IMAGE_VARIANTS.map((variant) => (
                <SelectItem key={variant} value={variant}>
                  {variant}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Price */}
        <div>
          <Label htmlFor="price">Price</Label>
          <Input
            id="price"
            name="price"
            type="number"
            placeholder="Enter price"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>

        {/* License Selector */}
        <div>
          <Label htmlFor="license">Select License</Label>
          <Select
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, license: value }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Choose a license type" />
            </SelectTrigger>
            <SelectContent>
              {LICENSE_TYPES.map((license) => (
                <SelectItem key={license} value={license}>
                  {license}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Image Upload */}
        <div className="grid grid-cols-2">
          <div className="col-span-1">
            <Label>Upload Product Image</Label>
            <FileUpload onSuccess={onSuccess} />
          </div>
          {formData.imageUrl && (
            <div className="col-span-1">
              <Image
                src={formData.imageUrl}
                alt="Product Preview"
                className="w-full max-h-64 object-contain border"
                width={100}
                height={100}
              />
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="text-center w-full">
          <Button type="submit" className="w-full">
            List
          </Button>
        </div>
      </form>
    </div>
  );
}

export default ListProductPage;
