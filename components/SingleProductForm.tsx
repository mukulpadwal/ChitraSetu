"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "./ui/textarea";
import FileUpload from "./FileUpload";
import { IKUploadResponse } from "imagekitio-next/dist/types/components/IKUpload/props";
import Image from "next/image";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const MAX_UPLOAD_SIZE = 1024 * 1024 * 3; // 3MB
const ACCEPTED_FILE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const listProductFormSchema = z.object({
  name: z.string({
    required_error: "Name is required",
    invalid_type_error: "Name must be a string",
  }),
  description: z.string({
    required_error: "Description is required",
    invalid_type_error: "Description must be a string",
  }),
  variants: z.enum(["SQUARE", "WIDE", "PORTRAIT"]),
  price: z.coerce
    .number({
      required_error: "Price is required",
      invalid_type_error: "Price must be a number",
    })
    .int()
    .positive(),
  license: z.enum(["personal", "commercial"]),
  image: z
    .instanceof(File, {
      message: "Please select an image file.",
    })
    .optional()
    .refine((file) => {
      return !file || file?.size <= MAX_UPLOAD_SIZE;
    }, "File size must be less than 3MB")
    .refine((file) => {
      return !file || ACCEPTED_FILE_TYPES.includes(file?.type);
    }, "File must be a PNG"),
});

function SingleProductForm() {
  const [uploadedImage, setUploadedImage] = useState<IKUploadResponse | null>(
    null
  );

  const router = useRouter();

  const form = useForm<z.infer<typeof listProductFormSchema>>({
    resolver: zodResolver(listProductFormSchema),
    defaultValues: {
      name: "",
      description: "",
      variants: "SQUARE",
      price: 0,
      license: "commercial",
    },
  });

  function onSubmit(values: z.infer<typeof listProductFormSchema>) {
    const productData = {
      name: values.name,
      description: values.description,
      imageUrl: uploadedImage?.url,
      previewUrl: uploadedImage?.thumbnailUrl,
      fileId: uploadedImage?.fileId,
      variants: [
        {
          type: values.variants,
          price: values.price,
          license: values.license,
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
  }

  const onSuccess = (response: IKUploadResponse) => {
    setUploadedImage(response);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold text-lg"> Product Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter product name" {...field} />
              </FormControl>
              <FormDescription>Enter the name of your product.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold text-lg">
                Product Description
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter product description"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Make sure the description is relevant and good.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="variants"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold text-lg">
                Select Variant
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a variant" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {["SQUARE", "WIDE", "PORTRAIT"].map((variant) => (
                    <SelectItem key={variant} value={variant}>
                      {variant}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Choose the variant of image you are uploading.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold text-lg">Price</FormLabel>
              <FormControl>
                <Input placeholder="Enter price" type="number" {...field} />
              </FormControl>
              <FormDescription>Enter the price of your image.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="license"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold text-lg">
                Select License
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a license type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {["personal", "commercial"].map((license) => (
                    <SelectItem key={license} value={license}>
                      {license}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Choose the license of image you are uploading.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2">
          <div className="col-span-1">
            <FormField
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold text-lg">
                    Upload Product Image
                  </FormLabel>

                  <FormControl>
                    <FileUpload onSuccess={onSuccess} {...field} />
                  </FormControl>

                  <FormDescription>Upload your image</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="col-span-1">
            {uploadedImage && (
              <Image
                src={uploadedImage?.thumbnailUrl as string}
                alt="Product Preview"
                className="w-full max-h-64 object-contain border"
                width={uploadedImage.width}
                height={uploadedImage.height}
              />
            )}
          </div>
        </div>

        <Button type="submit" className="w-full">
          List
        </Button>
      </form>
    </Form>
  );
}
export default SingleProductForm;
