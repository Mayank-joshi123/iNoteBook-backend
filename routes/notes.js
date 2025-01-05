const express = require("express");
const Notes = require("../models/Notes")
const router = express.Router();
const feature = require("../middleware/featuser");
const { body,validationResult } = require("express-validator");



// Route 1 : Getting all Notes using : GET "/api/notes/fetchallnotes"  . Login Required 
router.get('/fetchallnotes',feature,async (req, res) => {

   try {
     const notes = await Notes.find({user:req.user.id})
     res.json(notes)
   } catch (err) {
     console.error(err.message);
   res.status(500).send("Some internal server error")
}
})


// Route 2 : Adding a new Note using : POST "/api/notes/addnote"  . Login Required 
router.post('/addnote',feature,[
     body("title","Title must be atlest 5 character").isLength({min:5}),
     body("description","Description must be atlest 10 character").isLength({min:10})
],async (req, res) => {
  
     try {
     const {title,description,tag} = req.body

     // Checking for error
     const error = validationResult(req);
     if(!error.isEmpty()){
          return res.status(400).send({error: error.array()})
     }
     
     //Creating a note and adding to database
     const note = new Notes({ title,description,tag,user:req.user.id    })
     
     const savednote = await note.save();
     res.json(savednote);
}
     catch (err) {
          console.error(err.message);
        res.status(500).send("Some internal server error")
     }

})

// Route 3 : Updating an existing Note using : PUT "api/notes/updatenote" . login required
router.put("/updatenote/:id",feature,
     async (req,res) =>{
          try {
               
          
          const {title,description,tag} = req.body;

          //Create a newnote object 
          const newNote = {};
          if (title){newNote.title = title};
          if(description){newNote.description = description};
          if(tag){newNote.tag = tag};

          //Find the note need to updated
          let note =  await Notes.findById(req.params.id)
          if(!note){
               return res.status(404).send("Not Found")
          }
          // Check wether user is accing it's own notes only
          if(req.user.id !== note.user.toString()){
               return res.status(401).send("Not Allowed")
          }

          /// Updating note
          note = await Notes.findByIdAndUpdate(req.params.id,{$set:newNote},{new:true})
          res.json(note)
     }catch (err) {
          console.error(err.message);
        res.status(500).send("Some internal server error")
     }
     }
)

// Route 4 : Deleting a note using : DELETE "/api/notes/deletenote"  . login required
router.delete("/deletenote/:id",feature,
      async(req,res)=>{
          try {

          //Find the note need to delete
          let note =  await Notes.findById(req.params.id)
          if(!note){
               return res.status(404).send("Not Found")
          }
          // Check wether user is accing it's own notes only
          if(req.user.id !== note.user.toString()){
               return res.status(401).send("Not Allowed")
          }
          note = await Notes.findByIdAndDelete(req.params.id);
          res.json({"Sucess":"Note has been deleted",note : note})
     }catch (err) {
          console.error(err.message);
        res.status(500).send("Some internal server error")
     }
      }
     )

module.exports = router