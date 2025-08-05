// utils/helpers.ts
export const generateSlug = (text: string): string => {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')     // Boşlukları tire ile değiştir
    .replace(/[üöçğşı]/g, c => {  // Türkçe karakterleri değiştir
      const tr = { 'ü': 'u', 'ö': 'o', 'ç': 'c', 'ğ': 'g', 'ş': 's', 'ı': 'i' };
      return tr[c as keyof typeof tr] || c;
    })
    .replace(/[^\w\-]+/g, '')  // Alfanümerik olmayan karakterleri kaldır
    .replace(/\-\-+/g, '-')    // Çoklu tireleri tek tireye indir
    .replace(/^-+/, '')        // Baştaki tireleri kaldır
    .replace(/-+$/, '');       // Sondaki tireleri kaldır
};