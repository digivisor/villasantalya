const Comment = require("../models/comment.model");

// Yorum ekleme
exports.addComment = async (req, res) => {
  try {
    const { propertyId, name, email, phone, message } = req.body;
    if (!propertyId || !name || !phone || !message)
      return res.status(400).json({ message: "Tüm alanlar zorunludur." });

    const comment = await Comment.create({
      property: propertyId,
      name,
      email,
      phone,
      message
    });

    res.status(201).json({ message: "Yorum başarıyla eklendi", comment });
  } catch (err) {
    res.status(500).json({ message: "Yorum eklenemedi", error: err.message });
  }
};

// Belli bir ilana ait yorumları getir
exports.getCommentsByProperty = async (req, res) => {
  try {
    const { propertyId } = req.params;
    const comments = await Comment.find({ property: propertyId }).sort({ createdAt: -1 });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: "Yorumlar getirilemedi", error: err.message });
  }
};
exports.deleteAllComments = async (req, res) => {
  try {
    await Comment.deleteMany({});
    res.status(200).json({ message: "Tüm yorumlar başarıyla silindi." });
  } catch (err) {
    res.status(500).json({ message: "Yorumlar silinemedi", error: err.message });
  }
};
// Admin için tüm yorumları ve ilan başlığını çek
exports.getAllCommentsWithProperty = async (req, res) => {
  try {
    const comments = await Comment.find().populate("property", "title slug");
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: "Yorumlar getirilemedi", error: err.message });
  }
};

// TÜM YORUMLARI SİL (SADECE TEST/ADMİN AMAÇLI KULLAN!)
exports.deleteAllComments = async (req, res) => {
  try {
    await Comment.deleteMany({});
    res.status(200).json({ message: "Tüm yorumlar başarıyla silindi." });
  } catch (err) {
    res.status(500).json({ message: "Yorumlar silinemedi", error: err.message });
  }
};