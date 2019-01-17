import React, { Component } from 'react';
import './style.css';

export default class Canvas extends Component {
    setDrawingMode() {
        const mode = {active: 'draw'};
        this.setState({ mode });
    }

    setNoneMode() {
        const mode = {active: 'none'};
        this.setState({
            mode: mode,
            buffer: [],
            currentInputLinePoints: [],
        });
    }

    printServiceLog() {
        console.log(`\nINPUT CAPTURED:`,
            `line-${this.state.inputedLines.length}`,
            `points:${this.state.currentInputLinePoints.length}`
        );
        console.log('points =', this.state.currentInputLinePoints);
    }

    state = {
        mode: {
            active: 'none',
            store: ['none', 'draw', 'earse']
        },

        buffer: [],

        inputedLines: [], // история входных линий
        lastInput: null,

        currentInputLinePoints: [], // точки текущей входной линии
        drawingPathPoints: null // точки текущей траектории отрисовки
    }

    componentDidMount() { // установка обработчиков на готовый canvas
        const canvas = this.refs.canvas;
        const self = this;

        let timer;
        timer = setInterval(() => {
            self.update();
        }, 40);

        // компьютерное управление
        canvas.onmousedown = function drag(event) {
            console.log('\nINPUT STARTED\n');
            self.addPointToCurrentInputLine(event.clientX, event.clientY);
            self.setDrawingMode();

            canvas.onmousemove = function move(event) {
                self.addPointToCurrentInputLine(event.clientX, event.clientY);
            };

            canvas.onmouseup = function drop(event) {
                self.addCurrentInputLine(self.state.currentInputLinePoints);

                // cлужебная информация в консоль
                self.printServiceLog();

                self.setNoneMode();

                canvas.onmousemove = canvas.onmouseup = null;
            };
        };
    }

    addPointToCurrentInputLine(x, y) {
        let currentInputLinePoints = this.state.currentInputLinePoints.slice();
        currentInputLinePoints.push({x: x, y: y});

        let buffer = this.state.buffer.slice();
        buffer.push(currentInputLinePoints[currentInputLinePoints.length-1]);

        this.setState({ currentInputLinePoints, buffer });
    }

    addCurrentInputLine(currentInputLinePoints) {
        const inputPoints = currentInputLinePoints.slice();
        const inputedLines = this.state.inputedLines.slice();
        inputedLines.push(inputPoints);
        this.setState({ inputedLines });
    }

    generateDrawingPath(inputPoints) {
        const N = inputPoints.length;

        function polynomFunction(valuePointName, argPointName, argValue) { // интерполяция многочленом Лагранжа
            let value = inputPoints.reduce((sum, point, i, points) => {
                let polynom = 1;
                for (let j = 0; j < N; j++) {
                    if (i === j) continue;
                    let numerator = argValue - points[j][argPointName];
                    let denominator = points[i][argPointName] - points[j][argPointName];

                    let member = numerator / denominator;

                    if (denominator === 0) member = 1;

                    polynom *= member;
                    // console.log(numerator, denominator, member, polynom);
                }
                if (polynom === Infinity) polynom = 0;
                // console.log(polynom);
                return sum + points[i][valuePointName] * polynom;
            }, 0);

            return value;
        }

        const {x:xStart, y:yStart} = inputPoints[0];
        const {x:xEnd, y:yEnd} = inputPoints[N-1];

        let path = [];
        const step = 1;

        const dx = Math.abs(xStart-xEnd);
        const dy = Math.abs(yStart-yEnd);

        if (dx >= dy) {
            for (let x = xStart; x !== xEnd; x < xEnd ? x+=step : x-=step) {
                let y = polynomFunction('y', 'x', x);
                let diff = Math.abs(x-xStart);
                if (y === 0) y = yStart + diff;
                path.push({x: x, y: y});
            }
        } else {
            for (let y = yStart; y !== yEnd; y < yEnd ? y+=step : y-=step) {
                let x = polynomFunction('x', 'y', y);
                let diff = Math.abs(y-yStart);
                if (x === 0) x = xStart + diff;
                path.push({x: x, y: y});
            }
        }

        return path;
    }

    update() {
        const input = this.state.currentInputLinePoints.slice();
        const N = input.length;
        if (N > 0) this.drawPoint(input[input.length-1].x, input[input.length-1].y);
        if (N < 3) return;

        console.log('\n--UPDATE START--\n');
        console.log('_BUFFER_: ', this.state.buffer);

        let drawingPathPoints = []; // итоговые точки траектории этапа

        // сохраняем буфер в функции и очищаем его
        let buffer = this.state.buffer;
        if (buffer.length < 3) return;
        this.setState({ buffer: [].concat(buffer[buffer.length-1]) });

        while (buffer.length > 1) {
            const dx = Math.abs(buffer[0].x - buffer[1].x);
            const dy = Math.abs(buffer[0].y - buffer[1].y);

            let stage;
            if (buffer.length >= 3 && (dx > 20 || dy > 20)) { // кривая
                stage = buffer.slice(0, 3);
                stage = this.generateDrawingPath(stage);
                console.log('curve generated: ', stage);
                // обрезаем буфер, сохраняя последнюю точку этапа
                buffer = buffer.slice(2);
            } else { // прямая
                stage = buffer.slice(0, 2);
                console.log('line on input stage: ', stage);
                // обрезаем буфер, сохраняя последнюю точку этапа
                buffer = buffer.slice(1);
            }

            stage.forEach((point) => drawingPathPoints.push(point));
        }

        console.log('drawingPathPoints: ', drawingPathPoints);
        console.log('--UPDATE END--\n');

        if (drawingPathPoints.length) this.drawPath(drawingPathPoints);
    }

    drawPath(drawingPathPoints) {
        const canvas = this.refs.canvas;
        const ctx = canvas.getContext('2d');

        ctx.save();
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 4;
        ctx.beginPath();

        ctx.moveTo(drawingPathPoints[0].x, drawingPathPoints[0].y);
        for (let i = 1; i < drawingPathPoints.length; i++) {
            ctx.lineTo(drawingPathPoints[i].x, drawingPathPoints[i].y);
        };

        ctx.stroke();
        ctx.restore();
    }

    drawPoint(x, y) {
        const canvas = this.refs.canvas;
        const ctx = canvas.getContext('2d');

        ctx.save();
        ctx.fillStyle = 'black'; // кружок
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI*2);
        ctx.fill();
        ctx.restore();
    }

    render() {
        return (
            <canvas
                width={this.props.width}
                height={this.props.height}
                ref='canvas'
            ></canvas>
        )
    }

}
