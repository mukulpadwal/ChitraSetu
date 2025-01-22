"use client";

import Loader from "@/components/Loader";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import FileUpload from "@/components/FileUpload";
import { IKUploadResponse } from "imagekitio-next/dist/types/components/IKUpload/props";
import { IKImage } from "imagekitio-next";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

const editFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name should contain at least 2 characters." }),
  description: z
    .string()
    .min(30, { message: "Description should contain at least 30 characters." }),
  variants: z.array(
    z.object({
      _id: z.string(),
      type: z.enum(["SQUARE", "WIDE", "PORTRAIT"]),
      price: z.coerce.number().min(0, { message: "Price must be positive." }),
      image: z.custom<IKUploadResponse | null>(),
      previewUrl: z.string().url(),
    })
  ),
  license: z.enum(["personal", "commercial"]),
});

type EditFormSchemaType = z.infer<typeof editFormSchema>;

function ProductEditPage() {
  const { status } = useSession();
  const { id }: { id: string } = useParams();
  const router = useRouter();
  const [isPending, setIsPending] = useState<boolean>(false);

  const form = useForm<EditFormSchemaType>({
    resolver: zodResolver(editFormSchema),
    defaultValues: {
      name: "",
      description: "",
      variants: [],
      license: "personal",
    },
  });

  const { fields } = useFieldArray({
    control: form.control,
    name: "variants",
  });

  const onSubmit = async (values: EditFormSchemaType) => {
    setIsPending(true);
    const variantsData = values.variants
      .map((variant) => {
        if (variant.image) {
          return {
            _id: variant._id,
            type: variant.type,
            price: variant.price,
            imageUrl: variant?.image?.url,
            downloadUrl: variant?.image?.url,
            previewUrl: variant?.image?.thumbnailUrl,
            fileId: variant?.image?.fileId,
            dimensions: {
              width: variant?.image?.width,
              height: variant?.image?.height,
            },
          };
        }

        return null;
      })
      .filter((variant) => variant !== null);

    const productData = {
      name: values.name,
      description: values.description,
      variants: variantsData,
      license: values.license,
    };

    fetch(`/api/products/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          toast.success(data.message);
          router.replace(`/products/${id}`);
        } else {
          toast.error(data.message);
        }
      })
      .catch(() => toast.error("Failed to update product details."))
      .finally(() => setIsPending(false));
  };

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          toast.success("Product data fetched successfully.");
          form.setValue("name", data.data.name);
          form.setValue("description", data.data.description);
          form.setValue("variants", data.data.variants || []);
          form.setValue("license", data.data.license || "");
        } else {
          toast.error(data.message);
        }
      })
      .catch(() => toast.error("Failed to fetch product details."))
      .finally(() => {});
  }, [id, form]);

  return (
    <div className="max-w-7xl mx-auto p-4">
      {status === "loading" ? (
        <Loader />
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold text-lg">
                    Product Name*
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter product name" {...field} />
                  </FormControl>
                  <FormDescription>
                    Enter the name of your product.
                  </FormDescription>
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
                    Provide a detailed description of your product.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {fields.map((field, index) => (
              <div
                key={field.id}
                className="w-full space-y-4 border p-4 rounded-md"
              >
                <FormField
                  control={form.control}
                  name={`variants.${index}.type`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold text-lg">
                        Variant Type*
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Choose a variant type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {["SQUARE", "WIDE", "PORTRAIT"].map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Select the variant type.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`variants.${index}.price`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold text-lg">
                        Price*
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter price"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Set the price for this variant.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="w-full flex flex-col sm:flex-row justify-between items-center gap-2">
                  <Controller
                    control={form.control}
                    name={`variants.${index}.image`}
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className="font-bold text-lg">
                          Upload New Image*
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

                  <Label className="font-bold text-lg text-center">
                    Current Image
                    <IKImage
                      src={field?.previewUrl}
                      height={150}
                      width={150}
                      alt="Product Image"
                    />
                  </Label>
                </div>
              </div>
            ))}

            <FormField
              control={form.control}
              name="license"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold text-lg">
                    Select License*
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
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

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="animate-spin" />
                  Updating...
                </div>
              ) : (
                "Update Product"
              )}
            </Button>
          </form>
        </Form>
      )}
    </div>
  );
}

export default ProductEditPage;
