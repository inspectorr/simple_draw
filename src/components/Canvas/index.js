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

        brush: Object.assign([], this.props.panelProps.brush),

        buffer: [],
        inputedLines: [], // история входных линий
        currentInputLinePoints: [], // точки текущей входной линии
    }

    componentDidMount() { // установка обработчиков на готовый canvas
        const canvas = this.refs.canvas;
        const self = this;
        const coords = canvas.getBoundingClientRect();

        // компьютерное управление
        canvas.onmousedown = function drag(event) {
            console.log('\nINPUT STARTED\n');
            self.setDrawingMode();
            const x = event.pageX - coords.left;
            const y = event.pageY - coords.top;
            self.addPointToCurrentInputLine(x, y);
            self.drawPoint(x, y);// self.UPDATE();

            canvas.onmousemove = function move(event) {
                self.addPointToCurrentInputLine(
                    event.pageX - coords.left,
                    event.pageY - coords.top
                );
                self.UPDATE();
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

    UPDATE() {
        const buffer = this.state.buffer.slice();
        const N = buffer.length;
        const brush = this.props.panelProps.brush;

        // const {x, y} = buffer[N-1];
        // this.drawPoint(x, y);

        if (N < 4) return;
        this.setState({ buffer: [].concat(buffer[N-1]) });

        // this.drawCurve(buffer);

        let dxMax = 0, dyMax = 0;
        for (let i = 0; i < N-1; i++) {
            const {x:x1, y:y1} = buffer[i];
            const {x:x2, y:y2} = buffer[i+1];
            const dx = Math.abs(x1 - x2);
            const dy = Math.abs(y1 - y2);
            if (dx > dxMax) dxMax = dx;
            if (dy > dyMax) dyMax = dy;
        }

        if (dxMax > brush.thickness / 2 || dyMax > brush.thickness / 2) {
            this.drawCurve(buffer);
        } else {
            buffer.forEach((point) => this.drawPoint(point.x, point.y));
        }
    }

    drawCurve(points) { // кривая Безье по четырем точкам
        const ctx = this.refs.canvas.getContext('2d');
        const brush = this.props.panelProps.brush;

        ctx.save();
        ctx.strokeStyle = `${brush.color}`;
        ctx.lineWidth = `${brush.thickness}`;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        ctx.bezierCurveTo(
            points[1].x, points[1].y,
            points[2].x, points[2].y,
            points[3].x, points[3].y
        );
        ctx.stroke();
        ctx.restore();
    }

    // drawLines(points) {
    //     const ctx = this.refs.canvas.getContext('2d');
    //     const brush = this.props.panelProps.brush;
    //
    //     ctx.save();
    //     ctx.strokeStyle = 'black';
    //     ctx.lineWidth = `${brush.thickness}`;
    //     ctx.lineJoin = 'round';
    //     ctx.lineCap = 'round';
    //     ctx.beginPath();
    //     ctx.moveTo(points[0].x, points[0].y);
    //     for (let i = 1; i < points.length; i++) {
    //         ctx.lineTo(points[i].x, points[i].y);
    //     }
    //     ctx.stroke();
    //     ctx.restore();
    // }

    drawPoint(x, y) {
        const canvas = this.refs.canvas;
        const ctx = canvas.getContext('2d');
        const brush = this.props.panelProps.brush;

        ctx.save();
        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(x, y, brush.thickness / 2, 0, Math.PI*2);
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
