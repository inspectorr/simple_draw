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
            currentInputLinePoints: []
        });
    }

    printServiceLog() {
        console.log(`\nINPUT CAPTURED:`,
            `line-${this.state.inputLines.length}`,
            `points:${this.state.currentInputLinePoints.length}`
        );
        console.log('points =', this.state.currentInputLinePoints);
    }

    state = {
        mode: {
            active: 'none',
            store: ['none', 'draw', 'earse']
        },

        inputLines: [], // история входных линий
        currentInputLinePoints: [], // точки текущей входной линии

        paths: [], // история траекторий
        currentPathPoints: [] // точки текущей траектории
    }


    componentDidMount() { // установка обработчиков на готовый canvas
        const canvas = this.refs.canvas;
        const self = this;

        // компьютерное управление
        canvas.onmousedown = function drag(event) {
            self.setDrawingMode();

            self.addPointToCurrentInputLine(event.clientX, event.clientY);

            canvas.onmousemove = function move(event) {
                self.addPointToCurrentInputLine(event.clientX, event.clientY);
            };

            canvas.onmouseup = function drop(event) {
                // self.addPointToCurrentInputLine(event.clientX, event.clientY);
                self.addCurrentInputLine(self.state.currentInputLinePoints);

                // cлужебная информация в консоль
                self.printServiceLog();


                self.generateCurrentPath(self.state.currentInputLinePoints);


                self.setNoneMode();

                canvas.onmousemove = canvas.onmouseup = null;
            };
        };
    }

    addPointToCurrentInputLine(x, y) {
        const currentInputLinePoints = this.state.currentInputLinePoints.slice();
        currentInputLinePoints.push({x: x, y: y});
        this.setState({ currentInputLinePoints });
    }

    addCurrentInputLine(currentInputLinePoints) {
        const inputPoints = currentInputLinePoints.slice();
        const inputLines = this.state.inputLines.slice();
        inputLines.push(inputPoints);
        this.setState({ inputLines });
    }

    generateCurrentPath(currentInputLinePoints) {
        const inputPoints = currentInputLinePoints.slice();
        const N = inputPoints.length;
        if (N < 3) return null;

        const basisPolynomsFunctionTexts = inputPoints.map((point, i, arr) => {
            let basisPolynomFunctionText = '';
            for (let j = 0; j < N; j++) {
                if (i === j) continue;
                // const member = `(x-${arr[j].x}[${j}])/(${point.x}[${i}]-${arr[j].x}[${j}])`;
                const member = `((x-${arr[j].x})/(${point.x}-${arr[j].x}))`;
                basisPolynomFunctionText += member + '*';
            }
            return basisPolynomFunctionText.slice(0, -1);
        });

        const polynomFunctionText = basisPolynomsFunctionTexts.reduce((formula, basis, i) => {
                const y = inputPoints[i].y;
                const polynom = `${y}*( ${basis} ) + `;
                return formula + polynom;
        }, 'return ').slice(0, -2);

        console.log('polynomFunctionText: \n', polynomFunctionText);

        const polynomFunction = new Function('x', polynomFunctionText);

        let {x:xStart, y:yStart} = currentInputLinePoints[0];
        let {x:xEnd, y:yEnd} = currentInputLinePoints[N-1];

        let path = [];
        let x = xStart, y = yStart;
        const dX = Math.abs(xEnd-xStart), dY = Math.abs(yEnd-yStart);


        if (dX === 0 || dY === 0) { // прямые
            while (x !== xEnd) {
                path.push({x: x, y: y});
                x < xEnd ? x++ : x--;
            };
            while (y !== yEnd) {
                path.push({x: x, y: y});
                y < yEnd ? y++ : y--;
            };
        } else { // кривые
            if (dX <= dY) {
                while (x !== xEnd) {
                    path.push({
                        x: x,
                        y: polynomFunction(x)
                    });
                    x < xEnd ? x++ : x--;
                };
            };
            if (dX > dY) {
                while (y !== yEnd) {
                    path.push({
                        x: polynomFunction(y),
                        y: y
                    });
                    y < yEnd ? y++ : y--;
                };
            };
        }

        // if (xStart === xEnd && yStart !== yEnd) { // вер
        //     while (y !== yEnd) {
        //         path.push({x: x, y: y});
        //         y < yEnd ? y++ : y--;
        //     };
        // } else if (yStart === yEnd && xStart !== xEnd) {
        //     while (x !== xEnd) {
        //         path.push({x: x, y: y});
        //         x < xEnd ? x++ : x--;
        //     };
        // } else if () {
        //     while (x !== xEnd) {
        //         path.push({
        //             x: x,
        //             y: polynomFunction(x)
        //         });
        //         x < xEnd ? x++ : x--;
        //     };
        // };

        console.dir(path);
        return path;
    }

    shouldComponentUpdate() {
        return this.state.mode.active !== 'none';
    }

    componentDidUpdate(prevProps, prevstate, snapshot) {
        this.updateScreen(); // обновление экрана
    }

    updateScreen() { // обновление canvas
        if (this.state.currentInputLinePoints.length === 0) return;
        const {x, y} = this.state.currentInputLinePoints[this.state.currentInputLinePoints.length - 1];
        this.draw(x, y);
    }

    draw(x, y) {
        const canvas = this.refs.canvas;
        // const canvasWidth = this.props.width;
        // const canvasHeight = this.props.height;
        const ctx = canvas.getContext('2d');
        drawRound(x, y);

        function drawRound(x, y) {
            ctx.save();
            ctx.fillStyle = 'red'; // кружок
            ctx.beginPath();
            ctx.arc(x, y, 10, 0, Math.PI*2);
            ctx.fill();
            ctx.restore();
        }
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
