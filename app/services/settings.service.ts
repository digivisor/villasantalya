const BASE_URL = "https://api.villasantalya.com/api";

// const BASE_URL = "http://localhost:5000/api"; // Geliştirme ortamı için yerel URL

// Ayarlar servisi
// Sadece gerekli servisleri tutuyoruz
export async function getSocialLinks(token: string) {
  const res = await fetch(`${BASE_URL}/settings/social-links`, { 
    headers: { Authorization: `Bearer ${token}` } 
  });
  return res.json();
}
export interface WorkingHours {
  weekday: { start: string; end: string };
  saturday: { start: string; end: string };
  sunday: { isOpen: boolean; start: string; end: string };
}

export async function getWorkingHours(token: string) {
  try {
    const res = await fetch(`${BASE_URL}/settings/working-hours`, { 
      headers: { Authorization: `Bearer ${token}` } 
    });
    if (!res.ok) throw new Error('API isteği başarısız');
    return res.json();
  } catch (error) {
    console.error('Çalışma saatleri alınamadı:', error);
    return {};
  }
}

export async function updateWorkingHours(data: WorkingHours, token: string) {
  try {
    const res = await fetch(`${BASE_URL}/settings/working-hours`, {
      method: "PUT",
      headers: { 
        "Content-Type": "application/json", 
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify({ workingHours: data })
    });
    if (!res.ok) throw new Error('API isteği başarısız');
    return res.json();
  } catch (error) {
    console.error('Çalışma saatleri güncellenemedi:', error);
    throw error;
  }
} 

export async function updateSocialLinks(data: any, token: string) {
  const res = await fetch(`${BASE_URL}/settings/social-links`, {
    method: "PUT",
    headers: { 
      "Content-Type": "application/json", 
      Authorization: `Bearer ${token}` 
    },
    body: JSON.stringify({ socialLinks: data })
  });
  return res.json();
}

export async function getYoutubeVideoId(token: string) {
  const res = await fetch(`${BASE_URL}/settings/youtube-video`, { 
    headers: { Authorization: `Bearer ${token}` } 
  });
  return res.json();
}

export async function updateYoutubeVideoId(videoId: string, token: string) {
  const res = await fetch(`${BASE_URL}/settings/youtube-video`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json", 
      Authorization: `Bearer ${token}` 
    },
    body: JSON.stringify({ videoId })
  });
  return res.json();
}

// Yeni eklenen contact info servisleri
export async function getContactInfo(token: string) {
  const res = await fetch(`${BASE_URL}/settings/contact`, { 
    headers: { Authorization: `Bearer ${token}` } 
  });
  return res.json();
}

export async function updateContactInfo(data: any, token: string) {
  const res = await fetch(`${BASE_URL}/settings/contact`, {
    method: "PUT",
    headers: { 
      "Content-Type": "application/json", 
      Authorization: `Bearer ${token}` 
    },
    body: JSON.stringify(data)
  });
  return res.json();
}