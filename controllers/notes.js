// Create a new router object.
const notesRouter = require('express').Router();
// Import file that connects to MongoDB and creates a Mongoose schema and model.
const Note = require('../models/note');

notesRouter.get('/', async (request, response) => {
    const notes = await Note.find({});
    response.json(notes);
});

notesRouter.get('/:id', (request, response, next) => {
    Note.findById(request.params.id)
        .then(note => {
            if (note) {
                response.json(note);
            } else {
                response.status(404).end();
            }
        })
        .catch(error => next(error));
});

notesRouter.post('/', (request, response, next) => {
    const body = request.body;

    const note = new Note({
        content: body.content,
        important: body.important || false,
        date: new Date()
    });

    note.save()
        .then(savedNote => {
            response.json(savedNote);
        })
        .catch(error => next(error));
});

notesRouter.delete('/:id', (request, response, next) => {
    Note.findByIdAndRemove(request.params.id)
        .then(() => {
            response.status(204).end();
        })
        .catch(error => next(error));
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