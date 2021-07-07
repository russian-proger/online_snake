/**
 * @type {HTMLCanvasElement}
 */
const canvas     = document.getElementById('canvas');
const context    = canvas.getContext('2d');
const MAX_WIDTH  = 30; // кол-во клеток ширины
const MAX_HEIGHT = 30; // кол-во клеток высоты

function update() {
    
}

function render() {
    setTimeout(render, 30);
}
render();
