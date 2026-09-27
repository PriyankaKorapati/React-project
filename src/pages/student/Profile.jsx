import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import "./Profile.css";
import Swal from "sweetalert2";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const fetchProfile = async () => {
    const { data: userData } = await supabase.auth.getUser();

    if (!userData?.user) {
      console.log("No user found");
      return;
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userData.user.id)
      .single();

    if (error) {
      console.log("Fetch error:", error);
      return;
    }

    setProfile({
      ...data,
      email: userData.user.email
    });

    setForm({
      ...data,
      email: userData.user.email
    });
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleImage = (file) => {
    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleUpdate = async () => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) return;

    let imageUrl = profile.avatar_url;

    if (image) {
      const fileExt = image.name.split(".").pop();
      const fileName = `${userData.user.id}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars").upload(fileName, image, {
          upsert: true,
        });

      if (uploadError) {
        console.log("Upload error:", uploadError);
        Swal.fire("Error", "Image upload failed", "error");
        return;
      }

      const { data } = supabase.storage
        .from("avatars")
        .getPublicUrl(fileName);

      imageUrl = data.publicUrl;
    }

    const { error } = await supabase
      .from("profiles")
      .update({
        department: form.department,
        college: form.college,
        year: form.year,
        avatar_url: imageUrl
      })
      .eq("id", userData.user.id);

    if (!error) {
      setIsEditing(false);
      fetchProfile();

      Swal.fire({
        icon: "success",
        title: "Profile Updated 🎉",
        text: "Your profile has been updated successfully!",
        confirmButtonColor: "#22c55e",
      });
    }
  };

  const handleDelete = async () => {
    const { data: userData } = await supabase.auth.getUser();

    await supabase
      .from("profiles")
      .delete()
      .eq("id", userData.user.id);

    alert("Profile deleted");
  };

  if (!profile) return <p>Loading...</p>;

  return (

    <div className="profile-page">

      <div className="profile-header-quote">
        <p>
          "Empowering students to raise voices and improve campus life 🚀"
        </p>
      </div>

      <div className="profile-container">

        <div className="profile-card">
          <img src={preview || profile.avatar_url || "https://via.placeholder.com/120?text=User"}
            alt ="profile" className="profile-img" />

          {isEditing && (
            <input type="file" onChange={(e) => handleImage(e.target.files[0])} />
          )}

          <h3>{profile.name}</h3>
          <span className="email">{profile.email}</span>
        </div>
        <div className="profile-details">

          <h3>Personal Details</h3>

          <input value={form.name || ""} disabled />
          <input value={form.email || ""} disabled />
          <input value={form.phone || ""} disabled />

          <input value={form.department || ""} disabled={!isEditing}
            onChange={(e) =>
              setForm({ ...form, department: e.target.value })
            }
            placeholder="Department"
          />

          <h3>Education</h3>

          <input value={form.college || ""} disabled={!isEditing}
            onChange={(e) =>
              setForm({ ...form, college: e.target.value })
            }
            placeholder="College"/>

          <input value={form.year || ""} disabled={!isEditing}
            onChange={(e) =>
              setForm({ ...form, year: e.target.value })
            }
            placeholder="Year" />

          {!isEditing ? (
            <div className="btn-row">
              <button className="edit-btn" onClick={() => setIsEditing(true)}>
                Edit
              </button>

              <button className="delete-btn" onClick={handleDelete}>
                Delete
              </button>
            </div>
          ) : (
            <div className="btn-row">
              <button className="save-btn" onClick={handleUpdate}>
                Save
              </button>

              <button className="cancel-btn" onClick={() => setIsEditing(false)}>
                Cancel
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}



