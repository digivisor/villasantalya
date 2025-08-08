const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// Yorum ekle
export async function addComment({ propertyId, name, email, phone, message }) {
  const res = await fetch(`${API_URL}/comments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ propertyId, name, email, phone, message }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Yorum eklenemedi");
  }
  return await res.json();
}

// İlgili ilana ait yorumları getir (gerekirse)
export async function getCommentsByProperty(propertyId) {
  const res = await fetch(`${API_URL}/comments/property/${propertyId}`);
  return await res.json();
}

export async function getAllCommentsWithProperty() {
  // Token'ı al (localStorage'da saklıysa)
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_URL}/comments/all`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return await res.json();
}

export async function markCommentAsRead(commentId) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_URL}/comments/${commentId}/read`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    }
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Yorum durumu güncellenemedi");
  }
  return await res.json();
}