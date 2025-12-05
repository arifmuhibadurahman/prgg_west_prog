import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Kunjungan from "@/models/kunjungan";

export async function GET() {
  await connectDB();
  const data = await Kunjungan.find();
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  await connectDB();
  const body = await req.json();
  const tambah = await Kunjungan.create(body);
  return NextResponse.json(tambah);
}

export async function DELETE(req: Request) {
  await connectDB();
  const { id } = await req.json();
  await Kunjungan.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}

export async function PUT(req: Request) {
  await connectDB();
  const body = await req.json();
  const update = await Kunjungan.findByIdAndUpdate(body._id, body, { new: true });
  return NextResponse.json(update);
}
