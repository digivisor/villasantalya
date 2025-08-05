// fixDatabase.js
const mongoose = require('mongoose');
require('dotenv').config();

async function fixDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Doğrudan MongoDB collection'a erişim
    const db = mongoose.connection.db;
    const propertiesCollection = db.collection('properties');
    
    console.log('Searching for problematic property...');
    
    // String _id ile problematik kaydı bul
    const problematicProperty = await propertiesCollection.findOne({ _id: 'pending' });
    
    if (problematicProperty) {
      console.log('Found problematic property with _id: pending');
      
      // Tüm verileri kaydet (önemli bilgileri kopyala)
      const propertyData = { ...problematicProperty };
      delete propertyData._id; // _id'yi kaldır
      
      // Yeni bir ObjectId ile yeni kayıt oluştur
      const newObjectId = new mongoose.Types.ObjectId();
      const insertResult = await propertiesCollection.insertOne({
        ...propertyData,
        _id: newObjectId
      });
      
      console.log('Created new property with valid ObjectId:', newObjectId.toString());
      
      // Problematic kaydı sil
      await propertiesCollection.deleteOne({ _id: 'pending' });
      console.log('Deleted problematic property');
    } else {
      console.log('No property with _id: "pending" found');
      
      // Status: 'pending' olan kayıtları bul
      const pendingCount = await propertiesCollection.countDocuments({ status: 'pending' });
      console.log(`Found ${pendingCount} properties with status: "pending"`);
      
      // İlk 5 kaydı göster
      const samples = await propertiesCollection.find({ status: 'pending' }).limit(5).toArray();
      if (samples.length > 0) {
        console.log('Sample pending properties:');
        samples.forEach((prop, index) => {
          console.log(`Property ${index + 1} - _id: ${prop._id}, title: ${prop.title}`);
        });
      }
    }
    
    // Genel olarak tüm kayıtları kontrol et
    const totalCount = await propertiesCollection.countDocuments({});
    console.log(`Total properties in collection: ${totalCount}`);
    
    // status değerlerine göre grupla
    const statusCounts = await propertiesCollection.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]).toArray();
    
    console.log('Status distribution:');
    statusCounts.forEach(group => {
      console.log(`  ${group._id || 'undefined'}: ${group.count}`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Connection closed');
  }
}

fixDatabase();