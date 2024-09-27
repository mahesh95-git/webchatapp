"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "@/components/ui/use-toast";

function Page({ params }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const token = params.token;

  useEffect(() => {
    let isMounted = true; // To avoid state updates if the component is unmounted during the async call

    (async () => {
      try {
        const response = await axios.post(
          `/api/auth/verifyEmail/${token}`
        );
        if (response.data?.success) {
          if (isMounted) {
            toast({
              title: response.data?.message,
              description: "Your email has been successfully verified.",
              className: "bg-green-500 text-white",
            });
            router.push("/home/allchats");
          }
        }
      } catch (error) {
        if (isMounted) {
          setError(true);
          toast({
            title: "Error",
            description:
              error?.response?.data?.message || "An unexpected error occurred.",
            className: "bg-red-500 text-white",
          });
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    })();

    return () => {
      isMounted = false; // Cleanup function to avoid memory leaks
    };
  }, [token, router]);

  return (
    <div
      className={`w-full min-h-screen flex items-center justify-center text-4xl font-bold ${
        error ? "text-red-500" : ""
      }`}
    >
      {error
        ? "Something went wrong, please try again."
        : loading
        ? "Verifying..."
        : null}
    </div>
  );
}

export default Page;
