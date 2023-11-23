const express = require('express');
const flashcardRouter = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const fs = require('fs-extra');
const excelToJson = require('convert-excel-to-json');
const Flashcard = require('../models/Flashcard');
const Deck = require('../models/Deck');

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
flashcardRouter.post('/import/:deckId', (upload.single('file')), (req, res, next) => {
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
         // console.log(allData);
         fs.remove(filePath); // Delete excel file

         // Insert data to database
         const deck_id = req.params.deckId;
         allData = allData.map(item => ({ ...item, deck_id }));
         Flashcard.insertMany(allData)
            .then((insertedDocuments) => {
               console.log(insertedDocuments);
               // สร้าง array ของ _id จาก insertedDocuments
               let flashcardIds = insertedDocuments.map(doc => doc._id);

               // ใช้ $addToSet กับ $each เพื่อเพิ่มทุก _id ใน flashcardIds ลงใน flashcards ของ Deck
               return Deck.findByIdAndUpdate(deck_id, { $addToSet: { flashcards: { $each: flashcardIds } } }, { new: true });
            })
            .then(updatedDeck => {
               console.log(updatedDeck);
               console.log('Inserted data to database and updated the decks.');
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