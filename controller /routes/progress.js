var express = require('express');
var router = express.Router();

// Require team progress model.
var Progress = require('../../model/progress');

// GET team progress home page.
router.get('/', function(req, res, next) {
    return res.render('progress', { title: 'Heriot Watt - Tech Club' });
});

// GET new team progress page form.
router.get('/new', function(req, res, next) {
    return res.render('progressadd', { title: 'Heriot Watt - Tech Club' });
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
            return res.redirect('/progress')
        }
    })

});

// GET team progress individual page listing all the memos.
router.get('/:team', function(req, res, next) {
    // Active and valid team names.
    var teams = ["rocket-team","unity-for-education","web-team"];

    // Get the team name from the parameters.
    var team = req.params.team;

    // Check if the team name is active and valid.
    if (teams.indexOf(team) === -1) {
        return res.redirect("/progress");
    }

    // Create a new query condition to match the team name.
    var query = {
        team: team
    }

    // Query the database and find all the memos with the specified query.
    Progress.find(query, function(err, result) {
        // If any errors, console log it and redirect user to the progress page.
        if (err) {
            console.log(err);
            return res.redirect("/progress");
        }
        // Else, display the team's progress page.
        else {
            return res.render('progressteam', { title: 'Heriot Watt - Tech Club', team: team, progresses: result });
        }
    });
});

// GET team progress individual memo.
router.get('/:team/:memoId', function(req, res, next) {
    // Get the team name from the parameters.
    var team = req.params.team;

    // Get the memo id from the parameters.
    var memoId = req.params.memoId;

    // Create a new query condition to match the team name and the memo id.
    var query = {
        team: team,
        _id: memoId
    }

    // Query the database and find all the memos with the specified query.
    Progress.find(query, function(err, result) {
        // If any errors, console log it and redirect users to the team memo page.
        if (err) {
            console.log(err);
            return res.redirect("/progress/"+team);
        }
        // Else, display the progress memo page.
        else {
            // 
            if (result.length === 0) {
                return res.redirect("/progress/"+team);
            }
            return res.render('progressmemo', { title: 'Heriot Watt - Tech Club', team: team, progress: result[0] });
        }
    });
});

module.exports = router;