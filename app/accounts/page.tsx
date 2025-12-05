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

      <div className="max-w-3xl mx-auto p-10 space-y-8">
        <h1 className="text-2xl font-bold">Your Account</h1>

        {/* AVATAR */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Avatar URL</label>
          <input
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="https://example.com/avatar.jpg"
          />

          {avatarUrl && (
            <img
              src={avatarUrl}
              className="w-20 h-20 rounded-full mt-2 object-cover"
            />
          )}
        </div>

        {/* NAME */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>

        {/* USERNAME */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Username</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="@yourname"
          />
        </div>

        {/* BIO */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
            rows={3}
          />
        </div>

        {/* HIGHLIGHTS */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium">Highlights</label>
            <button
              onClick={addHighlight}
              className="px-3 py-1 bg-purple-600 text-white rounded-lg text-sm flex items-center gap-1"
            >
              <Plus size={16} /> Add
            </button>
          </div>

          <div className="space-y-4">
            {highlights.map((h, i) => (
              <div key={i} className="p-4 border rounded-lg bg-gray-50 relative">
                <button
                  onClick={() => removeHighlight(i)}
                  className="absolute right-3 top-3 text-red-500"
                >
                  <Trash2 size={18} />
                </button>

                <div className="space-y-2">
                  <input
                    value={h.title}
                    onChange={(e) => updateHighlight(i, "title", e.target.value)}
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
                      className="w-16 h-16 rounded-full object-cover mt-2"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={handleSave}
          className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          Save Profile
        </button>
      </div>
    </>
  );
}
