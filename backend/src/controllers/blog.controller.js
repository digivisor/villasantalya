const Blog = require("../models/blog.model");

// Admin control örneği (JWT ile req.user.isAdmin true ise)
const isAdmin = (req) => req.isAdmin === true;
console.log('isAdmin function loaded', isAdmin);

// Eğer gelen parametre 24 karakterli ObjectId ise _id ile, değilse slug ile ara
exports.getBlog = async (req, res) => {
  const param = req.params.param;
  let blog;
  if (param.match(/^[0-9a-fA-F]{24}$/)) {
    blog = await Blog.findById(param);
  } else {
    blog = await Blog.findOne({ slug: param });
  }
  if (!blog) return res.status(404).json({ error: "Blog bulunamadı" });
  res.json(blog);
};


exports.getBlogs = async (req, res) => {
  try {
    const { search, category, tag, isActive, limit, skip } = req.query;
    let filter = {};

    if (isActive !== undefined) filter.isActive = isActive === 'true';
    if (category) filter.category = category;
    if (tag) filter.tags = tag;
    if (search) {
      filter.$or = [
        { title:   { $regex: search, $options: "i" } },
        { excerpt: { $regex: search, $options: "i" } },
        { author:  { $regex: search, $options: "i" } },
      ];
    }

    const blogs = await Blog.find(filter)
      .sort({ date: -1 })
      .skip(Number(skip) || 0)
      .limit(Number(limit) || 50);

    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: "Bloglar alınamadı" });
  }
};

// Tekil blog (slug ile)
exports.getBlogBySlug = async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug });
    if (!blog) return res.status(404).json({ error: "Blog bulunamadı" });
    // Okunma sayısını artır (isteğe bağlı)
    blog.views += 1;
    await blog.save();
    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: "Blog alınamadı" });
  }
};

exports.createBlog = async (req, res) => {
  if (!isAdmin(req)) return res.status(403).json({ error: "Yetkisiz" });
  try {
    // FormData ile gelen alanları çek
    const {
      title,
      excerpt,
      content,
      author,
      category,
      isActive,
      slug,
    } = req.body;

    let tags = [];
    if (req.body.tags) {
      try {
        tags = JSON.parse(req.body.tags);
      } catch (e) {
        tags = Array.isArray(req.body.tags) ? req.body.tags : [req.body.tags];
      }
    }

    let image = '';
    if (req.file) {
      // Eğer dosya yüklendiyse, dosya yolunu ata
      image = `/uploads/blogs/${req.file.filename}`;
    } else if (req.body.image) {
      // Alternatif olarak image url geldiyse kullan
      image = req.body.image;
    }

    const blog = new Blog({
      title,
      excerpt,
      content,
      author,
      category,
      isActive,
      slug,
      tags,
      image,
    });

    await blog.save();
    res.status(201).json(blog);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Blog oluşturulamadı", detail: err.message });
  }
};

exports.updateBlog = async (req, res) => {
  if (!isAdmin(req)) return res.status(403).json({ error: "Yetkisiz" });
  const param = req.params.param;
  let blog;
  if (param.match(/^[0-9a-fA-F]{24}$/)) {
    blog = await Blog.findByIdAndUpdate(param, req.body, { new: true });
  } else {
    blog = await Blog.findOneAndUpdate({ slug: param }, req.body, { new: true });
  }
  if (!blog) return res.status(404).json({ error: "Blog bulunamadı" });
  res.json(blog);
};

exports.deleteBlog = async (req, res) => {
  if (!isAdmin(req)) return res.status(403).json({ error: "Yetkisiz" });
  const param = req.params.param;
  let blog;
  if (param.match(/^[0-9a-fA-F]{24}$/)) {
    blog = await Blog.findByIdAndDelete(param);
  } else {
    blog = await Blog.findOneAndDelete({ slug: param });
  }
  if (!blog) return res.status(404).json({ error: "Blog bulunamadı" });
  res.json({ success: true });
};