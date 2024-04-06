const express = require('express');
const router = express.Router();
const Memo = require('../models/memo');
const url = require('url');



router.get('/memo',async function(req, res,next){
    try {
        const fullUrl = url.resolve('/memos', req.url); 
        console.log(`Fetching data from ${fullUrl}`); 
        const response = await fetch(fullUrl);
        const memos = await response.json();
       console.log(memos)
        res.render('memoForm', { memos });
      } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching memo data');
      }
}
);
// GET all memos
router.get('/memos', async function(req, res) {
    try {
        // Fetch all memos from the database
        const memos = await Memo.findAll();
        res.json(memos);
    } catch (error) {
        console.error('Error fetching memos:', error);
        res.status(500).send('Internal Server Error');
    }
});

// GET memo by ID
router.get('/memo/:id', async function(req, res) {
    const { id } = req.params;
    try {
        // Fetch memo by ID from the database
        const memo = await Memo.findByPk(id);
        if (!memo) {
            return res.status(404).send('Memo not found');
        }
        res.render('memoDetails', { memo });
    } catch (error) {
        console.error('Error fetching memo by ID:', error);
        res.status(500).send('Internal Server Error');
    }
});

// POST create a new memo
router.post('/memo', async function(req, res) {
    const { title, to, from, content } = req.body;
    try {
        // Create a new memo in the database
        const memo = await Memo.create({ title, to, from, content });
        res.status(201).send('Memo created successfully');
    } catch (error) {
        console.error('Error creating memo:', error);
        res.status(500).send('Internal Server Error');
    }
});

// PUT update an existing memo
router.put('/memo/:id', async function(req, res) {
    const { id } = req.params;
    const { title, to, from, content } = req.body;
    try {
        // Update the memo in the database
        const updatedMemo = await Memo.update({ title, to, from, content }, {
            where: { id }
        });
        res.send('Memo updated successfully');
    } catch (error) {
        console.error('Error updating memo:', error);
        res.status(500).send('Internal Server Error');
    }
});

// DELETE delete a memo by ID
router.delete('/memo/:id', async function(req, res) {
    const { id } = req.params;
    try {
        // Delete the memo from the database
        const deletedRows = await Memo.destroy({
            where: { id }
        });
        res.send('Memo deleted successfully');
    } catch (error) {
        console.error('Error deleting memo:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
