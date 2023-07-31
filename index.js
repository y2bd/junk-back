const express = require('express')
const path = require('path')
const fs = require('fs')
const PORT = process.env.PORT || 9232

const BOARDS = 6;

function getBoard(res) {
    const board = Math.floor(Math.random() * BOARDS) + 1

    fs.readFile("status.json", "utf8", function(err, data) {
        if (err) {
            console.error(err);
            res.send("42");
            return;
        }

        const status = JSON.parse(data);

        const board = Math.floor(Math.random() * BOARDS) + 1;
        console.log("Serving board " + board);

        const response = board + "," + String(new Date().getTime()) + "," + status.boards[String(board)].name + "," + status.boards[String(board)].board
        res.send(response);
    });
}

function setBoard(req, res) {
    fs.readFile("status.json", "utf8", function (err, data) {
        if (err) {
            console.error(err);
            return;
        }

        const status = JSON.parse(data);
        status.count += 1;

        const parsed = req.query.data.split(",");
        const boardNum = parsed[0];
        const lm = parsed[1];
        let name = parsed[2];
        const newData = parsed[3];

        if (isNaN(Number(boardNum)) || Number(boardNum) < 1 || Number(boardNum) > 5) {
            return;
        }

        if ((new Date(lm)) == null) {
            return;
        }

        for (let bw of badwords) {
            const check = name.replace(/[0-9-? _]/g, '')
            if (check.indexOf(bw) >= 0) {
                name = ["ld40", "gam3_play3r", "hunter2", "lava_lamp", "xx3lsch0r4h0xx", "testacct", "qwerty", "snowman_emoji"][Math.floor(Math.random() * 8)];
                break;
            }
        }

        if (isNaN(Number(newData)) || !/^(?:[0-7]{10})+$/.test(newData)) {
            return;
        }

        if (Number(lm) > Number(status.boards[boardNum].lm) && Number(lm) < new Date().getTime()) {
            status.boards[boardNum].board = newData;
            status.boards[boardNum].name = name;
            status.boards[boardNum].lm = lm;
	    console.log("actually going into: ")
        }

        const newStatus = JSON.stringify(status);
        console.log(newStatus);
        fs.writeFile("status.json", newStatus, 'utf8', (err) => {
            if (err) {
                console.error(err);
                return;
            }
        });
    });

    console.log(req.param('data'));
    res.send("thanks");
}

let badwords = []
fs.readFile("badwords.txt", "utf8", function (err,data) {
    if (err) {
        console.error(err);
    } else {
        badwords = data.trim().split("\n")
    }

    express()
        .get('/board', (req, res) => getBoard(res))
        .get('/submitboard', (req, res) => setBoard(req, res))
        .listen(PORT, () => console.log(`Listening on ${PORT}`))
});

