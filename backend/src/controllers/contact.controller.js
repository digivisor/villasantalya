const Contact = require("../models/contact.model");

// İletişim mesajı ekle
exports.addContactMessage = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    if (!name || !subject || !message) {
      return res.status(400).json({ message: "Ad, konu ve mesaj alanları zorunludur." });
    }

    const contact = await Contact.create({ name, email, phone, subject, message });
    res.status(201).json({ message: "Mesajınız başarıyla gönderildi.", contact });
  } catch (err) {
    res.status(500).json({ message: "Mesaj gönderilemedi.", error: err.message });
  }
};

// Tüm iletişim mesajlarını getir (sadece admin)
exports.getAllContactMessages = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ message: "Mesajlar getirilemedi.", error: err.message });
  }
};

// Tüm mesajları sil (admin/test)
exports.deleteAllContactMessages = async (req, res) => {
  try {
    await Contact.deleteMany({});
    res.status(200).json({ message: "Tüm iletişim mesajları silindi." });
  } catch (err) {
    res.status(500).json({ message: "Mesajlar silinemedi.", error: err.message });
  }
};

exports.markContactMessageAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const contact = await Contact.findByIdAndUpdate(
      id,
      { status: "read" },
      { new: true }
    );
    if (!contact) return res.status(404).json({ message: "Mesaj bulunamadı" });
    res.json({ message: "Mesaj okundu olarak işaretlendi", contact });
  } catch (err) {
    res.status(500).json({ message: "Mesaj güncellenemedi", error: err.message });
  }
};