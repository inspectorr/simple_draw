import React, { Component } from 'react';
import './style.css';

export default class Canvas extends Component {
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

    setDrawingMode() {
        const mode = {active: 'draw'};
        this.setState({ mode });
    }

    setNoneMode() {
        const mode = {active: 'none'};
        this.setState({
            mode: mode,
            currentLinePoints: []
        });
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
                self.addPointToCurrentInputLine(event.clientX, event.clientY);
                self.addCurrentInputLine(self.state.currentInputLinePoints);

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

    shouldComponentUpdate() {
        return this.state.mode.active !== 'none';
    }

    printInputLog() {
        console.log('\nINPUT:\n');
        console.log('lines =', this.state.inputLines);
        console.log('points =', this.state.currentInputLinePoints);
    }

    componentDidUpdate(prevProps, prevstate, snapshot) {
        this.updateScreen(); // обновление экрана

        // cлужебная информация 
        this.printInputLog();
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

        // function drawLine() {
        //
        // }


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
