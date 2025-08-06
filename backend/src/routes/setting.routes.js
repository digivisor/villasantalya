const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settings.controller');
const auth = require('../middleware/auth.middleware');

// Base URL: /api/settings

// Contact Info
router.get('/contact', settingsController.getContactInfo);
router.put('/contact', auth.verifyToken, auth.isAdmin, settingsController.updateContactInfo);

// Social Links 
router.get('/social-links', settingsController.getSocialLinks);
router.put('/social-links', auth.verifyToken, auth.isAdmin, settingsController.updateSocialLinks);

// Youtube Video
router.get('/youtube-video', settingsController.getYoutubeVideo);
router.post('/youtube-video', auth.verifyToken, auth.isAdmin, settingsController.updateYoutubeVideo);


router.get('/working-hours', settingsController.getWorkingHours);
router.put(
  '/working-hours', 
  auth.verifyToken, 
  auth.isAdmin, 
  settingsController.updateWorkingHours
);

module.exports = router;