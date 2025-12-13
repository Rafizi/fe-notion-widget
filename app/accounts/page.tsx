/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabaseClient";
import Navbar from "../components/Navbar";
import { Plus, Trash2 } from "lucide-react";

export default function AccountsPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // PROFILE DATA
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [highlights, setHighlights] = useState<any[]>([]);

  const router = useRouter();

  useEffect(() => {
    const loadUser = async () => {
      const { data } = await supabase.auth.getUser();

      if (!data.user) {
        router.replace("/login");
        return;
      }

      const userId = data.user.id;
      setUser(data.user);

      // LOAD PROFILE
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (!profile) {
        // auto create
        await supabase.from("profiles").insert({
          id: userId,
          name: "",
          username: "",
          bio: "",
          avatar_url: "",
          highlights: [],
        });

        setName("");
        setUsername("");
        setBio("");
        setAvatarUrl("");
        setHighlights([]);
      } else {
        setName(profile.name || "");
        setUsername(profile.username || "");
        setBio(profile.bio || "");
        setAvatarUrl(profile.avatar_url || "");
        setHighlights(profile.highlights || []);
      }

      setLoading(false);
    };

    loadUser();
  }, []);

  // SAVE PROFILE
  const handleSave = async () => {
    if (!user) return;

    setLoading(true);

    await supabase.from("profiles").upsert({
      id: user.id,
      name,
      username,
      bio,
      avatar_url: avatarUrl,
      highlights,
    });

    setLoading(false);
  };

  // HIGHLIGHT HANDLERS
  const addHighlight = () => {
    setHighlights([...highlights, { title: "", image: "" }]);
  };

  const updateHighlight = (index: number, field: string, value: string) => {
    const copy = [...highlights];
    copy[index][field] = value;
    setHighlights(copy);
  };

  const removeHighlight = (index: number) => {
    setHighlights(highlights.filter((_, i) => i !== index));
  };

  if (loading) return <div className="p-10">Loading...</div>;

  return (
  <>
    <Navbar />

    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-semibold mb-8">Account Details</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT COLUMN */}
        <div className="lg:col-span-1 space-y-6">
          {/* PERSONAL INFO */}
          <div className="bg-white border rounded-2xl p-6 shadow-sm">
            <h2 className="font-semibold mb-4">Personal Information</h2>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-500">Avatar URL</label>
                <input
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  className="mt-1 w-full px-4 py-2 border rounded-xl"
                />
              </div>

              {avatarUrl && (
                <img
                  src={avatarUrl}
                  className="w-16 h-16 rounded-full object-cover"
                />
              )}

              <div>
                <label className="text-sm text-gray-500">Name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 w-full px-4 py-2 border rounded-xl"
                />
              </div>

              <div>
                <label className="text-sm text-gray-500">Username</label>
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="@username"
                  className="mt-1 w-full px-4 py-2 border rounded-xl"
                />
              </div>

              <div>
                <label className="text-sm text-gray-500">Bio</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  className="mt-1 w-full px-4 py-2 border rounded-xl"
                />
              </div>
            </div>
          </div>

          {/* LICENSE */}
          <div className="bg-purple-50 border border-purple-100 rounded-2xl p-6">
            <h2 className="font-semibold mb-2">Your License</h2>
            <p className="text-sm text-gray-600">
              Basic License Key
            </p>
            <p className="mt-2 text-xs text-gray-500">
              Activated ✔
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-2 space-y-6">
          {/* HIGHLIGHTS */}
          <div className="bg-white border rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold">Highlights</h2>
              <button
                onClick={addHighlight}
                className="flex items-center gap-1 px-3 py-1.5 text-sm bg-purple-600 text-white rounded-lg"
              >
                <Plus size={16} /> Add
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {highlights.map((h, i) => (
                <div
                  key={i}
                  className="relative border rounded-xl p-4 bg-gray-50"
                >
                  <button
                    onClick={() => removeHighlight(i)}
                    className="absolute top-3 right-3 text-red-500"
                  >
                    <Trash2 size={16} />
                  </button>

                  <input
                    value={h.title}
                    onChange={(e) =>
                      updateHighlight(i, "title", e.target.value)
                    }
                    placeholder="Highlight title"
                    className="w-full mb-2 px-3 py-2 border rounded-lg"
                  />

                  <input
                    value={h.image}
                    onChange={(e) =>
                      updateHighlight(i, "image", e.target.value)
                    }
                    placeholder="Image URL"
                    className="w-full px-3 py-2 border rounded-lg"
                  />

                  {h.image && (
                    <img
                      src={h.image}
                      className="w-14 h-14 rounded-full object-cover mt-3"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* SAVE */}
          <button
            onClick={handleSave}
            className="w-full py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition"
          >
            Save Profile
          </button>
        </div>
      </div>
    </div>
  </>
);

}
