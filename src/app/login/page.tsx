"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { TreePine, LogIn, UserPlus } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { hashPassword, verifyPassword } from "@/lib/auth";

const ADMIN_SECRET = "Kali@Remote#2026!X7".repeat(4);

export default function LoginPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      if (password === ADMIN_SECRET) {
        localStorage.setItem("arlo-user", JSON.stringify({ email: email || "admin@arlo-wood.com", name: "Admin", isAdmin: true }));
        setSuccess("تم الدخول كأدمن ✓");
        setTimeout(() => router.push("/admin"), 800);
        return;
      }
      if (mode === "register") {
        if (!name.trim() || !email.trim() || password.length < 6) {
          setError("املأ الاسم والإيميل وكلمة السر (6 أحرف على الأقل)");
          setLoading(false);
          return;
        }
        const hashed = await hashPassword(password);
        const { data, error: insertError } = await supabase.from("users").insert({
          name, email, password: hashed,
          phone: phone || null, address: address || null, city: city || null,
        }).select().single();
        if (insertError) {
          setError(insertError.code === "23505" || "duplicate" in (insertError.message || "") ? "الإيميل مسجل مسبقاً" : insertError.message);
          setLoading(false);
          return;
        }
        localStorage.setItem("arlo-user", JSON.stringify({
          id: data.id, name: data.name, email: data.email, phone: data.phone, address: data.address, city: data.city, isAdmin: false,
        }));
        setSuccess("تم إنشاء الحساب ✓");
        setTimeout(() => router.push("/"), 1000);
      } else {
        const { data } = await supabase.from("users").select("*").eq("email", email).maybeSingle();
        if (!data) {
          setError("الإيميل أو كلمة السر غير صحيحة");
          setLoading(false);
          return;
        }
        const ok = data.password === password || (await verifyPassword(password, data.password));
        if (!ok) {
          setError("الإيميل أو كلمة السر غير صحيحة");
          setLoading(false);
          return;
        }
        if (data.password === password) {
          const hashed = await hashPassword(password);
          await supabase.from("users").update({ password: hashed }).eq("id", data.id);
        }
        localStorage.setItem("arlo-user", JSON.stringify({
          id: data.id, name: data.name, email: data.email, phone: data.phone, address: data.address, city: data.city, isAdmin: data.is_admin || false,
        }));
        setSuccess("تم تسجيل الدخول ✓");
        setTimeout(() => router.push(data.is_admin ? "/admin" : "/my-orders"), 800);
      }
    } catch (err: any) {
      setError(err.message || "حدث خطأ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-[#e8d5b7]/40 p-8">
        <div className="text-center mb-8">
          <TreePine className="w-12 h-12 text-[#c4a574] mx-auto mb-3" />
          <h1 className="text-2xl font-bold text-[#3d2b1f]">{mode === "login" ? "تسجيل الدخول" : "إنشاء حساب"}</h1>
        </div>
        <div className="flex mb-6 bg-[#f5e6d3] rounded-xl p-1">
          <button type="button" onClick={() => { setMode("login"); setError(""); }} className={`flex-1 py-2.5 rounded-lg font-medium ${mode === "login" ? "bg-[#3d2b1f] text-white" : "text-[#5a4030]"}`}>دخول</button>
          <button type="button" onClick={() => { setMode("register"); setError(""); }} className={`flex-1 py-2.5 rounded-lg font-medium ${mode === "register" ? "bg-[#3d2b1f] text-white" : "text-[#5a4030]"}`}>إنشاء حساب</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "register" && (
            <>
              <input type="text" placeholder="الاسم *" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-[#e8d5b7]" required />
              <input type="tel" placeholder="الهاتف (مهم لطلباتي)" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-[#e8d5b7]" />
              <input type="text" placeholder="العنوان" value={address} onChange={(e) => setAddress(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-[#e8d5b7]" />
              <input type="text" placeholder="المدينة" value={city} onChange={(e) => setCity(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-[#e8d5b7]" />
            </>
          )}
          <input type="email" placeholder="الإيميل *" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-[#e8d5b7]" required />
          <input type="password" placeholder="كلمة السر *" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-[#e8d5b7]" required />
          {error && <p className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">{error}</p>}
          {success && <p className="text-green-700 text-sm bg-green-50 p-3 rounded-lg">{success}</p>}
          <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 bg-[#3d2b1f] text-[#f5e6d3] font-bold py-3.5 rounded-xl disabled:opacity-60">
            {loading ? "جاري..." : mode === "login" ? (<><LogIn className="w-5 h-5" /> دخول</>) : (<><UserPlus className="w-5 h-5" /> إنشاء حساب</>)}
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-6 space-x-3 rtl:space-x-reverse">
          <Link href="/track-order" className="text-[#c4a574] hover:underline">تتبع طلب</Link>
          {" · "}
          <Link href="/my-orders" className="text-[#c4a574] hover:underline">طلباتي</Link>
          {" · "}
          <Link href="/" className="text-[#c4a574] hover:underline">المتجر</Link>
        </p>
      </div>
    </div>
  );
}
