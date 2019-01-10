import React, { Component } from 'react';
import './style.css';

export default class Canvas extends Component {
    state = {
        // pointA: {
        //     x: null,
        //     y: null
        // },
        //
        // pointB: {
        //     x: null,
        //     y: null
        // },

        currentLinePoints: []
    }

    draw(x, y) {
        console.log(x, y);
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

        function drawLine() {

        }


    }

    addPoint(x, y) {
        




        // const ;

        // if (!this.state.pointA.x) { // первый шаг
        //     newPointA = {x: x, y: y};
        // } else if (this.state.pointA && !this.state.pointB) { // второй щаг
        //     newPointB = {x: x, y: y};
        // } else { // последующие
        //     newPointB = {x: x, y: y};
        //     newPointA = Object.assign({}, this.state.pointB);
        // }

        // this.setState({
        //     pointA: newPointA,
        //     pointB: newPointB
        // });
    }

    componentDidMount() { // установка обработчиков на готовый canvas
        const canvas = this.refs.canvas;
        const self = this;

        canvas.onmousedown = function drag(event) {
            self.addPoint(event.clientX, event.clientY);

            canvas.onmousemove = function move(event) {
                self.addPoint(event.clientX, event.clientY);
            };

            canvas.onmouseup = function drop(event) {
                self.addPoint(event.clientX, event.clientY);
                canvas.onmousemove = canvas.onmouseup = null;
            };
        };


    }

    componentDidUpdate(prevProps, prevstate, snapshot {
        this.updateScreen(); // обновление экрана

        this.setState({})
    }

    updateScreen() { // обновление canvas
        const {x, y} = this.state.lastPoint;
        this.draw(x, y);
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
