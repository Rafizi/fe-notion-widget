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
  MoreVertical,
  ExternalLink,
  Crown,
  User as UserIcon,
  Trash2Icon,
} from "lucide-react";

import { deleteWidget, getWidgetsByUser } from "../lib/widget.api";
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

  const [user, setUser] = useState<{ email?: string } | null>(null);
  const [loading, setLoading] = useState(true);

  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [showTokens, setShowTokens] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const token = cookies.get("login_token");
    if (!token) {
      router.replace("/auth/login");
      return;
    }

    try {
      const decoded = jwtDecode<JwtPayload>(token);
      setUser({ email: decoded.email });
    } catch (e) {
      router.replace("/auth/login");
    } finally {
      setLoading(false);
    }
  }, [router]);
  useEffect(() => {
    const loadWidgets = async () => {
      try {
        const jwt = cookies.get("login_token");
        if (!jwt) return;

        const res = await getWidgetsByUser(jwt);
        if (res?.success) {
          setWidgets(res.data);
        }
      } catch (e) {
        console.error("LOAD WIDGET ERROR:", e);
      }
    };

    loadWidgets();
  }, []);

  const toggleTokenVisibility = (id: string) => {
    setShowTokens((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
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
              setWidgets((prev) =>
                prev.filter((widget) => widget.id !== widgetId)
              );

              toast.success("Widget berhasil dihapus");
            }
          } catch (err) {
            console.error("DELETE WIDGET ERROR:", err);
            toast.error("Gagal menghapus widget");
          }
        },
      },
      cancel: {
        label: "Batal",
        onClick: () => {},
      },
    });
  };

  const handleLogout = () => {
    toast.warning("Yakin logout?", {
      description: "Kamu perlu login lagi untuk mengakses dashboard.",
      action: {
        label: "Logout",
        onClick: () => {
          cookies.remove("access_token");
          cookies.remove("login_token");
          cookies.remove("login_email");

          toast.success("Berhasil logout 👋");

          setTimeout(() => {
            router.replace("/auth/login");
          }, 800);
        },
      },
      cancel: {
        label: "Batal",
        onClick: () => {},
      },
    });
  };

  if (loading) return <div className="p-10">Loading...</div>;

  return (
  <>
    <Navbar />

    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* HEADER */}
        <div className="mb-12">
          <h1 className="text-4xl font-semibold text-slate-900">
            Account
          </h1>
          <p className="text-slate-500 mt-2">
            Manage your profile and widgets in one place
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ================= LEFT ================= */}
          <div className="lg:col-span-1 space-y-6">
            {/* PROFILE */}
            <div className="bg-white rounded-2xl border shadow-sm p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white">
                  <UserIcon className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-medium">Personal Info</h2>
                  <p className="text-xs text-slate-500">
                    Account details
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-xs text-slate-500">Email</p>
                  <p className="text-sm text-slate-900">
                    {user?.email}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">Name</p>
                  <p className="text-sm text-slate-400">No name</p>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="px-3 py-1 text-xs rounded-full bg-purple-100 text-purple-700">
                    Basic Account
                  </span>

                  <button className="flex items-center gap-1 text-sm text-purple-600 hover:underline">
                    <Crown className="w-4 h-4" />
                    Upgrade
                  </button>
                </div>

                <button
                  onClick={handleLogout}
                  className="w-full mt-4 rounded-xl border border-red-200 text-red-600 py-2 text-sm hover:bg-red-50 transition"
                >
                  Logout
                </button>
              </div>
            </div>

            {/* STATS */}
            <div className="bg-white rounded-2xl border shadow-sm p-6">
              <p className="text-sm text-slate-500 mb-4">Quick Stats</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-2xl font-semibold text-purple-600">
                    {widgets.length}
                  </p>
                  <p className="text-xs text-slate-500">
                    Active Widgets
                  </p>
                </div>
                <div>
                  <p className="text-2xl font-semibold text-purple-600">
                    ∞
                  </p>
                  <p className="text-xs text-slate-500">
                    API Calls
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ================= RIGHT ================= */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-medium text-slate-900">
                Your Widgets
              </h2>
              <span className="text-sm bg-purple-100 text-purple-700 px-3 py-1 rounded-full">
                {widgets.length} Active
              </span>
            </div>

            <div className="space-y-5">
              {widgets.map((widget) => (
                <div
                  key={widget.id}
                  className="bg-white rounded-2xl border shadow-sm p-6 hover:shadow-md transition"
                >
                  {/* HEADER */}
                  <div className="flex items-start justify-between mb-5">
                    <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white flex items-center justify-center font-semibold">
                        {widget.name?.[0]?.toUpperCase() || "W"}
                      </div>

                      <div>
                        <h3 className="font-medium text-slate-900">
                          {widget.name || "My Widget"}
                        </h3>
                        <p className="text-xs text-slate-500">
                          ID: {widget.id}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Trash2Icon
                        className="w-4 h-4 text-slate-400 hover:text-red-500 cursor-pointer"
                        onClick={() =>
                          handleDeleteWidget(widget.id)
                        }
                      />
                      <MoreVertical className="w-4 h-4 text-slate-400" />
                    </div>
                  </div>

                  {/* TOKEN */}
                  <div className="mb-4">
                    <p className="text-xs text-slate-500 mb-1">
                      Integration Token
                    </p>
                    <div className="flex items-center gap-2 bg-slate-50 rounded-lg px-3 py-2">
                      <p className="font-mono text-xs truncate flex-1">
                        {showTokens[widget.id]
                          ? widget.token
                          : "••••••••••••••••••"}
                      </p>
                      <button
                        onClick={() =>
                          toggleTokenVisibility(widget.id)
                        }
                      >
                        {showTokens[widget.id] ? (
                          <EyeOff className="w-4 h-4 text-slate-500" />
                        ) : (
                          <Eye className="w-4 h-4 text-slate-500" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* DB */}
                  <div className="mb-4">
                    <p className="text-xs text-slate-500 mb-1">
                      Database ID
                    </p>
                    <p className="font-mono text-xs bg-slate-50 rounded-lg px-3 py-2 truncate">
                      {widget.dbID}
                    </p>
                  </div>

                  {/* LINK */}
                  <a
                    href={widget.link}
                    target="_blank"
                    className="inline-flex items-center gap-2 text-sm text-purple-600 hover:underline"
                  >
                    View Widget
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </>
);

}
