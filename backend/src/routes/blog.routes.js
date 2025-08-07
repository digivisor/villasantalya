const express = require("express");
const router = express.Router();
const blogController = require("../controllers/blog.controller");
const { verifyToken, isAdmin } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');


// router.get("/:id", blogController.getBlog);

router.get("/:param", blogController.getBlog);           
router.put("/:param", verifyToken, isAdmin, blogController.updateBlog);   
router.delete("/:param", verifyToken, isAdmin, blogController.deleteBlog); 


router.get("/", blogController.getBlogs);



router.get("/:slug", blogController.getBlogBySlug);

router.post(
  "/",
  verifyToken,
  isAdmin,
  upload.single('image'),
  blogController.createBlog
);

// router.put("/:slug", verifyToken, isAdmin, blogController.updateBlog);
// router.delete("/:slug", verifyToken, isAdmin, blogController.deleteBlog);

module.exports = router;