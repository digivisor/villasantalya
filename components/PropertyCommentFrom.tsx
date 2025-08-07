"use client";
import { useState } from "react";
import { addComment } from "../app/services/comment.service";

interface PropertyCommentFormProps {
  propertyId: string;
}

export default function PropertyCommentForm({ propertyId }: PropertyCommentFormProps) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); setSuccess(null);

if (!form.name.trim() || !form.phone.trim() || !form.message.trim()) {
  setError("Lütfen tüm zorunlu alanları doldurunuz!");
  return;
}

    setLoading(true);
    try {
      await addComment({ ...form, propertyId });
      setSuccess("Yorumunuz başarıyla gönderildi!");
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch (err: any) {
      setError(err.message || "Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 max-w-2xl w-full mx-auto"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-base font-medium text-gray-700 mb-2">Adınız Soyadınız*</label>
          <input
            type="text"
            name="name"
            id="name"
            placeholder="Adınız Soyadınız"
            value={form.name}
            onChange={handleChange}
            required
            className="h-12 w-full rounded-md border border-gray-300 px-3 text-gray-700 placeholder:text-gray-400 focus:ring-orange-500 focus:border-orange-500 outline-none transition text-base"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-base font-medium text-gray-700 mb-2">E-posta Adresiniz</label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="E-posta Adresiniz (isteğe bağlı)"
            value={form.email}
            onChange={handleChange}
            className="h-12 w-full rounded-md border border-gray-300 px-3 text-gray-700 placeholder:text-gray-400 focus:ring-orange-500 focus:border-orange-500 outline-none transition text-base"
          />
        </div>
      </div>
      <div>
        <label htmlFor="phone" className="block text-base font-medium text-gray-700 mb-2">Telefon Numaranız*</label>
        <input
          type="tel"
          name="phone"
          id="phone"
          placeholder="Telefon Numaranız"
          value={form.phone}
          onChange={handleChange}
          required
          className="h-12 w-full rounded-md border border-gray-300 px-3 text-gray-700 placeholder:text-gray-400 focus:ring-orange-500 focus:border-orange-500 outline-none transition text-base"
        />
      </div>
      <div>
        <label htmlFor="message" className="block text-base font-medium text-gray-700 mb-2">Mesajınız*</label>
        <textarea
          name="message"
          id="message"
          placeholder="Bu emlak hakkındaki sorunuz veya mesajınız..."
          value={form.message}
          onChange={handleChange}
          required
          rows={4}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700 placeholder:text-gray-400 focus:ring-orange-500 focus:border-orange-500 outline-none transition resize-none min-h-24 text-base"
        />
      </div>
      {error && (
        <div className="w-full bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-lg font-semibold text-center">
          {error}
        </div>
      )}
      {success && (
        <div className="w-full bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded text-lg font-semibold text-center">
          {success}
        </div>
      )}
      <button
        type="submit"
        className="w-full h-14 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-lg font-bold transition disabled:opacity-70"
        disabled={loading}
      >
        {loading ? "Gönderiliyor..." : "Gönder"}
      </button>
    </form>
  );
}