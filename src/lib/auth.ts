export async function hashPassword(password: string): Promise<string> {
  const data = new TextEncoder().encode(password + "_arlo_wood_salt_2026");
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function verifyPassword(
  password: string,
  stored: string
): Promise<boolean> {
  return (await hashPassword(password)) === stored;
}
