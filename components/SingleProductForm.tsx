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

const singleProductFormSchema = z.object({
  name: z
    .string({
      required_error: "Name is required.",
      invalid_type_error: "Name must be a string.",
    })
    .min(2, {
      message: "Name should contain minimum 2 characters.",
    }),
  description: z
    .string({
      required_error: "Description is required.",
      invalid_type_error: "Description must be a string.",
    })
    .min(30, {
      message: "Description should contain minimum 30 characters.",
    }),
  variant: z.enum(["SQUARE", "WIDE", "PORTRAIT"]),
  price: z.coerce
    .number({
      required_error: "Price is required",
      invalid_type_error: "Price must be a number",
    })
    .int()
    .positive(),
  license: z.enum(["personal", "commercial"]),
  image: z.custom<IKUploadResponse | null>(),
});

type SingleProductFormSchema = z.infer<typeof singleProductFormSchema>;

function SingleProductForm() {
  const router = useRouter();
  const [isPending, setIsPending] = useState<boolean>(false);

  const form = useForm<SingleProductFormSchema>({
    resolver: zodResolver(singleProductFormSchema),
    defaultValues: {
      name: "",
      description: "",
      variant: "SQUARE",
      price: 0,
      image: null,
      license: "commercial",
    },
  });

  function onSubmit(values: SingleProductFormSchema) {
    if (values.image === null) {
      toast.error("Kindly upload an image.");
      return;
    }

    const productData = {
      name: values.name,
      description: values.description,
      variants: [
        {
          type: values.variant,
          price: values.price,
          license: values.license,
          imageUrl: values?.image?.url,
          downloadUrl: values?.image?.url,
          previewUrl: values?.image?.thumbnailUrl,
          fileId: values?.image?.fileId,
          dimensions: {
            width: values?.image?.width,
            height: values?.image?.height,
          },
        },
      ],
    };

    setIsPending(true);

    fetch("/api/products/list", {
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
      })
      .catch(() => toast.error("Could not list your product..."))
      .finally(() => setIsPending(false));
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold text-lg">
                {" "}
                Product Name*
              </FormLabel>
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
                Make sure the description is relevant and good.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="variant"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold text-lg">
                Select Variant*
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
              <FormLabel className="font-bold text-lg">Price*</FormLabel>
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
                Select License*
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

        <Controller
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold text-lg">
                Upload Product Image*
              </FormLabel>

              <FormControl>
                <FileUpload
                  onSuccess={(response: IKUploadResponse) => {
                    field.onChange(response);
                  }}
                  {...field}
                />
              </FormControl>

              <FormDescription>Upload your image</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

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
export default SingleProductForm;
