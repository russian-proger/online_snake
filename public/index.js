/**
 * @type {HTMLCanvasElement}
 */
const canvas     = document.getElementById('canvas');
const context    = canvas.getContext('2d');

const MAX_WIDTH  = 80; // Кол-во клеток ширины
const MAX_HEIGHT = 80; // Кол-во клеток высоты
const CELL_WIDTH = 10; // Размер клетки в пикселях

const DIRECTIONS = ({
    Left: "left",
    Right: "right",
    Up: "up",
    Down: "down"
});

// Карта цветов
let colorsMap = new Array(MAX_HEIGHT).fill(null).map(() => new Array(MAX_WIDTH));

/** @type {Network} */
let network;
let positions = [];
function Network() {
    /** @type {WebSocket} */
    this.ws;
    this.isReady = false;

    this.init = () => {
        this.ws = new WebSocket(`ws://${window.location.host}:8080`);
        
        this.ws.onopen = () => {
            console.log("Установлено соединение с сервером");
            this.isReady = true;
        }

        this.ws.onmessage = ev => {
            let json = JSON.parse(ev.data);
            positions = Object.values(json);
        }

        this.ws.onclose = () => {
            console.warn("Соединение с сервером прервано");
            this.isReady = false;
        }
    }

    this.sendPosition = (x, y) => {
        if (this.isReady) {
            let data = ({ x, y });
            this.ws.send(JSON.stringify(data));
        }
    }
}

/** @type {Player} */
let player;

function Player() {
    this.x = 0;
    this.y = 0;

    this.color = "#00ff00";
    this.direction = DIRECTIONS.Right;

    /**
     * @param {KeyboardEvent} ev
     */
    const onKeyDown = (ev) => {
        switch (ev.key) {
            case "w":
            case "ArrowUp": {
                this.direction = DIRECTIONS.Up;
                break;
            }
            case "s":
            case "ArrowDown": {
                this.direction = DIRECTIONS.Down;
                break;
            }
            case "a":
            case "ArrowLeft": {
                this.direction = DIRECTIONS.Left;
                break;
            }
            case "d":
            case "ArrowRight": {
                this.direction = DIRECTIONS.Right;
                break;
            }
        }
    }

    // Вызывается один раз
    this.init = () => {
        window.addEventListener('keydown', onKeyDown);
    }

    // Функция движения
    const move = () => {
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

        if (this.x < 0) this.x += MAX_WIDTH ;
        if (this.y < 0) this.y += MAX_HEIGHT;
        
        if (this.x >= MAX_WIDTH ) this.x %= MAX_WIDTH ;
        if (this.y >= MAX_HEIGHT) this.y %= MAX_HEIGHT;
    }

    let lastUpdate = 0;
    // Функция обновления
    this.update = () => {
        let now = Date.now();
        if (now - lastUpdate > 30) {
            lastUpdate = now;
            move();
            network.sendPosition(this.x, this.y);
        }
    }

    // Функция отрисовки объекта на карте
    this.render = function() {
        colorsMap[this.y][this.x] = this.color;
    }

    this.release = () => {
        window.removeEventListener('keydown', onKeyDown);
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
    positions.forEach(v => {
        colorsMap[v.y][v.x] = "#ffff00";
    })

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
            context.fillRect(j * CELL_WIDTH + (canvas.width - CELL_WIDTH * MAX_WIDTH) / 2, i * CELL_WIDTH + (canvas.height - CELL_WIDTH * MAX_HEIGHT) / 2, CELL_WIDTH, CELL_WIDTH);
        }
    }

    // Вызов повторной отрисовки
    setTimeout(render, 15);
}

// Инициализация. Вызывается один раз
function init() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;

    network = new Network();
    network.init();

    player = new Player();
    player.init();

    render();
}

init();
