const express = require('express')
const path = require('path')
const fs = require('fs')
const PORT = process.env.PORT || 5000

const BOARDS = 5;

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

        const response = board + "," + String(new Date().getTime()) + "," + status.boards[String(board)].board
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
        const newData = parsed[2];

        if (isNaN(Number(boardNum)) || Number(boardNum) < 1 || Number(boardNum) > 5) {
            return;
        }

        if ((new Date(lm)) == null) {
            return;
        }

        if (isNaN(Number(newData))) {
            return;
        }

        if (Number(lm) > Number(status.boards[boardNum].lm)) {
            status.boards[boardNum].board = newData;
            status.boards[boardNum].lm = lm;
        }

        const newStatus = JSON.stringify(status);
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

express()
    .use(express.static(path.join(__dirname, 'public')))
    .set('views', path.join(__dirname, 'views'))
    .set('view engine', 'ejs')
    .get('/board', (req, res) => getBoard(res))
    .get('/submitboard', (req, res) => setBoard(req, res))
    .listen(PORT, () => console.log(`Listening on ${PORT}`))
