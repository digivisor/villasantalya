const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// İletişim formu mesajı gönder
export async function sendContactMessage({ name, email, phone, subject, message }) {
  const res = await fetch(`${API_URL}/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, phone, subject, message }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Mesaj gönderilemedi");
  }
  return await res.json();
}

// Tüm iletişim mesajlarını getir (admin)
export async function getAllContactMessages() {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/contact`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return await res.json();
}

// Tüm mesajları sil (admin)
export async function deleteAllContactMessages() {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/contact`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` }
  });
  return await res.json();
}

export async function markContactMessageAsRead(id) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/contact/${id}/read`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    }
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Mesaj durumu güncellenemedi");
  }
  return await res.json();
}