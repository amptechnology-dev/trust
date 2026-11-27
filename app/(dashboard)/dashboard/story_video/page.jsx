"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import swal from "sweetalert";

const API = process.env.NEXT_PUBLIC_BACKLINK;

function Page() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(null);

  const [form, setForm] = useState({
    youtube_url: "",
    channel_url: "",
    kicker: "Our Story",
    title: "See our work in action",
    text: "",
  });
  const [points, setPoints] = useState([""]);

  const fillForm = (s) => {
    setForm({
      youtube_url: s?.youtube_url || "",
      channel_url: s?.channel_url || "",
      kicker: s?.kicker || "Our Story",
      title: s?.title || "See our work in action",
      text: s?.text || "",
    });
    setPoints(s?.points?.length ? s.points : [""]);
  };

  const load = async () => {
    try {
      const res = await axios.get(`${API}/dashboard/story_video/list`, {
        withCredentials: true,
      });
      const data = res?.data?.data || null;
      setSaved(data);
      fillForm(data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const updatePoint = (i, value) =>
    setPoints((prev) => prev.map((p, idx) => (idx === i ? value : p)));
  const addPoint = () => setPoints((p) => [...p, ""]);
  const removePoint = (i) => setPoints((p) => p.filter((_, idx) => idx !== i));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.youtube_url.trim()) {
      swal("Error!", "YouTube video URL is required.", "error");
      return;
    }

    try {
      setSaving(true);
      await axios.put(
        `${API}/dashboard/story_video/save`,
        { ...form, points },
        { withCredentials: true },
      );
      swal("Success!", "Story video saved successfully!", "success");
      await load();
    } catch (error) {
      swal(
        "Error!",
        error?.response?.data?.errors || "Something went wrong!",
        "error",
      );
      console.error("Error:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    swal({
      title: "Are you sure?",
      text: "Story video section will show the demo design again.",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (!willDelete) return;
      try {
        await axios.delete(`${API}/dashboard/story_video/delete`, {
          withCredentials: true,
        });
        swal("Deleted Successfully!", { icon: "success" });
        setSaved(null);
        fillForm(null);
      } catch (error) {
        console.error("Error:", error);
        swal("Error!", "Could not delete.", "error");
      }
    });
  };

  if (loading) return <div className="container pt-3">Loading...</div>;

  return (
    <div className="container pt-3">
      <h2 style={{ color: "#007bff" }}>
        {saved ? "Edit Story Video" : "Add Story Video"}
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>YouTube Video URL *</label>
          <input
            type="url"
            className="form-control"
            name="youtube_url"
            value={form.youtube_url}
            onChange={handleChange}
            placeholder="https://www.youtube.com/watch?v=XXXXXXXXXXX"
            required
          />
        </div>

        <div className="form-group">
          <label>
            YouTube Channel URL{" "}
            <span className="font-italic text-sm font-weight-light">
              (&quot;Watch More Videos&quot; Button will be gone on this link)
            </span>
          </label>
          <input
            type="url"
            className="form-control"
            name="channel_url"
            value={form.channel_url}
            onChange={handleChange}
            placeholder="https://www.youtube.com/@yourchannel"
          />
        </div>

        <div className="form-group">
          <label>Small Label</label>
          <input
            className="form-control"
            name="kicker"
            value={form.kicker}
            onChange={handleChange}
            placeholder="Our Story"
          />
        </div>

        <div className="form-group">
          <label>Title</label>
          <input
            className="form-control"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="See our work in action"
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            className="form-control"
            name="text"
            rows={3}
            value={form.text}
            onChange={handleChange}
          />
        </div>

        <h5 className="mt-4">Bullet Points</h5>
        {points.map((p, i) => (
          <div key={i} className="input-group mb-2">
            <input
              className="form-control"
              value={p}
              onChange={(e) => updatePoint(i, e.target.value)}
              placeholder={`Point ${i + 1}`}
            />
            <div className="input-group-append">
              <button
                type="button"
                className="btn btn-outline-danger"
                onClick={() => removePoint(i)}
                disabled={points.length === 1}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
        <button
          type="button"
          className="btn btn-outline-primary mb-3"
          onClick={addPoint}
        >
          + Add Point
        </button>

        <div>
          <button
            type="submit"
            className="btn btn-primary mr-2"
            disabled={saving}
          >
            {saving ? "Saving..." : saved ? "UPDATE" : "SAVE"}
          </button>
          {saved && (
            <button
              type="button"
              className="btn btn-danger"
              onClick={handleDelete}
            >
              Delete
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default Page;
