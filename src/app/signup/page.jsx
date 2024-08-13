"use client";
import React, { useEffect, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import signupSchema from "@/zodSchema/signup.Schema";
import { LoaderCircle } from "lucide-react";
function Page() {
  const { toast, toasts } = useToast();

  const [isLoading, setIsLoading] = useState(false);

  const [isAvailable, setIsAvailable] = useState(true);
  const [isLoading2, setIsLoading2] = useState(false);
  const form = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
  const username = form.watch("username");

  useEffect(() => {
    let interval;
    if (username) {
      setIsLoading2(true);
      interval = setTimeout(async () => {
        try {
          const response = await axios.post(
            `http://localhost:3000/api/auth/verifyusername/${username}`
          );
          console.log(response);
          if (response.data?.success) {
            setIsAvailable(true);
          }
        } catch (error) {
          console.log(error);
          setIsAvailable(false);
          toast({
            title: "Error",
            description: error.response.data.message,
            variant: "destructive",
          });
        } finally {
          setIsLoading2(false);
        }
      }, 5000);
    }

    return () => {
      clearInterval(interval);
    };
  }, [username]);

  async function onSubmit(values) {
    try {
      console.log(values)
      setIsLoading(true);
      const response = await axios.post(
        "http://localhost:3000/api/auth/singup",
        values
      );
      if (response.data?.success) {
        toast({
          title: response.data?.message,
          variant: "success",
        });
        form.reset();
      }
    } catch (error) {
      toast({
        title: error.response.data?.message,
        variant: "destructive",
      });
      setIsLoading(false);
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <div className="bg-[#f9fafc] w-full min-h-screen flex items-center justify-center ">
      <div className="w-1/4 bg-gray-800 py-10 px-5 rounded-md">
        <h1 className="text-3xl font-bold tracking-tight text-white my-5 text-center">
          Signup
        </h1>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8"
            method="POST"
          >
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="username"
                      {...field}
                      
                    />
                  </FormControl>
                  {isLoading2 ? (
                    <span className="text-white">
                      <LoaderCircle className="animate-spin mt-1" />
                    </span>
                  ) : (
                    !isAvailable && (
                      <p className="text-red-500 text-sm">
                        {username} is not available
                      </p>
                    )
                  )}

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Email</FormLabel>
                  <FormControl>
                    <Input placeholder="email" {...field} />
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
                  <FormLabel className="text-white">Password</FormLabel>
                  <FormControl>
                    <Input placeholder="password" {...field} />
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
                  <FormLabel className="text-white">Confirm Password</FormLabel>
                  <FormControl>
                    <Input placeholder="password" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className={`w-1/2 bg-[#f9fafc] text-black ${
                isLoading ? "cursor-not-allowed" : "hover:text-white"
              }`}
              disabled={isLoading ? true : false}
            >
              {isLoading ? (
                <span className="flex justify-around items-center w-full">
                  <LoaderCircle className="animate-spin" /> Processing...
                </span>
              ) : (
                "Signup"
              )}
            </Button>
          </form>
        </Form>
        <div>
          <p className="text-center text-white">or</p>
          <p className="text-center text-white">
            Do you have an account?{" "}
            <Link href="/signin" className="text-blue-200">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Page;
