const express = require('express')
var fetchuser = require('../middleware/fetchuser')
const Notes = require("../models/Notes")
const router = express.Router();
const { body, validationResult } = require('express-validator');


//get all the notes get /api/notes/fetchallnotes
router.get('/fetchallnotes', fetchuser, async (req, res) => {
   try {
      const notes = await Notes.find({ user: req.user.id })
      res.json(notes)
   }
   catch (error) {
      alert(error.message)
      res.status(500).send("some error has occurd")

   }
})

//add a new notes /api/notes/addnote
router.post('/addnote', fetchuser, [

   body('title').isLength({ min: 3 }),
   body('description').isLength({ min: 5 }),
], async (req, res) => {
   try {
      const { title, description, tag } = req.body
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
         return res.status(400).json({ errors: errors.array() });
      }
      const note = new Notes({
         title, description, tag, user: req.user.id
      })
      const savednote = await note.save()
      res.json(savednote)
   }
   catch (error) {
      alert(error.message)
      res.status(500).send("some error has occurd")

   }

})

//update

router.put('/updatenote/:id', fetchuser, async (req, res) => {

   const { title, description, tag } = req.body

   //create a new note
   try {
      const newnote = {};
      if (title) { newnote.title = title }
      if (description) { newnote.description = description }
      if (tag) { newnote.tag = tag }

      //find a new note
      let note = await Notes.findById(req.params.id)
      if (!note) { res.status(404).send("not found") }
      if (note.user.toString() !== req.user.id) {
         return res.status(401).send("not allowed")
      }
      note = await Notes.findByIdAndUpdate(req.params.id, { $set: newnote }, { new: true })
      res.json({ note })
   }
   catch (error) {
      alert(error.message)
      res.status(500).send("some error has occurd")

   }

})

//delete notes
router.delete('/deletenote/:id', fetchuser, async (req, res) => {

   try {
      //find a new note to delete
      let note = await Notes.findById(req.params.id)
      if (!note) { res.status(404).send("not found") }
      //correct user
      if (note.user.toString() !== req.user.id) {
         return res.status(401).send("not allowed")
      }
      note = await Notes.findByIdAndDelete(req.params.id)
      res.json({ "Success": "deleted", note: note })
   }
   catch (error) {
     alert(error.message)
      res.status(500).send("some error has occurd")

   }
})



module.exports = router