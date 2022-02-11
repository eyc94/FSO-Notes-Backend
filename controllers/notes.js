// Create a new router object.
const notesRouter = require('express').Router();
// Import file that connects to MongoDB and creates a Mongoose schema and model.
const Note = require('../models/note');
const User = require('../models/user');

notesRouter.get('/', async (request, response) => {
    const notes = await Note.find({});
    response.json(notes);
});

notesRouter.get('/:id', async (request, response, next) => {
    const note = await Note.findById(request.params.id);
    if (note) {
        response.json(note);
    } else {
        response.status(404).end();
    }
});

notesRouter.post('/', async (request, response, next) => {
    const body = request.body;
    const user = await user.findById(body.userId);

    const note = new Note({
        content: body.content,
        important: body.important || false,
        date: new Date(),
        user: user._id
    });

    const savedNote = await note.save();
    user.notes = user.notes.concat(savedNote._id);
    await user.save();

    response.json(savedNote);
});

notesRouter.delete('/:id', async (request, response, next) => {
    await Note.findByIdAndRemove(request.params.id);
    response.status(204).end();
});

notesRouter.put('/:id', (request, response, next) => {
    const body = request.body;

    const note = {
        content: body.content,
        important: body.important
    };

    Note.findByIdAndUpdate(request.params.id, note, { new: true })
        .then(updatedNote => {
            response.json(updatedNote);
        })
        .catch(error => next(error));
});

// Export router to be available to anyone who imports it.
module.exports = notesRouter;