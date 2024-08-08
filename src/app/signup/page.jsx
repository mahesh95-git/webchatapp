"use client";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import loginSchema from "@/zodSchema/login.Schema";
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
function Page() {
  const form = useForm({
    resolver:zodResolver(signupSchema),
    defaultValues:{
      name:"",
      email:"",
      password:"",
      confirmPassword:""

    }
  });
  function onSubmit(values) {
   
    console.log(values)
  }
  return (
    <div className="bg-[#f9fafc] w-full min-h-screen flex items-center justify-center ">
     <div className="w-1/4 bg-gray-800 py-10 px-5 rounded-md">
      <h1 
        className="text-3xl font-bold tracking-tight text-white my-5 text-center"
        
      >Signup</h1>
     <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8" method="POST">
        
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Email</FormLabel>
                <FormControl>
                  <Input placeholder="password" {...field} />
                  
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
          <Button type="submit" className="w-1/2 bg-[#f9fafc] text-black hover:text-white ">Submit</Button>
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
