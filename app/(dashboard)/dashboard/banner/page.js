"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import swal from "sweetalert";

const API = process.env.NEXT_PUBLIC_BACKLINK;

const getBannerSrc = (src = "") => {
  if (/^https?:\/\//i.test(src)) return src;
  return `${process.env.NEXT_PUBLIC_BACKPUBLIC}/${src.replace(/^\/+/, "").replace(/^public\//, "")}`;
};

function Page() {
  const [banner, setBanner] = useState([]);
  const [bannerText, setBannerText] = useState([]);
  const [bannerError, setBannerError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState(null);
  const [text, setText] = useState("");
  const [fileKey, setFileKey] = useState(0);

  const fetchBanner = async () => {
    try {
      const response = await axios.get(`${API}/dashboard/office/list`, {
        withCredentials: true,
      });
      setBanner(response.data?.data?.banner || []);
      setBannerText(response.data?.data?.banner_text || []);
    } catch (error) {
      setBannerError(error.message);
    }
  };

  useEffect(() => {
    fetchBanner();
  }, []);

  const handleChange = (event) => {
    const f = event.target.files?.[0];
    if (!f) return;
    if (f.size > 1024 * 1024) {
      setBannerError("File size exceeds 1MB limit.");
      setFile(null);
      event.target.value = "";
    } else {
      setBannerError(null);
      setFile(f);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      setBannerError("Please select an image.");
      return;
    }

    const fd = new FormData();
    fd.append("banner", file);
    fd.append("text", text); // file er age/pore jekono jaygay hole multer parse kore

    try {
      setUploading(true);
      const res = await axios.post(`${API}/dashboard/banner/insert`, fd, {
        withCredentials: true,
      });
      if (res.status === 201) {
        setFile(null);
        setText("");
        setFileKey((k) => k + 1);
        setBannerError(null);
        swal("Success!", "Banner added successfully", "success");
        fetchBanner();
      }
    } catch (error) {
      setBannerError(
        error?.response?.data?.errors ||
          error?.response?.data?.message ||
          error.message
      );
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = (index) => {
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this item!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (!willDelete) return;
      try {
        await axios.delete(`${API}/dashboard/banner/delete/${index}`, {
          withCredentials: true,
        });
        fetchBanner();
        swal("Deleted Successfully!", { icon: "success", timer: 1000 });
      } catch (error) {
        console.error("Error deleting banner:", error);
        swal("Error!", "Could not delete banner.", "error");
      }
    });
  };

  return (
    <div className="container pt-3">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>
            Banner Image{" "}
            <span className="font-italic text-sm font-weight-light">
              (max size: 1MB, 600px X 400px)
            </span>
          </label>
          <input
            key={fileKey}
            type="file"
            accept="image/*"
            className="form-control"
            name="banner"
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>
            Banner Text{" "}
            <span className="font-italic text-sm font-weight-light">
              (optional, max 120 characters)
            </span>
          </label>
          <input
            type="text"
            className="form-control"
            value={text}
            maxLength={120}
            onChange={(e) => setText(e.target.value)}
            placeholder="e.g. Welcome to our village"
          />
        </div>

        {bannerError && (
          <div className="text-danger mb-2">{String(bannerError)}</div>
        )}

        <button type="submit" className="btn btn-primary" disabled={uploading}>
          {uploading ? "Uploading..." : "Add"}
        </button>
      </form>

      <div className="mt-3">
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Banner</th>
              <th scope="col">Text</th>
              <th scope="col">Manage</th>
            </tr>
          </thead>
          <tbody>
            {banner.length === 0 && (
              <tr>
                <td colSpan={3} className="text-muted">
                  No banners added yet.
                </td>
              </tr>
            )}
            {banner.map((src, index) => (
              <tr key={`${src}-${index}`}>
                <td>
                  <img
                    src={getBannerSrc(src)}
                    alt={`Banner ${index + 1}`}
                    style={{
                      width: 400,
                      maxWidth: "100%",
                      height: 250,
                      objectFit: "cover",
                      borderRadius: 6,
                    }}
                  />
                </td>
                <td>{bannerText[index] || <span className="text-muted">—</span>}</td>
                <td>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(index)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Page;