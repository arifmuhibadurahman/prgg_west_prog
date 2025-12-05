import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Kunjungan from "../model";

export async function PUT(req: Request, { params }: any) {
  const cookie = req.headers.get("cookie") || "";

  // cek login admin
  if (!cookie.includes("session=authenticated"))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();

  const body = await req.json();
  const updated = await Kunjungan.findByIdAndUpdate(params.id, body, {
    new: true,
  });

  return NextResponse.json(updated);
}

export async function DELETE(req: Request, { params }: any) {
  const cookie = req.headers.get("cookie") || "";

  if (!cookie.includes("session=authenticated"))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();

  await Kunjungan.findByIdAndDelete(params.id);

  return NextResponse.json({ success: true });
}
