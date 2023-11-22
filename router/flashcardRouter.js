const express = require('express');
const flashcardRouter = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const fs = require('fs-extra');
const excelToJson = require('convert-excel-to-json');

const Flashcard = require('../models/Flashcard');

flashcardRouter.get('/', (req, res, next) => {
   Flashcard.find()

      .then((flashcards) => {
         res.json(flashcards);
      })
      .catch((err) => {
         next(err);
      }); // ใช้ method find() เพื่อค้นหาข้อมูลทั้งหมดใน collection
});

const upload = multer({ dest: "data/" }); // เป็นการบอกว่าไฟล์ที่อัพโหลดจะถูกเก็บไว้ที่โฟลเดอร์ไหน

// Import excel file
flashcardRouter.post('/import', (upload.single('file')), (req, res, next) => {
   console.log(req.file);
   try {

      if (req.file.filename == null || req.file.filename == undefined) {
         res.status(400).send('No file uploaded.');

      } else {
         const filePath = "data/" + req.file.filename; // ตั้งชื่อไฟล์ที่จะเก็บข้อมูล excel

         const excelData = excelToJson({
            sourceFile: filePath,
            header: {
               rows: 1
            },
            columnToKey: {
               A: 'card_question',
               B: 'card_answer'
            }
         });
         let allData = [];
         for (let sheet in excelData) {
            allData = allData.concat(excelData[sheet]);
         }
         res.status(200).json(allData);
         console.log(allData);
         fs.remove(filePath); // Delete excel file

         // Insert data to database
         let deck_id = '6554db20ab46e706fc34b8bb'; // replace with your actual deck_id
         allData = allData.map(item => ({ ...item, deck_id }));
         Flashcard.insertMany(allData)
            .then(() => {
               console.log('Inserted data to database.');
            })
            .catch((error) => {
               console.log(error);
            });
      }
   } catch (error) {
      next(error);
   }
});


module.exports = flashcardRouter;