import { v2 as cloudinary } from "cloudinary"
import { NextResponse } from "next/server"

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})
console.log("API_KEY:", process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY)


export async function POST(request: Request) {
    const body = await request.json();
    const { paramsToSign } = body;  // Parâmetros enviados pelo widget
    const signature = cloudinary.utils.api_sign_request(paramsToSign, process.env.CLOUDINARY_API_SECRET as string);
    return new Response(JSON.stringify({ signature, ...paramsToSign }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
