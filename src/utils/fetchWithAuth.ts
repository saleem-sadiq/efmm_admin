import { cookies as nextCookies } from "next/headers"; // Server-side cookies

export async function fetchWithAuth(
  url: string,
  options: RequestInit = {},
  token?: string
) {
  let role: string | undefined;

  if (typeof window !== "undefined") {
    // ✅ Client-side: read cookies from document.cookie
    if (!token) {
      token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];
    }

    role = document.cookie
      .split("; ")
      .find((row) => row.startsWith("role="))
      ?.split("=")[1];
  } else {
    // ✅ Server-side: use Next.js cookies() correctly
    const cookieStore = await nextCookies(); // 🟢 FIXED — must CALL the function

    if (!token) {
      token = cookieStore.get("token")?.value;
    }
    role = cookieStore.get("role")?.value;
  }

  // ✅ Build headers properly as a plain record
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  if (role) {
    headers.Cookie = `role=${role}`;
  }

  // ✅ Final fetch call
  const response = await fetch(url, {
    ...options,
    headers,
  });

  return response;
}
