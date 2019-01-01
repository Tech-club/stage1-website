var express = require('express');
var router = express.Router();

// Require team progress model.
var Progress = require('../../model/progress');

// GET team progress home page.
router.get('/', function(req, res, next) {
    res.render('progress', { title: 'Heriot Watt - Tech Club' });
});

// GET new team progress page form.
router.get('/new', function(req, res, next) {
    res.render('addprogress', { title: 'Heriot Watt - Tech Club' });
});

// POST new team progress.
router.post('/', function(req, res, next) {

    // Get the data from the new team progress form.
    var team = req.body.TeamName;
    var date = req.body.MemoDate;
    var subject = req.body.MemoSubject;
    var memo = req.body.MemoDesciption;
    
    // Create a prototype object with the data required to create a new progress.
    var newProgress = {
        team: team,
        date: date,
        subject: subject,
        memo: memo
    }

    // Create a new progress and store it.
    Progress.create(newProgress, function(err, newlyCreated) {
        // If any errors, console log it.
        if (err) {
            console.log(err);
        }
        // If the new progress is created and stored successfully, redirect the user to the progress home page.
        else {
            res.redirect('/progress')
        }
    })

});

// GET team progress individual page.
router.get('/:team', function(req, res, next) {
    // Get the team name from the parameters.
    var team = req.params.team;

    // Create a new query condition to match the team name.
    var query = {
        team: team
    }

    // Query the database and find all the memos with the specified query.
    Progress.find(query, function(err, result) {
        // If any errors, console log it.
        if (err) {
            console.log(err);
        }
        // Else, display the team's progress page.
        else {
            res.render('teamprogress', { title: 'Heriot Watt - Tech Club', team: team, progresses: result });
        }
    });
});

module.exports = router;