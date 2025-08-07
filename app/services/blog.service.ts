import axios from "axios";

// Ortam değişkeninden ya da sabit olarak BASE_URL ayarla
const BASE_URL = process.env.NEXT_PUBLIC_API_URL
  ? `${process.env.NEXT_PUBLIC_API_URL}/api/blogs`
  : "https://api.villasantalya.com/api/blogs";

// Blog tipini dışarıdan import et
export interface BlogPost {
  id?: number;
  _id?: string;
  title: string;
  excerpt: string;
  content?: string;
  date: string;
  author: string;
  image: string;
  tags: string[];
  category: string;
  isActive?: boolean;
  comments?: number;
  views?: number;
  slug: string;
  lastUpdated?: string;
}

// Listeleme (query ile filtrelenebilir)
export async function getBlogs(params = {}, token?: string): Promise<BlogPost[]> {
  const res = await fetch(
    `${BASE_URL}?${new URLSearchParams(params as any).toString()}`,
    {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      cache: "no-store",
    }
  );
  if (!res.ok) throw new Error("Bloglar alınamadı");
  return await res.json();
}

// Tekil blog (slug ile)
export async function getBlogBySlug(slug: string, token?: string): Promise<BlogPost> {
  const res = await fetch(
    `${BASE_URL}/${slug}`,
    {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      cache: "no-store",
    }
  );
  if (!res.ok) throw new Error("Blog bulunamadı");
  return await res.json();
}

// Admin: Blog ekle
export async function createBlog(data: Partial<BlogPost>, token: string): Promise<BlogPost> {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Blog oluşturulamadı");
  return await res.json();
}

// Admin: Blog güncelle (slug ile)
export async function updateBlog(slug: string, data: Partial<BlogPost>, token: string): Promise<BlogPost> {
  const res = await fetch(`${BASE_URL}/${slug}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Blog güncellenemedi");
  return await res.json();
}

// Admin: Blog sil (slug ile)
export async function deleteBlog(slug: string, token: string): Promise<{ success: boolean }> {
  const res = await fetch(`${BASE_URL}/${slug}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Blog silinemedi");
  return await res.json();
}