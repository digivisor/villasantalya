    const express = require("express");
    const router = express.Router();
    const contactController = require("../controllers/contact.controller");
    const { verifyToken, isAdmin } = require("../middleware/auth.middleware");

    // İletişim formu mesajı gönder (public)
    router.post("/", contactController.addContactMessage);

    // Tüm iletişim mesajlarını getir (admin)
    router.get("/", verifyToken, isAdmin, contactController.getAllContactMessages);

    // Tüm mesajları sil (admin/test amaçlı)
    router.delete("/", verifyToken, isAdmin, contactController.deleteAllContactMessages);

    router.patch("/:id/read", verifyToken, isAdmin, contactController.markContactMessageAsRead);


    module.exports = router;