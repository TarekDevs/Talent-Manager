const express = require('express')
const { register,handleFileUpload , signIn , signOut} = require('../controllers/auth')
const router = express.Router()
const multer = require('multer');
const path = require('path');
/* 
const pdfStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../pdf'));
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});


const uploadPDF = multer({ storage: pdfStorage, 
  fileFilter: pdfFileFilter,  
  limits: {
  fileSize: 5 * 1024 * 1024,
}, });

function pdfFileFilter(req, file, cb) {
  const filetypes = /pdf/;
  const mimetype = filetypes.test(file.mimetype);
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new Error('Only PDF files are allowed.'));
}


 */

const upload = multer();

  router.post('/', upload.single("file"), register);
  router.post('/signIn',signIn );
  router.post('/signOut',signOut);


module.exports = router;

