import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import "./Complaints.css";

export default function Complaints() {
  const [showModal, setShowModal] = useState(false);
  const [complaints, setComplaints] = useState([]);

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "General"
  });

  const fetchComplaints = async () => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) return;

    const { data, error } = await supabase
      .from("complaints")
      .select("*")
      .eq("user_id", userData.user.id)
      .order("created_at", { ascending: false });

    if (!error) setComplaints(data || []);
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleImageChange = (file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Only image files allowed");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert("Max size is 2MB");
      return;
    }

    if (preview) URL.revokeObjectURL(preview);

    const newPreview = URL.createObjectURL(file);

    setImage(file);
    setPreview(newPreview);
  };

  const handleSubmit = async () => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) return;

    let imageUrl = null;

    // if (image) {
    //   const fileName = `${Date.now()}_${image.name}`;

    //   const { error: uploadError } = await supabase.storage
    //     .from("complaint-images")
    //     .upload(fileName, image);

    //   if (uploadError) {
    //     alert("Image upload failed");
    //     return;
    //   }

    //   const { data } = supabase.storage
    //     .from("complaint-images")
    //     .getPublicUrl(fileName);

    //   imageUrl = data.publicUrl;
    // }
if (image) {
  const fileName = `${userData.user.id}_${Date.now()}_${image.name}`;

  const { error: uploadError } = await supabase.storage
    .from("complaint-images")
    .upload(fileName, image, {
      cacheControl: "3600",
      upsert: true
    });

  if (uploadError) {
    console.log("Upload error:", uploadError);
    alert("Image upload failed");
    return;
  }

  const { data: publicData } = supabase.storage
    .from("complaint-images")
    .getPublicUrl(fileName);

  imageUrl = publicData.publicUrl;

  console.log("IMAGE URL:", imageUrl);
}
    const { error } = await supabase.from("complaints").insert([
      {
        title: form.title,
        description: form.description,
        category: form.category,
        status: "Pending",
        image_url: imageUrl,
        user_id: userData.user.id
      }
    ]);

    if (!error) {
      setShowModal(false);
      setForm({ title: "", description: "", category: "General" });
      setImage(null);
      setPreview(null);
      fetchComplaints();
    } else {
      alert("Error submitting complaint");
    }
  };

  return (
    <div className="complaints-page">

      <div className="complaints-header">
        <h2>Complaint Management</h2>
        <button onClick={() => setShowModal(true)} className="primary-btn">
          + Raise Complaint
        </button>
      </div>

      {/* LIST */}
      {complaints.length === 0 ? (
        <div className="empty-state">
          <p>No complaints yet 🚀</p>
          <span>Click "Raise Complaint" to create your first issue</span>
        </div>
      ) : (
        <div className="complaints-list">
          {complaints.map((item) => (
            // <div className="s-complaint-card" key={item.id}>
            <div className={`s-complaint-card ${item.status.toLowerCase()}`} key={item.id}>

              <div className="card-top">
                <h4>{item.title}</h4>
                <span className={`status ${item.status.toLowerCase()}`}>
                  {item.status}
                </span>
              </div>
              <div className="card-body">
                <div className="text-section">
                  <p className="desc">{item.description}</p>
                </div>

                {item.image_url && (
                  <img
                    src={item.image_url}
                    alt="proof"
                    className="complaint-img"
                  />
                )}
              </div>

              <div className="card-footer">
                <span>{item.category}</span>
                <span>
                  {new Date(item.created_at).toLocaleDateString()}
                </span>
              </div>

            </div>
          ))}
        </div>
      )}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Raise Complaint</h3>

            <input
              type="text"
              placeholder="Title"
              value={form.title}
              onChange={(e) =>
                setForm({ ...form, title: e.target.value })
              }
            />

            <textarea
              placeholder="Description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />

            <select
              value={form.category}
              onChange={(e) =>
                setForm({ ...form, category: e.target.value })
              }>
              <option>General</option>
              <option>Hostel</option>
              <option>Transport</option>
              <option>Academics</option>
            </select>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                handleImageChange(file);
              }}
            />
            {preview && (
              <img
                src={preview}
                alt="preview"
                className="preview-img"
              />
            )}

            <div className="modal-actions">
              <button onClick={handleSubmit} className="primary-btn">
                Submit
              </button>

              <button
                onClick={() => setShowModal(false)}
                className="cancel-btn">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}