// routes/comment.routes.js
const express = require("express");
const router = express.Router();
const commentController = require("../controllers/comment.controller");
const { verifyToken, isAdmin } = require("../middleware/auth.middleware");


router.post("/", commentController.addComment);

router.get("/property/:propertyId", commentController.getCommentsByProperty);

router.get('/all', verifyToken, isAdmin, commentController.getAllCommentsWithProperty);



// BUNU SİL SİLMEYİ UNUTMA! (Test/Admin için tüm yorumları sil)


router.delete("/comments/all", commentController.deleteAllComments);




module.exports = router;