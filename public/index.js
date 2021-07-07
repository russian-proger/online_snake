/**
 * @type {HTMLCanvasElement}
 */
const canvas     = document.getElementById('canvas');
const context    = canvas.getContext('2d');

const MAX_WIDTH  = 30; // Кол-во клеток ширины
const MAX_HEIGHT = 30; // Кол-во клеток высоты
const CELL_WIDTH = 20; // Размер клетки в пикселях

const DIRECTIONS = ({
    Left: "left",
    Right: "right",
    Up: "up",
    Down: "down"
});

// Карта цветов
let colorsMap = new Array(MAX_HEIGHT).fill(null).map(() => new Array(MAX_WIDTH));

let player = new Player();

function Player() {
    this.x = 0;
    this.y = 0;
    this.color = "#00ff00";
    this.direction = DIRECTIONS.Right;

    this.update = function() {
        switch (this.direction) {
            case DIRECTIONS.Left: {
                --this.x;
                break;
            }
            case DIRECTIONS.Right: {
                ++this.x;
                break;
            }
            case DIRECTIONS.Up: {
                --this.y;
                break;
            }
            case DIRECTIONS.Down: {
                ++this.y;
                break;
            }
        }
    }

    this.render = function() {
        colorsMap[this.y][this.x] = this.color;
    }
}

// Обновление игровых объектов
function update() {
    // Сброс карты цветов в чёрный цвет
    for (let i = 0; i < MAX_HEIGHT; ++i) {
        for (let j = 0; j < MAX_WIDTH; ++j) {
            colorsMap[i][j] = "#000000";
        }
    }

    player.update();
    player.render();
}

// Визуализация (Рисование)
function render() {
    // Обновление состояния
    update();

    // Отрисовка карты цветов
    for (let i = 0; i < MAX_HEIGHT; ++i) {
        for (let j = 0; j < MAX_WIDTH; ++j) {
            context.fillStyle = colorsMap[i][j];
            context.fillRect(j * CELL_WIDTH, i * CELL_WIDTH, CELL_WIDTH, CELL_WIDTH);
        }
    }

    // Вызов повторной отрисовки
    setTimeout(render, 30);
}

// Инициализация. Вызывается один раз
function init() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;

    render();
}

init();
