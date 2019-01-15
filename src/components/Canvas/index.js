import React, { Component } from 'react';
import './style.css';

export default class Canvas extends Component {
    setDrawingMode() {
        const mode = {active: 'draw'};
        this.setState({ mode });
    }

    setNoneMode() {
        const mode = {active: 'none'};
        // const lastInput = currentInputLinePoints[currentInputLinePoints.length - 1];

        this.setState({
            mode: mode,
            // lastInput: null,
            buffer: [],
            // buffer: null,
            // pathA: null,
            // pathB: null,
            // drawingPathPoints: [],
            // pathsForCurrentInput: [],
            currentInputLinePoints: [],

        });
    }

    printServiceLog() {
        console.log(`\nINPUT CAPTURED:`,
            `line-${this.state.inputedLines.length}`,
            `points:${this.state.currentInputLinePoints.length}`
        );
        console.log('points =', this.state.currentInputLinePoints);
        // console.log('just generated pathes = ', this.state.pathsForCurrentInput);
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

        // pathA: null,
        // pathB: null,

        // drawingPath: 0,
        // pathsForCurrentInput: [], // история траекторий
        drawingPathPoints: null // точки текущей траектории отрисовки
    }

    componentDidMount() { // установка обработчиков на готовый canvas
        const canvas = this.refs.canvas;
        const self = this;

        let timer;
        timer = setInterval(() => {

            self.update();
        }, 50);

        // компьютерное управление
        canvas.onmousedown = function drag(event) {
            console.log('\nINPUT STARTED\n');
            self.addPointToCurrentInputLine(event.clientX, event.clientY);
            self.setDrawingMode();
            // setTimeout(() => self.updateScreen(self.state.currentInputLinePoints), 300); //!!!!!!!!
            // if (self.state.buffer.length >= 3) self.update();

            canvas.onmousemove = function move(event) {
                self.addPointToCurrentInputLine(event.clientX, event.clientY);
                // if (self.state.currentInputLinePoints.length >= 3) self.updateDrawingPath();
                // self.updateScreen(); //!!!!!!!!
                // setTimeout(() => self.updateScreen(), 300);
                // self.update();
                // if (self.state.buffer.length >= 3) self.update();
            };

            canvas.onmouseup = function drop(event) {
                // self.addPointToCurrentInputLine(event.clientX, event.clientY);
                self.addCurrentInputLine(self.state.currentInputLinePoints);
                // clearInterval(timer);
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

        // let buffer = this.state.buffer ? this.state.buffer.slice() : [];
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

        // function createPath(iterable, dependent) {
        //
        // }
        // let xs = ys = [];
        // for (let x = xStart; x !== xEnd; x < xEnd ? x+=step : x-=step) {
        //     let y = Math.round(polynomFunction('y', 'x', x));
        //     ys.push(y);
        // };
        // for (let y = yStart; y !== yEnd; y < yEnd ? y+=step : y-=step) {
        //     let x = Math.round(polynomFunction('x', 'y', y));
        //     xs.push(x);
        // };

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
        if (N < 2) return;

        // if (!this.state.buffer) return;

        console.log('\n--UPDATE START--\n');
        console.log('_BUFFER_: ', this.state.buffer);

        let drawingPathPoints = []; // итоговые точки траектории этапа

        while (this.state.buffer.length > 1) {
            let buffer = this.state.buffer;
            const dx = Math.abs(buffer[0].x - buffer[1].x);
            const dy = Math.abs(buffer[0].y - buffer[1].y);

            let stage;
            if (dx > 20 || dy > 20) {
                stage = buffer.slice(0, 3);
                stage = this.generateDrawingPath(stage);
                console.log('curve generated: ', stage);
                stage.forEach((point) => drawingPathPoints.push(point));
            } else {
                stage = buffer.slice(0, 2);
                console.log('line on input stage: ', stage);
                stage.forEach((point) => drawingPathPoints.push(point));
            }

            let last = stage[stage.length-1];
            if (!last) last = [];

            buffer = [].concat(last, this.state.buffer.slice(3));
            console.log('~BUFFER: ', buffer);
            this.setState({ buffer });
        }

        // this.setState({ buffer });

        console.log('drawingPathPoints: ', drawingPathPoints);
        console.log('--UPDATE END--\n');


        if (drawingPathPoints.length) this.drawPath(drawingPathPoints);
        // this.setState({ buffer: [].concat(buffer, this.state.buffer) });
    }

    // generateDrawingPathFromPoints(inputPoints) {
    //     // const N = 3;
    //     const N = inputPoints.length;
    //
    //     function generatePolynomFunctionText(argName, valueName) {
    //         const basisPolynomsFunctionTexts = inputPoints.map((point, i, arr) => {
    //             let basisPolynomFunctionText = '';
    //             for (let j = 0; j < N; j++) {
    //                 if (i === j) continue;
    //                 // const member = `(x-${arr[j].x}[${j}])/(${point.x}[${i}]-${arr[j].x}[${j}])`;
    //                 let member = `((${argName}-${arr[j][argName]})/(${point[argName]}-${arr[j][argName]}))`;
    //
    //                 basisPolynomFunctionText += member + '*';
    //             }
    //             return basisPolynomFunctionText.slice(0, -1); //страем последнюю звездочку:))
    //         });
    //
    //         const text = basisPolynomsFunctionTexts.reduce((formula, basis, i) => {
    //                 const polynom = `${inputPoints[i][valueName]}*( ${basis} ) + `;
    //                 return formula + polynom;
    //         }, 'return ').slice(0, -3);
    //
    //         console.log(text);
    //
    //         return text;//страем последний плюсик:))
    //     }
    //
    //     const polynomFunctionX = new Function( 'x', generatePolynomFunctionText('x', 'y') );
    //     const polynomFunctionY = new Function( 'y', generatePolynomFunctionText('y', 'x') );
    //
    //     // console.log('polynomFunction(): \n', polynomFunctionText);
    //
    //     let {x:xStart, y:yStart} = inputPoints[0];
    //     let {x:xEnd, y:yEnd} = inputPoints[N-1];
    //
    //     function createPath(xStart, yStart, xEnd, yEnd) {
    //         let path = [];
    //         let x = xStart, y = yStart;
    //         const dX = Math.abs(xEnd-xStart), dY = Math.abs(yEnd-yStart);
    //         const step = 1;
    //
    //         if (dX === 0 || dY === 0) { // горизонтальная и вертикальная линии
    //             if (dX === 0 && dY !== 0) {
    //                 while (y !== yEnd) {
    //                     path.push({
    //                         x: x,
    //                         y: y
    //                     });
    //                     y < yEnd ? y+=step : y-=step;
    //                 };
    //             };
    //             if (dX !== 0 && dY === 0) {
    //                 while (x !== xEnd) {
    //                     path.push({
    //                         x: x,
    //                         y: y
    //                     });
    //                     x < xEnd ? x+=step : x-=step;
    //                 };
    //             };
    //         } else { // наклонные линии
    //             if (dX >= dY) {
    //                 while (x !== xEnd) {
    //                     let y = polynomFunctionX(x+0.001);
    //                     if (y !== Infinity) path.push({
    //                         x: x,
    //                         y: y
    //                     });
    //                     x < xEnd ? x+=step : x-=step;
    //                 };
    //             };
    //             if (dX < dY) {
    //                 while (y !== yEnd) {
    //                     let x = polynomFunctionY(y+0.001);
    //                     if (x !== Infinity) path.push({
    //                         x: x,
    //                         y: y
    //                     });
    //                     y < yEnd ? y+=step : y-=step;
    //                 };
    //             };
    //         };
    //
    //
    //
    //         // console.dir(path);
    //         return path;
    //     }
    //
    //     let path = createPath(xStart, yStart, xEnd, yEnd);
    //     if (path.length === 0) path = inputPoints;
    //     return path;
    // }

    // updateScreen() { // обновление canvas
    //     const {x, y} = this.state.currentInputLinePoints[this.state.currentInputLinePoints.length - 1];
    //     this.drawPoint(x, y);
    //     if (this.state.drawingPathPoints.length) this.drawPath();
    // }

    drawPath(drawingPathPoints) {
        if (drawingPathPoints === null) return;
        // if (drawingPathPoints.length < 2) return;

        const canvas = this.refs.canvas;
        const ctx = canvas.getContext('2d');
        // console.log(drawingPathPoints);

        ctx.save();
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 3;
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
        ctx.fillStyle = 'red'; // кружок
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI*2);
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
