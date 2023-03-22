const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const bodyParser = require('body-parser')
const multer = require('multer');
const fs = require('fs')

app.use(bodyParser.urlencoded({ extended: true }))

// SET STORAGE
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      //neu chua co folder thi tao ra folder
        if(file.mimetyp == "image/jpeg" || file.mimetype == "image/jpeg" || file.mimetype == "image/png") {
            var dir = './uploads';

            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
              cb(null, 'uploads')
        } else {
            cb(new Error('Không phải là ảnh'));
        }


    },

    filename: function (req, file, cb) {
        let fileName = file.originalname;
        arr = fileName.split('.');

        let newFileName = '';

        for(let i = 0; i < arr.length; i++) {
          if (i != arr.length - 1) {
            newFileName += arr[i];
          } else {
            // newFileName += ('-' + Date.now() + '.' + arr[i]);
            newFileName += ('-' + Date.now() + '.jpeg');
          }
        }
        cb(null, newFileName)
    }
})

var upload = multer({ storage: storage })
// var upload = multer({ storage : storage, limits: { fileSize: 1024 * 1024 * 50 } });

app.post('/uploadfile', upload.single('myFile'), (req, res, next) => {
  const file = req.file
    if (!file) {
        const error = new Error('Please upload a file')
        error.httpStatusCode = 400
        console.log("err", error);
        return next(error)
    } else {
        let limitseize = 1.1 * 1024 * 1024 
        if(file.size > limitseize) {
            res.send("Kích thước file lớn hơn 1MB rồi @@")
        }
        res.send("Tải ảnh thành công!")
        console.log("dddd: ", file);
    }

})



//Uploading multiple files(upload nhieu file)
app.post('/uploadmultiple', upload.array('myFiles', 12), (req, res, next) => {
    const files = req.files
    if (!files) {
        const error = new Error('Please choose files')
        error.httpStatusCode = 400
        return next(error)
    }
    res.send(files)
    console.log("Data: " , files);
})

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/upload.html');
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});