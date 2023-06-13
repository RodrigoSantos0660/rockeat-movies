const{ Router } = require( "express" );

const NoteController = require("../controllers/NoteController");

const notesRoutes = Router();

const noteController = new NoteController();

notesRoutes.get("/", noteController.index);
notesRoutes.post("/:user_id", noteController.create);
notesRoutes.get("/:id", noteController.show);
notesRoutes.delete("/:id", noteController.delete);

module.exports = notesRoutes