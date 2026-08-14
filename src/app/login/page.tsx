"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { TreePine, LogIn, UserPlus } from "lucide-react";

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
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // ===== الدخول كأدمن =====
    if (password === ADMIN_SECRET) {
      localStorage.setItem("arlo-user", JSON.stringify({
        email: email || "admin@arlo-wood.com",
        name: "Admin",
        isAdmin: true,
      }));
      setSuccess("تم الدخول كأدمن بنجاح ✓");
      setTimeout(() => router.push("/admin"), 800);
      return;
    }

    if (mode === "register") {
      if (!name.trim() || !email.trim() || password.length < 6) {
        setError("املأ الاسم والإيميل وكلمة السر (6 أحرف على الأقل)");
        return;
      }
      const users = JSON.parse(localStorage.getItem("arlo-users") || "[]");
      if (users.find((u: any) => u.email === email)) {
        setError("هذا الإيميل مسجل مسبقاً");
        return;
      }
      const newUser = {
        id: Date.now().toString(),
        name,
        email,
        password,
        phone: phone || "",
        address: address || "",
        city: city || "",
        createdAt: new Date().toISOString(),
      };
      users.push(newUser);
      localStorage.setItem("arlo-users", JSON.stringify(users));
      localStorage.setItem("arlo-user", JSON.stringify({ ...newUser, isAdmin: false }));
      setSuccess("تم إنشاء الحساب بنجاح ✓");
      setTimeout(() => router.push("/"), 1000);
    } else {
      const users = JSON.parse(localStorage.getItem("arlo-users") || "[]");
      const user = users.find((u: any) => u.email === email && u.password === password);
      if (!user) {
        setError("الإيميل أو كلمة السر غير صحيحة");
        return;
      }
      localStorage.setItem("arlo-user", JSON.stringify({ ...user, isAdmin: false }));
      setSuccess("تم تسجيل الدخول بنجاح ✓");
      setTimeout(() => router.push("/"), 800);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-[#e8d5b7]/40 p-8">
        <div className="text-center mb-8">
          <TreePine className="w-12 h-12 text-[#c4a574] mx-auto mb-3" />
          <h1 className="text-2xl font-bold text-[#3d2b1f]">
            {mode === "login" ? "تسجيل الدخول" : "إنشاء حساب جديد"}
          </h1>
        </div>

        <div className="flex mb-6 bg-[#f5e6d3] rounded-xl p-1">
          <button
            onClick={() => { setMode("login"); setError(""); }}
            className={`flex-1 py-2.5 rounded-lg font-medium transition ${
              mode === "login" ? "bg-[#3d2b1f] text-white" : "text-[#5a4030]"
            }`}
          >
            دخول
          </button>
          <button
            onClick={() => { setMode("register"); setError(""); }}
            className={`flex-1 py-2.5 rounded-lg font-medium transition ${
              mode === "register" ? "bg-[#3d2b1f] text-white" : "text-[#5a4030]"
            }`}
          >
            إنشاء حساب
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "register" && (
            <>
              <div>
                <label className="block text-sm font-medium mb-1">الاسم *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#e8d5b7] focus:outline-none focus:ring-2 focus:ring-[#c4a574]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">رقم الهاتف</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#e8d5b7] focus:outline-none focus:ring-2 focus:ring-[#c4a574]"
                  placeholder="01xxxxxxxxx"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">العنوان</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#e8d5b7] focus:outline-none focus:ring-2 focus:ring-[#c4a574]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">المدينة</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#e8d5b7] focus:outline-none focus:ring-2 focus:ring-[#c4a574]"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">الإيميل *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[#e8d5b7] focus:outline-none focus:ring-2 focus:ring-[#c4a574]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">كلمة السر *</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[#e8d5b7] focus:outline-none focus:ring-2 focus:ring-[#c4a574]"
              required
            />
          </div>

          {error && <p className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">{error}</p>}
          {success && <p className="text-green-700 text-sm bg-green-50 p-3 rounded-lg">{success}</p>}

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-[#3d2b1f] text-[#f5e6d3] font-bold py-3.5 rounded-xl hover:bg-[#5a4030] transition"
          >
            {mode === "login" ? (
              <><LogIn className="w-5 h-5" /> تسجيل الدخول</>
            ) : (
              <><UserPlus className="w-5 h-5" /> إنشاء الحساب</>
            )}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          <Link href="/" className="text-[#c4a574] hover:underline">العودة للمتجر</Link>
        </p>
      </div>
    </div>
  );
}
