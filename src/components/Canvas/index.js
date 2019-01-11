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
            // drawingPathPoints: [],
            // pathsForCurrentInput: [],
            currentInputLinePoints: []
        });
    }

    printServiceLog() {
        console.log(`\nINPUT CAPTURED:`,
            `line-${this.state.inputLines.length}`,
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

        // inputedPointsCnt: 0,
        inputLines: [], // история входных линий
        currentInputLinePoints: [], // точки текущей входной линии

        // drawingPath: 0,
        // pathsForCurrentInput: [], // история траекторий
        drawingPathPoints: [] // точки текущей траектории
    }

    componentDidMount() { // установка обработчиков на готовый canvas
        const canvas = this.refs.canvas;
        const self = this;

        // компьютерное управление
        canvas.onmousedown = function drag(event) {
            self.addPointToCurrentInputLine(event.clientX, event.clientY);
            self.setDrawingMode();
            self.updateScreen();

            canvas.onmousemove = function move(event) {
                self.addPointToCurrentInputLine(event.clientX, event.clientY);
                if (self.state.currentInputLinePoints.length >= 3) self.updateDrawingPath();
                self.updateScreen();
            };

            canvas.onmouseup = function drop(event) {
                // self.addPointToCurrentInputLine(event.clientX, event.clientY);
                self.addCurrentInputLine(self.state.currentInputLinePoints);

                // cлужебная информация в консоль
                self.printServiceLog();

                self.setNoneMode();

                canvas.onmousemove = canvas.onmouseup = null;
            };
        };
    }

    addPointToCurrentInputLine(x, y) {
        const currentInputLinePoints = this.state.currentInputLinePoints.slice();
        currentInputLinePoints.push({x: x, y: y});
        this.setState({
            currentInputLinePoints,
            inputedPointsCnt: this.state.inputedPointsCnt + 1
         });
    }

    addCurrentInputLine(currentInputLinePoints) {
        const inputPoints = currentInputLinePoints.slice();
        const inputLines = this.state.inputLines.slice();
        inputLines.push(inputPoints);
        this.setState({ inputLines });
    }

    updateDrawingPath() {
        const drawingPathPoints = this.generateDrawingPathFromPoints(this.state.currentInputLinePoints.slice(-3));
        this.setState({
            drawingPathPoints,
        });
    }

    generateDrawingPathFromPoints(inputPoints) {
        const N = 3;

        function generateFunctionText(argName, valueName) {
            const basisPolynomsFunctionTexts = inputPoints.map((point, i, arr) => {
                let basisPolynomFunctionText = '';
                for (let j = 0; j < N; j++) {
                    if (i === j) continue;
                    // const member = `(x-${arr[j].x}[${j}])/(${point.x}[${i}]-${arr[j].x}[${j}])`;
                    const member = `((${argName}-${arr[j][argName]})/(${point[argName]}-${arr[j][argName]}))`;
                    basisPolynomFunctionText += member + '*';
                }
                return basisPolynomFunctionText.slice(0, -1);
            });

            return basisPolynomsFunctionTexts.reduce((formula, basis, i) => {
                    const polynom = `${inputPoints[i][valueName]}*( ${basis} ) + `;
                    return formula + polynom;
            }, 'return ').slice(0, -3);
        }

        const polynomFunctionX = new Function('x', generateFunctionText('x', 'y'));
        const polynomFunctionY = new Function('y', generateFunctionText('y', 'x'));

        // console.log('polynomFunctionText: \n', polynomFunctionText);

        let {x:xStart, y:yStart} = inputPoints[0];
        let {x:xEnd, y:yEnd} = inputPoints[N-1];

        let path = [];
        let x = xStart, y = yStart;
        const dX = Math.abs(xEnd-xStart), dY = Math.abs(yEnd-yStart);
        const step = 0.5;


        if (dX === 0 || dY === 0) {
            if (dX === 0 && dY !== 0) {
                while (y !== yEnd) {
                    path.push({
                        x: x,
                        y: y
                    });
                        y < yEnd ? y+=step : y-=step;
                };
            };
            if (dX !== 0 && dY === 0) {
                while (x !== xEnd) {
                    path.push({
                        x: x,
                        y: y
                    });
                        x < xEnd ? x+=step : x-=step;
                };
            }
        } else {
            if (dX >= dY) {
                while (x !== xEnd) {
                    path.push({
                        x: x,
                        y: polynomFunctionX(x)
                    });
                        x < xEnd ? x+=step : x-=step;
                };
            };
            if (dX < dY) {
                while (y !== yEnd) {
                    path.push({
                        x: polynomFunctionY(y),
                        y: y
                    });
                    y < yEnd ? y+=step : y-=step;
                };
            };
        };

        // console.dir(path);
        return path;
    }

    updateScreen() { // обновление canvas
        const {x, y} = this.state.currentInputLinePoints[this.state.currentInputLinePoints.length - 1];
        this.drawPoint(x, y);
        if (this.state.drawingPathPoints.length) this.drawPath();
    }

    drawPath() {
        const canvas = this.refs.canvas;
        const ctx = canvas.getContext('2d');
        const drawingPathPoints = this.state.drawingPathPoints.slice();
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
        ctx.fillStyle = 'black'; // кружок
        ctx.beginPath();
        ctx.arc(x, y, 1.5, 0, Math.PI*2);
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
