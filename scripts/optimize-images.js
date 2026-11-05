// Perkecil logo dan og-default. Jalankan: npm i --no-save sharp && node scripts/optimize-images.js (sharp tidak dimasukkan ke dependency agar npm install di hosting tetap ringan).
const sharp=require('sharp'),fs=require('fs');
const dir=require('path').join(__dirname,'..','public','img')+'/';
(async()=>{
  const kb=f=>Math.round(fs.statSync(f).size/1024);
  const before={logo:kb(dir+'logo.png'),og:kb(dir+'og-default.png')};
  const logo=await sharp(dir+'logo.png').resize(192,192,{fit:'contain',background:{r:0,g:0,b:0,alpha:0}}).png({palette:true,quality:90,compressionLevel:9,effort:10}).toBuffer();
  fs.writeFileSync(dir+'logo.png',logo);
  const og=await sharp(dir+'og-default.png').png({palette:true,quality:90,compressionLevel:9,effort:10}).toBuffer();
  fs.writeFileSync(dir+'og-default.png',og);
  console.log('logo',before.logo,'->',kb(dir+'logo.png'),'KB (192x192)');
  console.log('og-default',before.og,'->',kb(dir+'og-default.png'),'KB');
  const m=await sharp(dir+'logo.png').metadata();console.log('logo meta',m.width,m.height,m.hasAlpha);
})();
