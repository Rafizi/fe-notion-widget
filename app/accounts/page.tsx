/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import {
  Edit2,
  Eye,
  EyeOff,
  ExternalLink,
  Crown,
  User as UserIcon,
  Trash2Icon,
  Loader2,
} from "lucide-react";

import { deleteWidget, getWidgetsByUser } from "../lib/widget.api";
import { getPaymentLink, checkPaymentStatus } from "../lib/payment.api"; // Import ini
import { toast, Toaster } from "sonner";

interface Widget {
  id: string;
  token: string;
  dbID: string;
  create_at: string;
  profileId: string;
  name: string;
  link: string;
}

type JwtPayload = {
  email?: string;
  sub?: string;
  iat?: number;
  exp?: number;
};

export default function AccountsPage() {
  const router = useRouter();

  const [user, setUser] = useState<{ email?: string; name?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false); // Buat loading overlay

  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [showTokens, setShowTokens] = useState<Record<string, boolean>>({});
  const [openDetails, setOpenDetails] = useState<Record<string, boolean>>({});
  
  const [isPro, setIsPro] = useState(false); // State PRO dinamis
  const FREE_WIDGET_LIMIT = 1;

  const isWidgetPaused = (index: number) => !isPro && index >= FREE_WIDGET_LIMIT;
  const disabledClass = "opacity-50 pointer-events-none select-none";

  // 1. Load User & Initial Status
  useEffect(() => {
    const token = cookies.get("login_token");
    if (!token) {
      router.replace("/auth/login");
      return;
    }

    try {
      const decoded = jwtDecode<any>(token);
      setUser({ email: decoded.email, name: decoded.name });
      
      // Cek status PRO pertama kali load
      fetchStatus();
    } catch (e) {
      router.replace("/auth/login");
    } finally {
      setLoading(false);
    }
  }, [router]);

  const fetchStatus = async () => {
    try {
      const res = await checkPaymentStatus();
      if (res.isPro) setIsPro(true);
    } catch (e) {
      console.error("Fetch status error");
    }
  };

  // 2. Load Widgets
  useEffect(() => {
    const loadWidgets = async () => {
      try {
        const jwt = cookies.get("login_token");
        if (!jwt) return;
        const res = await getWidgetsByUser(jwt);
        if (res?.success) setWidgets(res.data);
      } catch (e) {
        console.error("LOAD WIDGET ERROR:", e);
      }
    };
    loadWidgets();
  }, []);

  // 3. LOGIC UPGRADE & POLLING
  const handleUpgrade = async () => {
    try {
      setIsSyncing(true);
      
      // A. Ambil Link Mayar dari BE
      const res = await getPaymentLink();
      window.open(res.paymentLink, "_blank");

      toast.info("Selesaikan pembayaran di tab baru...", { duration: 6000 });

      // B. Polling Check Status (Tiap 5 detik)
      const interval = setInterval(async () => {
        try {
          const check = await checkPaymentStatus();
          
          if (check.isPro) {
            clearInterval(interval);
            setIsPro(true);
            setIsSyncing(false);
            toast.success("Pembayaran Berhasil! Anda kini PRO.");
            // Optional: Reload data widget jika perlu
          }
        } catch (err) {
          console.error("Polling error:", err);
        }
      }, 5000);

      // C. Timeout Polling (Misal stop setelah 10 menit jika ga bayar-bayar)
      setTimeout(() => {
        clearInterval(interval);
        setIsSyncing(false);
      }, 600000);

    } catch (error) {
      setIsSyncing(false);
      toast.error("Gagal membuat link pembayaran");
    }
  };

  const handleDeleteWidget = (widgetId: string) => {
    toast.warning("Hapus widget?", {
      description: "Widget yang dihapus tidak bisa dikembalikan.",
      action: {
        label: "Hapus",
        onClick: async () => {
          try {
            const res = await deleteWidget(widgetId);
            if (res?.success) {
              setWidgets((prev) => prev.filter((w) => w.id !== widgetId));
              toast.success("Widget berhasil dihapus");
            }
          } catch (err) {
            toast.error("Gagal menghapus widget");
          }
        },
      },
    });
  };

  const handleLogout = () => {
    cookies.remove("access_token");
    cookies.remove("login_token");
    router.replace("/auth/login");
  };

  if (loading) return <div className="p-10">Loading...</div>;

  return (
    <>
      <Navbar />
      <Toaster position="top-center" richColors />
      
      {/* OVERLAY LOADING SAAT POLLING */}
      {isSyncing && (
        <div className="fixed inset-0 z-[99] bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center">
          <Loader2 className="w-10 h-10 text-purple-600 animate-spin mb-4" />
          <h3 className="text-lg font-semibold">Menunggu Pembayaran...</h3>
          <p className="text-sm text-slate-500 text-center px-6">
            Jangan tutup halaman ini. <br/> Akun akan otomatis aktif setelah transaksi sukses di Notion.
          </p>
        </div>
      )}

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 overflow-x-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10">
          
          {/* TOP SUMMARY */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 rounded-3xl p-6 bg-white/70 backdrop-blur border shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white">
                  <UserIcon />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-slate-500">Signed in as</p>
                  <p className="font-medium text-slate-900">{user?.email}</p>
                </div>
                <span className={`px-4 py-1 rounded-full text-xs font-bold ${isPro ? "bg-green-100 text-green-700" : "bg-purple-100 text-purple-700"}`}>
                  {isPro ? "PRO PLAN" : "STARTER"}
                </span>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                {!isPro && (
                  <button
                    onClick={handleUpgrade}
                    className="flex items-center gap-2 text-sm font-semibold text-purple-600 bg-purple-50 px-4 py-2 rounded-xl hover:bg-purple-100 transition"
                  >
                    <Crown className="w-4 h-4" />
                    Upgrade to PRO
                  </button>
                )}
                <button onClick={handleLogout} className="text-sm text-red-500 hover:underline">
                  Logout
                </button>
              </div>
            </div>

            {/* STATS */}
            <div className="rounded-3xl p-6 bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-md">
              <p className="text-sm opacity-80">Your Stats</p>
              <div className="mt-6 space-y-3">
                <div>
                  <p className="text-3xl font-semibold">{widgets.length}</p>
                  <p className="text-xs opacity-80">Active Widgets</p>
                </div>
              </div>
            </div>
          </div>

          {/* WIDGET LIST */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-slate-900">Your Widgets</h2>
              {!isPro && widgets.length >= FREE_WIDGET_LIMIT && (
                <p className="text-xs text-orange-600 bg-orange-50 px-3 py-1 rounded-lg border border-orange-100">
                  Free Limit Reached (1 Widget). Upgrade to activate others.
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {widgets.map((widget, index) => {
                const paused = isWidgetPaused(index);
                return (
                  <div key={widget.id} className={`rounded-2xl border bg-white shadow-sm transition ${paused ? "opacity-70 grayscale-[0.5]" : "hover:shadow-md"}`}>
                    <div className="flex items-start justify-between p-5 gap-3">
                      <div>
                        <p className="text-sm font-medium text-slate-900">
                          {widget.name || `Widget #${widget.id.slice(0, 6)}`}
                        </p>
                        {paused ? (
                          <span className="inline-flex items-center gap-1 text-xs text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full mt-1">
                            ● Disabled (Upgrade Pro)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full mt-1">
                            ● Active
                          </span>
                        )}
                      </div>
                      <button onClick={() => handleDeleteWidget(widget.id)} className="p-2 rounded-lg hover:bg-red-50 transition group">
                        <Trash2Icon className="w-5 h-5 text-slate-400 group-hover:text-red-500" />
                      </button>
                    </div>

                    <div className="px-5 pb-4">
                      <div className={`flex items-center gap-2 bg-purple-50 border border-purple-200 rounded-xl px-3 py-2 ${paused ? disabledClass : ""}`}>
                        <p className="text-xs font-mono truncate flex-1 text-slate-700">{widget.link}</p>
                        <button
                          disabled={paused}
                          onClick={() => {
                            navigator.clipboard.writeText(widget.link);
                            toast.success("Link copied");
                          }}
                          className="text-xs bg-purple-600 text-white px-3 py-1.5 rounded-lg hover:bg-purple-700"
                        >
                          Copy
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}