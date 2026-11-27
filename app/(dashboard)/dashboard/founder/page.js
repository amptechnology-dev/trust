"use client";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import swal from "sweetalert";

const API = process.env.NEXT_PUBLIC_BACKLINK;
const emptyAccordion = { title: "", text: "" };

function Page() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(null);

  const [form, setForm] = useState({
    name: "",
    designation: "Founder",
    quote: "",
    para1: "",
    para2: "",
  });
  const [accordions, setAccordions] = useState([{ ...emptyAccordion }]);
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState("");

  const fillForm = (f) => {
    setForm({
      name: f?.name || "",
      designation: f?.designation || "Founder",
      quote: f?.quote || "",
      para1: f?.paragraphs?.[0] || "",
      para2: f?.paragraphs?.[1] || "",
    });
    setAccordions(
      f?.accordions?.length
        ? f.accordions.map(({ title, text }) => ({ title, text }))
        : [{ ...emptyAccordion }],
    );
    setPreview(f?.image || "");
    setImageFile(null);
  };

  const load = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/dashboard/founder/list`, {
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
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // notun preview URL memory leak na hoy
  useEffect(() => {
    return () => {
      if (preview?.startsWith("blob:")) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const updateAccordion = (i, field, value) =>
    setAccordions((prev) =>
      prev.map((a, idx) => (idx === i ? { ...a, [field]: value } : a)),
    );

  const addAccordion = () =>
    setAccordions((p) => [...p, { ...emptyAccordion }]);
  const removeAccordion = (i) =>
    setAccordions((p) => p.filter((_, idx) => idx !== i));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.quote.trim()) {
      swal("Error!", "Name and message are required.", "error");
      return;
    }

    const fd = new FormData();
    fd.append("name", form.name);
    fd.append("designation", form.designation);
    fd.append("quote", form.quote);
    fd.append("paragraphs", JSON.stringify([form.para1, form.para2]));
    fd.append("accordions", JSON.stringify(accordions));
    if (imageFile) fd.append("image", imageFile);

    try {
      setSaving(true);
      await axios.put(`${API}/dashboard/founder/save`, fd, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      swal("Success!", "Founder saved successfully!", "success");
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
      text: "Founder section will show default content again.",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (!willDelete) return;
      try {
        await axios.delete(`${API}/dashboard/founder/delete`, {
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
        {saved ? "Edit Founder" : "Add Founder"}
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Founder Name *</label>
          <input
            className="form-control"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Designation</label>
          <input
            className="form-control"
            name="designation"
            value={form.designation}
            onChange={handleChange}
            placeholder="Founder"
          />
        </div>

        <div className="form-group">
          <label>
            Image{" "}
            <span className="font-italic text-sm font-weight-light">
              (square / portrait recommended)
            </span>
          </label>
          <input
            type="file"
            className="form-control"
            accept="image/jpg, image/jpeg, image/png, image/webp"
            onChange={handleImage}
          />
          {preview && (
            <img
              src={preview}
              alt="Founder preview"
              style={{
                marginTop: 10,
                width: 160,
                height: 160,
                objectFit: "cover",
                borderRadius: 8,
              }}
            />
          )}
        </div>

        <div className="form-group">
          <label>
            Founder&apos;s Message *{" "}
            <span className="font-italic text-sm font-weight-light">
              (max 500 characters)
            </span>
          </label>
          <textarea
            className="form-control"
            name="quote"
            rows={3}
            maxLength={500}
            value={form.quote}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Introduction – Paragraph 1</label>
          <textarea
            className="form-control"
            name="para1"
            rows={2}
            value={form.para1}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Introduction – Paragraph 2</label>
          <textarea
            className="form-control"
            name="para2"
            rows={2}
            value={form.para2}
            onChange={handleChange}
          />
        </div>

        <h5 className="mt-4">Accordion Items</h5>
        {accordions.map((a, i) => (
          <div key={i} className="border rounded p-3 mb-3">
            <div className="form-group">
              <label>Title (e.g. Our vision)</label>
              <input
                className="form-control"
                value={a.title}
                onChange={(e) => updateAccordion(i, "title", e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Text</label>
              <textarea
                className="form-control"
                rows={2}
                value={a.text}
                onChange={(e) => updateAccordion(i, "text", e.target.value)}
              />
            </div>
            <button
              type="button"
              className="btn btn-sm btn-outline-danger"
              onClick={() => removeAccordion(i)}
              disabled={accordions.length === 1}
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          className="btn btn-outline-primary mb-3"
          onClick={addAccordion}
        >
          + Add Item
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
