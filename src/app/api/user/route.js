import { NextRequest, NextResponse } from "next/server";
export async function GET(res) {
  return NextResponse.json(
    {
      name: "mahesh",
    },
    {
      status: 201,
    }
  );
}
