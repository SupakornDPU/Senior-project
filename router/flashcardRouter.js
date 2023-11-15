const express = require('express');
const flashcardRouter = express.Router();
const mongoose = require('mongoose');
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

 
flashcardRouter.post('/', (req, res, next) => {
    Flashcard.find()
    
       .then((flashcards) => {
          res.json(flashcards);
       })
       .catch((err) => {
          next(err);
       }); // ใช้ method find() เพื่อค้นหาข้อมูลทั้งหมดใน collection
 });


 module.exports = flashcardRouter;