import React, { Component } from 'react';
import './style.css';

export default class Canvas extends Component {
    state = {
        lines: [],
        currentLinePoints: [],
        mode: {
            active: 'none',
            store: ['none', 'draw', 'earse']
        }
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

            self.addPointToCurrentLine(event.clientX, event.clientY);

            canvas.onmousemove = function move(event) {
                self.addPointToCurrentLine(event.clientX, event.clientY);
            };

            canvas.onmouseup = function drop(event) {
                self.addPointToCurrentLine(event.clientX, event.clientY);
                self.addCurrentLine(self.state.currentLinePoints);

                self.setNoneMode();

                canvas.onmousemove = canvas.onmouseup = null;
            };
        };
    }

    addPointToCurrentLine(x, y) {
        const currentLinePoints = this.state.currentLinePoints.slice();
        currentLinePoints.push({x: x, y: y});
        this.setState({ currentLinePoints });
    }

    addCurrentLine(currentLinePoints) {
        const points = currentLinePoints.slice();
        const lines = this.state.lines.slice();
        lines.push(points);
        this.setState({ lines });
    }

    shouldComponentUpdate() {
        return this.state.mode.active !== 'none';
    }

    componentDidUpdate(prevProps, prevstate, snapshot) {
        this.updateScreen(); // обновление экрана
        console.log(this.state.lines, this.state.currentLinePoints);
    }

    updateScreen() { // обновление canvas
        if (this.state.currentLinePoints.length === 0) return;
        const {x, y} = this.state.currentLinePoints[this.state.currentLinePoints.length - 1];
        this.draw(x, y);
    }

    draw(x, y) {
        const canvas = this.refs.canvas;
        // const canvasWidth = this.props.width;
        // const canvasHeight = this.props.height;
        const ctx = canvas.getContext('2d');
        drawRound();


        function drawRound() {
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
