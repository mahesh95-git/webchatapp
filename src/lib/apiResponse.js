import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

class ApiResponse {
  constructor() {
    this.token = null;
  }

  createJwtToken(value) {
    try {
      console.log(process.env.JWT_PRIVATE_KEY)
      this.token = jwt.sign({ id: value }, process.env.JWT_PRIVATE_KEY, {
        
        expiresIn: "5d",
      });
    } catch (error) {
      console.error("Error creating JWT:", error);
    }
    return this;
  }

  setCookie(response) {
    if (this.token) {
      response.cookies.set("token", this.token, {
        secure: true,
        httpOnly: true,
        path: '/',
      });
    } else {
      console.error("No token available to set in cookie.");
    }
  }

  sendResponse({ success, message, data, statusCode = 200, error }) {
    const response = NextResponse.json(
      {
        success,
        message,
        ...(data && { data }),
        ...(error && { error }),
      },
      {
        status: statusCode,
      }
    );

    if (this.token) {
      console.log(this.token)
      this.setCookie(response);
    }

    return response;
  }
}

export default ApiResponse;
