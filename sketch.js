/// <reference path="./node_modules/@types/p5/global.d.ts" />


//Computer Weights

const WEIGHT_COMPUTER = 3, WEIGHT_PLAYER = 4, WEIGHT_EMPTY = 1, WEIGHT_POPULATED = 5, WEIGHT_STREAK_PLAYER = 5, WEIGHT_STREAK_COMPUTER = 6;

const DIRECTIONS = [[1, 0], [-1, 1], [0, 1], [1, 1]];

//Other Values

const ROWS = 6;
const COLS = 6;
const CONNECT = 4;

const EMPTY = 0, PLAYER = 1, COMPUTER = 2, TIE = 3, PLAYING = 4;

const COLOR = {}
COLOR[EMPTY] = "#FFFFFF";
COLOR[PLAYER] = "#00FF00";
COLOR[COMPUTER] = "#FF0000";


let board;


function setup() {
    createCanvas(800, 800);
    newBoard();
}

function draw() {
    background(220);
    renderBoard();
}

function renderBoard() {
    strokeWeight(1);
    stroke('black');

    const w = width / COLS;
    const h = height / ROWS;

    for (var x = 0; x < COLS; x++) {
        for (var y = 0; y < ROWS; y++) {
            fill(COLOR[board[y][x]]);
            rect(x * w, y * h, w, h);
        }
    }
}

function newBoard() {
    board = Array.from({ length: ROWS }, () => Array.from({ length: COLS }, () => 0));
}

function move(player, x, y) {
    if (board[y][x] == EMPTY) {
        board[y][x] = player;
        return true;
    } else {
        return false;
    }
}

function mouseClicked() {
    var x = int(mouseX * COLS / width);
    var y = int(mouseY * ROWS / height);
    if (move(PLAYER, x, y)) {
        moveComputer();
    }
}

function moveComputer() {
    let bestMoves = []
    let currentEval = 0;

    for (var x = 0; x < COLS; x++) {
        for (var y = 0; y < ROWS; y++) {
            const eval_computer = evaluateLocation(x, y, COMPUTER) * WEIGHT_COMPUTER;
            const eval_player = evaluateLocation(x, y, PLAYER) * WEIGHT_PLAYER;
            const eval = eval_computer + eval_player;

            if (eval > currentEval) {
                currentEval = eval;
                bestMoves = [[x,y]];
            } else if (currentEval == eval) {
                bestMoves.push([x, y]);
            }
        }
    }

    let chosenMove = bestMoves[int(Math.random() * bestMoves.length)];
    move(COMPUTER, chosenMove[0], chosenMove[1]);
}

function evaluateLocation(x, y, player) {
    if (board[y][x] != EMPTY) {
        return -1;
    }

    let eval = 0;

    DIRECTIONS.forEach(direction => [-1, 1].forEach(c => {
        let countEmpty = 0, countPopulated = 0;
        for (var i = 0; i < CONNECT; i++) {
            var nx = x + direction[0] * i * c, ny = y + direction[1] * i * c;
            if (nx >= 0 && nx < COLS && ny >= 0 && ny < ROWS) {
                const loc = board[ny][nx];
                if (loc == EMPTY) {
                    countEmpty++;
                } else if (loc == player) {
                    countPopulated++;
                } else {
                    break;
                }
            }
        }
        if (countEmpty + countPopulated >= CONNECT - 1) {
            eval += int((countEmpty + WEIGHT_EMPTY + countPopulated * WEIGHT_POPULATED) * Math.pow(player == PLAYER ? WEIGHT_STREAK_PLAYER : WEIGHT_STREAK_COMPUTER, countPopulated));
        }
    }));


    return eval;
}