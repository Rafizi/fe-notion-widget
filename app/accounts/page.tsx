/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabaseClient";
import Navbar from "../components/Navbar";
import { Plus, Trash2, User } from "lucide-react";

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

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (!profile) {
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
  }, [router]);

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

      <div className="max-w-7xl mx-auto px-12 py-12">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-4xl text-gray-900 mb-2">Account Details</h1>
          <p className="text-gray-600">Manage your profile</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* LEFT COLUMN */}
          <div className="space-y-6">
            {/* PERSONAL INFO */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <User className="w-5 h-5 text-purple-600" />
                </div>
                <h2 className="text-xl text-gray-900">
                  Personal Information
                </h2>
              </div>

              <div className="space-y-5">
                {/* Avatar */}
                <div>
                  <label className="block text-xs text-gray-500 mb-2">
                    Avatar URL
                  </label>
                  <input
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder="https://example.com/avatar.jpg"
                  />

                  {avatarUrl && (
                    <img
                      src={avatarUrl}
                      className="w-16 h-16 rounded-full mt-3 object-cover"
                    />
                  )}
                </div>

                {/* Name */}
                <div>
                  <label className="block text-xs text-gray-500 mb-2">
                    Name
                  </label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>

                {/* Username */}
                <div>
                  <label className="block text-xs text-gray-500 mb-2">
                    Username
                  </label>
                  <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder="@yourname"
                  />
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-xs text-gray-500 mb-2">
                    Bio
                  </label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg"
                    rows={3}
                  />
                </div>
              </div>
            </div>

            {/* HIGHLIGHTS */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl text-gray-900">Highlights</h2>
                <button
                  onClick={addHighlight}
                  className="px-3 py-1 bg-purple-600 text-white rounded-lg text-sm flex items-center gap-1"
                >
                  <Plus size={16} /> Add
                </button>
              </div>

              <div className="space-y-4">
                {highlights.map((h, i) => (
                  <div
                    key={i}
                    className="p-4 border rounded-lg bg-gray-50 relative"
                  >
                    <button
                      onClick={() => removeHighlight(i)}
                      className="absolute right-3 top-3 text-red-500"
                    >
                      <Trash2 size={18} />
                    </button>

                    <div className="space-y-2">
                      <input
                        value={h.title}
                        onChange={(e) =>
                          updateHighlight(i, "title", e.target.value)
                        }
                        className="w-full px-4 py-2 border rounded-lg"
                        placeholder="Highlight title"
                      />

                      <input
                        value={h.image}
                        onChange={(e) =>
                          updateHighlight(i, "image", e.target.value)
                        }
                        className="w-full px-4 py-2 border rounded-lg"
                        placeholder="Image URL"
                      />

                      {h.image && (
                        <img
                          src={h.image}
                          className="w-14 h-14 rounded-full object-cover mt-2"
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SAVE */}
            <button
              onClick={handleSave}
              className="w-full py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition"
            >
              Save Profile
            </button>
          </div>

          {/* RIGHT COLUMN (placeholder biar future-proof) */}
          <div className="bg-white border border-dashed border-gray-300 rounded-xl p-6 text-gray-500 flex items-center justify-center">
            Widget / Stats / Feature nanti di sini 👀
          </div>
        </div>
      </div>
    </>
  );
}
