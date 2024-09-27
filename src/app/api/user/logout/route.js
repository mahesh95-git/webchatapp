import { authMiddleware } from "@/lib/authMiddleware";
import { NextResponse } from "next/server";

export async function GET(req) {

  return authMiddleware((req) => {
    const response = NextResponse.json(
      {
        success: true,
        message: "Logout successful",
      },
      {
        status: 200,
      }
    );

    response.cookies.delete("token");

    return response;
  }, req);
}
