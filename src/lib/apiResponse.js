import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

class ApiResponse {
  constructor() {
    this.token = null;
    this.tokenExpire=null;
  }

  createJwtToken({id,username}) {
    try {
      const tokenExp=Math.floor(Date.now() / 1000) + (60 * 60 * 24)
      this.token = jwt.sign({ id, username , exp:tokenExp},

      
      process.env.JWT_PRIVATE_KEY);
      this.tokenExpire=tokenExp*1000;
    } catch (error) {
      console.error("Error creating JWT:", error);
    }
    return this;
  }

  setCookie(response) {
    if (this.token) {
      const maxAge=this.tokenExpire-Date.now();
      response.cookies.set("token", this.token, {
        secure: true,        
        httpOnly: true,    
        path: '/',           
        sameSite: "None",    
        maxAge: maxAge, 
      });
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
      this.setCookie(response);
    }

    return response;
  }
}

export default ApiResponse;
