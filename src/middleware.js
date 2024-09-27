"use server";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const pathname = req.nextUrl.pathname;
  const token = req.cookies.get("token");

  if (!token && pathname.startsWith("/home")) {
    return NextResponse.redirect(new URL("/", req.url));
  }
  if (token && ["/signin", "/signup", "/forgotpassword","/"].includes(pathname)) {
    return NextResponse.redirect(new URL("/home/allchats", req.url));
  }

 

  if (!token && pathname.startsWith("/api/user")) {
    return NextResponse.json(
      {
        success: false,
        message: "Unauthorized user",
      },
      { status: 401 }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/:path*",
};
