const express = require("express");
const app = express();
const port = process.env.PORT || 8080;
const cors = require("cors");
const imageToBase64 = require("image-to-base64");
const multer = require("multer");
const pdfKit = require('pdfkit');

const memory = multer.memoryStorage();
const fs = require('fs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const uploadmemory = multer({
  storage: memory,
  fileFilter: (req, file, cb) => {
    console.log(file);
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg" 
     
    ) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  },
});

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
  methods: ["GET", "POST"],
};

app.use(cors(corsOptions));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log;
    cb(null, './image')

  },
  filename: function (req, file, cb) {

    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "." + file.mimetype.split("/")[1]);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    console.log(file);
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg" ||
      file.mimetype == "video/mp4"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  },
});

app.post("/fetchimage", uploadmemory.single("Image"), (req, res) => {
  try {

    console.log(req.file);

    const base64data = Buffer.from(req.file.buffer).toString("base64");
    res.status(201).send("data:image/jpeg;base64," + base64data);

  } catch (error) {
    res.status(400).send(error);
  }
});



app.post("/fetchs", uploadmemory.fields([{
  name: 'driver', maxCount: 1
}, {
  name: 'car', maxCount: 1
},{
  name: 'license', maxCount: 1
}]),(req, res) => {
  try {

   

let fontNormal = 'Helvetica';
let fontBold = 'Helvetica-Bold';
let driverdata = req.body
console.log(driverdata)
   //(1190.55 x 1683.78)
      let pdfDoc = new pdfKit({ size: [1100,600], bufferPages: true});
      var date = new Date().getTime()  

      let buffers = [];
      pdfDoc.on('data', buffers.push.bind(buffers));
      pdfDoc.on('end', () => {

        let pdfData = Buffer.concat(buffers);
        res.writeHead(200, {
              'Content-Length': Buffer.byteLength(pdfData),
              'Content-Type': 'application/pdf',
              'Content-disposition': 'attachment;filename=test.pdf',
           })
           .end(pdfData);
        

     });
      // pdfDoc.pipe(fs.createWriteStream(`${date}.pdf`));

      pdfDoc.font(fontBold).fontSize(20).text('Driver information',5,5, { width: 1100,align: "center" });
      pdfDoc.rect(30, 30, 1020, 500).stroke();


      pdfDoc.font('Helvetica').fontSize(16).text('DRIVER PHOTO', 40, 40,{ align: "center", width: 300 });

      pdfDoc.image(req.files.driver[0].buffer, 40, 60, {width: 300, height: 300 ,fit: [300, 300], align: 'center', valign: 'center'}
        );
      pdfDoc.font('Helvetica').fontSize(16).text('COMPANY PHOTO', 380, 40,{ align: "center", width: 300 });

      pdfDoc.image(req.files.car[0].buffer
        , 380, 60, {width: 300, height: 300,fit: [300, 300], align: 'center', valign: 'center'}
        );
      pdfDoc.font('Helvetica').fontSize(16).text('LICENSE PHOTO', 720, 40,{ align: "center", width: 300 });

      pdfDoc.image(req.files.license[0].buffer
        , 720, 60, {width: 300, height: 300,fit: [300, 300], align: 'center', valign: 'center'});
      pdfDoc.font('Helvetica').fontSize(16).text('DATE:', 40, 400,{ align: "right", width: 440 });
      pdfDoc.font('Helvetica').fontSize(16).text('NAME:', 40, 430,{ align: "right", width: 440 });
      pdfDoc.font('Helvetica').fontSize(16).text('COURIER NAME:', 40, 460,{ align: "right", width: 440 });
      pdfDoc.font('Helvetica').fontSize(16).text(driverdata.date, 490, 400,{ align: "left", width: 490 });
      pdfDoc.font('Helvetica').fontSize(16).text(driverdata.name, 490, 430,{ align: "left", width: 490 });
      pdfDoc.font('Helvetica').fontSize(16).text(driverdata.couriername, 490, 460,{ align: "left", width: 490 });
      

      pdfDoc.end();
     


  } catch (error) {
console.log(error)
    res.status(400).send(error);
  }
});

app.listen(port, () => {
  console.log("server is on running in port " + port);
});
