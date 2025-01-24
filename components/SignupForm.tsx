"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Aperture, Loader2 } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "./ui/input";
import { useState } from "react";

const signupFormSchema = z
  .object({
    email: z.string().email("Please enter a valid email address."),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long.")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
      .regex(/[0-9]/, "Password must contain at least one number.")
      .regex(
        /[^a-zA-Z0-9]/,
        "Password must contain at least one special character."
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match.",
    path: ["confirmPassword"],
  });

type SignupFormSchemaType = z.infer<typeof signupFormSchema>;

function SignupForm() {
  const form = useForm<SignupFormSchemaType>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
  const [isPending, setIsPending] = useState<boolean>(false);

  const router = useRouter();

  const onSubmit = (value: SignupFormSchemaType) => {
    setIsPending(true);
    fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: value.email, password: value.password }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          toast.success(data.message);
          router.push("/login");
        } else {
          toast.error(data.message);
        }
      })
      .catch(() => toast.error("An error occurred. Please try again later."))
      .finally(() => setIsPending(false));
  };

  return (
    <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg space-y-6">
      <div className="flex flex-col items-center space-y-2">
        <Aperture size={50} className="text-gray-700" />
        <h1 className="text-2xl font-bold text-gray-800">Create an Account</h1>
        <p className="text-sm text-gray-600">
          Join ChitraSetu and explore a world of creativity.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold text-gray-800">
                  Email*
                </FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    {...field}
                    className="rounded-lg border-gray-300 focus:ring-2 focus:ring-gray-500"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold text-gray-800">
                  Password*
                </FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    {...field}
                    className="rounded-lg border-gray-300 focus:ring-2 focus:ring-gray-500"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold text-gray-800">
                  Confirm Password*
                </FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Confirm your password"
                    {...field}
                    className="rounded-lg border-gray-300 focus:ring-2 focus:ring-gray-500"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            variant={"default"}
            type="submit"
            className="w-full"
            disabled={isPending}
          >
            {isPending ? (
              <div className="flex flex-row items-center justify-center gap-2">
                <Loader2 className="animate-spin" />
                Creating account
              </div>
            ) : (
              "Create Account"
            )}
          </Button>
        </form>
      </Form>

      <p className="text-center text-sm text-gray-600">
        Already have an account?{" "}
        <Link href="/login" className="font-bold text-gray-800 hover:underline">
          Log in here
        </Link>
      </p>
    </div>
  );
}
export default SignupForm;
