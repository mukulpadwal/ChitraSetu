"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
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
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";

const LICENSE_OPTIONS = ["personal", "commercial"] as const;

const listProductFormSchema = z.object({
  name: z
    .string({
      required_error: "Name is required",
      invalid_type_error: "Name must be a string",
    })
    .nonempty(),
  description: z
    .string({
      required_error: "Description is required",
      invalid_type_error: "Description must be a string",
    })
    .nonempty(),
  variants: z.array(
    z.object({
      type: z.enum(["SQUARE", "WIDE", "PORTRAIT"]),
      image: z.custom<IKUploadResponse | null>(),
      price: z.coerce
        .number({
          required_error: "Price is required",
          invalid_type_error: "Price must be a number",
        })
        .positive()
        .int(),
    })
  ),
  license: z.enum(LICENSE_OPTIONS),
});

type FormSchema = z.infer<typeof listProductFormSchema>;

function MultipleProductsForm() {
  const router = useRouter();
  const form = useForm<FormSchema>({
    resolver: zodResolver(listProductFormSchema),
    defaultValues: {
      name: "",
      description: "",
      variants: [
        { type: "SQUARE", image: null, price: 0 },
        { type: "WIDE", image: null, price: 0 },
        { type: "PORTRAIT", image: null, price: 0 },
      ],
      license: "commercial",
    },
  });
  const [isPending, setIsPending] = useState<boolean>(false);

  // Handle form submission
  function onSubmit(values: FormSchema) {
    const nullImages = values.variants.filter(
      (variant) => variant.image === null
    );

    if (nullImages.length === 3) {
      toast.error("Kindly upload any one variant of image");
      return;
    }

    const variantsData = values.variants
      .map((variant) => {
        if (variant.image) {
          return {
            type: variant.type,
            price: variant.price,
            downloadUrl: variant?.image?.url,
            previewUrl: variant?.image?.thumbnailUrl,
            fileId: variant?.image?.fileId,
            filePath: variant?.image?.filePath,
            dimensions: {
              width: variant?.image?.width,
              height: variant?.image?.height,
            },
          };
        }

        return null;
      })
      .filter((variant) => variant !== null);

    const productsData = {
      name: values.name,
      description: values.description,
      license: values.license,
      variants: variantsData,
    };

    setIsPending(true);

    fetch("/api/products/list", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productsData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          toast.success(data.message);
          router.push(`/products/${data.data._id}`);
        } else {
          toast.error(data.message);
        }
      })
      .catch(() =>
        toast.error("Something went wrong while listing your products...")
      )
      .finally(() => setIsPending(false));
  }

  const renderFileUpload = (index: number) => {
    const variant = form.watch(`variants.${index}.type`);
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border shadow-sm rounded-md p-2">
        {/* Image Field */}
        <Controller
          name={`variants.${index}.image`}
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold text-lg">{`${variant} Image`}</FormLabel>
              <FormControl>
                <FileUpload
                  onSuccess={(response: IKUploadResponse) =>
                    field.onChange(response)
                  }
                />
              </FormControl>
              <FormDescription>Upload your image</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Price Field */}
        <FormField
          control={form.control}
          name={`variants.${index}.price`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold text-lg">{`${variant} Price`}</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter product price"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Enter the price of your {variant} variant.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Product Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold text-lg">Product Name*</FormLabel>
              <FormControl>
                <Input placeholder="Enter product name" {...field} />
              </FormControl>
              <FormDescription>Enter the name of your product.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Product Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold text-lg">
                Product Description*
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter product description"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Ensure the description is detailed and relevant.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {form.watch("variants").map((_, index) => (
          <div key={index}>{renderFileUpload(index)}</div>
        ))}

        {/* License Selection */}
        <FormField
          control={form.control}
          name="license"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold text-lg">
                Select License*
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a license type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {LICENSE_OPTIONS.map((license) => (
                    <SelectItem key={license} value={license}>
                      {license}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Choose the license for this product.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button
          type="submit"
          className={`w-full ${
            isPending && "bg-slate-600 pointer-events-none"
          }`}
          disabled={isPending}
        >
          {isPending ? (
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="animate-spin" /> Listing
            </div>
          ) : (
            <>List</>
          )}
        </Button>
      </form>
    </Form>
  );
}

export default MultipleProductsForm;
