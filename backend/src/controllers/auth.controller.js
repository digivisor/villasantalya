const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

// Kullanıcı kaydı
exports.register = async (req, res) => {
  try {
    const { username, email, password, name, title, phone } = req.body;
    
    // Kullanıcı adı ve e-posta kontrolü
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({
        message: 'Kullanıcı adı veya e-posta zaten kullanımda'
      });
    }
    
    // Yeni kullanıcı oluştur
    const newUser = new User({
      username,
      email,
      password,
      name,
      title,
      phone,
    });
    
    await newUser.save();
    
    res.status(201).json({
      message: 'Kullanıcı başarıyla oluşturuldu',
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        name: newUser.name,
      }
    });
  } catch (error) {
    res.status(500).json({
      message: 'Kayıt işlemi başarısız',
      error: error.message
    });
  }
};

// Kullanıcı girişi
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Kullanıcıyı bul
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({
        message: 'Geçersiz kullanıcı adı veya şifre'
      });
    }
    
    // Aktif kullanıcı kontrolü
    if (!user.isActive) {
      return res.status(401).json({
        message: 'Hesabınız aktif değil'
      });
    }
    
    // Şifre kontrolü
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        message: 'Geçersiz kullanıcı adı veya şifre'
      });
    }
    
    // JWT token oluştur
    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    
    res.status(200).json({
      message: 'Giriş başarılı',
      token,
      user: {
        id: user._id,
        username: user.username,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        image: user.image
      }
    });
  } catch (error) {
    res.status(500).json({
      message: 'Giriş işlemi başarısız',
      error: error.message
    });
  }
};

// Kullanıcı bilgileri
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({
        message: 'Kullanıcı bulunamadı'
      });
    }
    
    res.status(200).json({
      user
    });
  } catch (error) {
    res.status(500).json({
      message: 'Kullanıcı bilgileri alınamadı',
      error: error.message
    });
  }
};