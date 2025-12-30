"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { z } from "zod";
import { Eye, EyeOff, ArrowLeft, Loader } from "lucide-react";
import { auth } from "../../../../public/assets/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import MyImage from "../MyImage";

const emailSchema = z.object({
  email: z.string().email("Invalid email address"),
});

// ✅ merged schema for verification + password reset
const verifyAndResetSchema = z
  .object({
    verificationCode: z
      .string()
      .min(6, "Verification code must be at least 6 characters."),
    password: z.string().min(8, "Password must be at least 8 characters."),
    confirmPassword: z
      .string()
      .min(8, "Confirm Password must be at least 8 characters."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function ForgetPassword() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const router = useRouter();

  const emailForm = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: "" },
  });

  const verifyResetForm = useForm<z.infer<typeof verifyAndResetSchema>>({
    resolver: zodResolver(verifyAndResetSchema),
    defaultValues: { verificationCode: "", password: "", confirmPassword: "" },
  });

  // ✅ Step 1: Send reset code
  async function handleEmailSubmit(values: z.infer<typeof emailSchema>) {
    setLoading(true);
    try {
      const res = await fetch("/api/model/auth/forget-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: values.email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send reset email");

      setEmail(values.email);
      toast.success("Email sent", { description: data.message });
      setStep(2);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  // ✅ Step 2 (combined): Verify code + reset password
  async function handleVerifyAndResetSubmit(
    values: z.infer<typeof verifyAndResetSchema>
  ) {
    setLoading(true);
    try {
      const res = await fetch("/api/model/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          token: values.verificationCode,
          password: values.password,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      toast.success("Password reset successful", {
        description: "You can now log in with your new password.",
      });
      router.push("/");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col p-0 m-0 lg:flex-row min-h-screen bg-default text-white">
      <div className="lg:w-1/2 bg-default p-8 flex items-center justify-center">
        <div className="relative w-full max-w-md">
          <MyImage
            src={auth.src}
            alt="forget password"
            width={1000}
            height={1000}
            className="object-contain"
          />
        </div>
      </div>

      <div className="lg:w-1/2 bg-blackfade p-8 flex flex-col justify-center overflow-y-auto">
        <div className="max-w-md mx-auto w-full">
          {/* Header */}
          <div className="flex justify-between items-center text-xs xl:text-sm mb-8">
            <Link href="/">
              <ArrowLeft className="rounded-full bg-default text-whitefade w-10 h-10 p-2" />
            </Link>
            <p>
              Already have an account?{" "}
              <Link href="/signin" className="text-default hover:text-default">
                Sign In
              </Link>
            </p>
          </div>

          <h1 className="text-xl xl:text-3xl font-bold mb-2">
            Forget Password
          </h1>
          <p className="text-xs xl:text-sm text-gray-400 mb-8">
            {step === 1
              ? "Enter your email to receive a verification code."
              : "Enter the verification code and your new password."}
          </p>

          {/* Step 1: Send reset code */}
          {step === 1 && (
            <Form {...emailForm}>
              <form
                onSubmit={emailForm.handleSubmit(handleEmailSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={emailForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="carla@gmail.com"
                          className="bg-blackfade2 text-white"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-default text-white"
                >
                  {loading ? (
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    "Send Verification Code"
                  )}
                </Button>
              </form>
            </Form>
          )}

          {/* Step 2: Verify code + reset password */}
          {step === 2 && (
            <Form {...verifyResetForm}>
              <form
                onSubmit={verifyResetForm.handleSubmit(handleVerifyAndResetSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={verifyResetForm.control}
                  name="verificationCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Verification Code</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter verification code"
                          className="bg-blackfade2 text-white"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={verifyResetForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <Input
                          type={showPassword ? "text" : "password"}
                          {...field}
                          className="bg-blackfade2 text-white"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={verifyResetForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm New Password</FormLabel>
                      <FormControl>
                        <Input
                          type={showPassword ? "text" : "password"}
                          {...field}
                          className="bg-blackfade2 text-white"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-default text-white"
                >
                  {loading ? (
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    "Reset Password"
                  )}
                </Button>
              </form>
            </Form>
          )}
        </div>
      </div>
    </div>
  );
}
