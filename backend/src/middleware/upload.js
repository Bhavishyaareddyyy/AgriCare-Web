import multer from 'multer';
export const upload=multer({storage:multer.memoryStorage(),limits:{fileSize:5*1024*1024,files:1},fileFilter(req,file,cb){cb(null,['image/jpeg','image/png','image/webp'].includes(file.mimetype));}});
