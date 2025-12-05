import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const ADMIN_USER = "admin";
const ADMIN_PASS = "123";

export async function POST(req: Request) {
  const { username, password } = await req.json();

  if (username === ADMIN_USER && password === ADMIN_PASS) {
    const cookieStore = cookies();

    cookieStore.set({
      name: "session",
      value: "authenticated",
      httpOnly: true,
      path: "/",
    });

    return NextResponse.json({ success: true });
  }

  return NextResponse.json(
    { message: "Username atau password salah" },
    { status: 401 }
  );
}
