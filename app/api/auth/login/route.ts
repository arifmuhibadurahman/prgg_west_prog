import { NextResponse } from "next/server";

const ADMIN_USER = "admin";
const ADMIN_PASS = "123";

export async function POST(req: Request) {
  const { username, password } = await req.json();

  if (username === ADMIN_USER && password === ADMIN_PASS) {

    const res = NextResponse.json({ success: true });

    // Set cookie dengan NextResponse (versi Next.js 15)
    res.cookies.set("session", "authenticated", {
      httpOnly: true,
      path: "/",
    });

    return res;
  }

  return NextResponse.json(
    { message: "Username atau password salah" },
    { status: 401 }
  );
}
