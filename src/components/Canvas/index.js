import React, { Component } from 'react';
import './style.css';


export default class Canvas extends Component {
    state = {
        brush: Object.assign({}, this.props.panelProps.brush),

        buffer: [],
        history: [],
        currentInputLinePoints: [],
    }

    // getURL() {
    //     return this.refs.canvas.toDataURL('image/jpeg', 1);
    // }

    printServiceLog() {
        const N = this.state.history.length;
        console.log(
            `\nINPUT CAPTURED:`,
            `line-${N}`,
            `points:${this.state.currentInputLinePoints.length}`,
            `color:${this.state.history[N-1].color}`,
            `thickness:${this.state.history[N-1].thickness}`,
        );
        console.log('points =', this.state.currentInputLinePoints);
    }

    sendURL() {
        // отправляем url холста в App
        const canvasURL = this.refs.canvas.toDataURL('image/jpeg', 1);
        this.props.setCanvasURL(canvasURL);
    }

    componentDidMount() {
        const canvas = this.refs.canvas;

        // белый фон
        const ctx = canvas.getContext('2d');
        ctx.save();
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, this.props.width, this.props.height);
        ctx.restore();

        this.sendURL();

        const self = this;
        const coords = canvas.getBoundingClientRect();

        function startInput(x, y) {
            console.log('\nINPUT STARTED\n');

            self.addPointToCurrentInputLine(x, y);

            let {color, thickness} = self.props.app.controlPanel.brush;
            if (self.props.app.mode === 'erase') color = '#fff';

            self.drawPoint(x, y, color, thickness);
        }

        function moveTo(x, y) {
            self.addPointToCurrentInputLine(x, y);

            let {color, thickness} = self.props.app.controlPanel.brush;
            if (self.props.app.mode === 'erase') color = '#fff';

            const buffer = self.state.buffer.slice();

            if (buffer.length>=4) {
                self.UPDATE(buffer, color, thickness);
                self.setState({ buffer: [].concat(buffer[buffer.length-1]) });
            }
        }

        function endInput() {
            let {color, thickness} = self.props.app.controlPanel.brush;
            if (self.props.app.mode === 'erase') color = '#fff';

            self.addLineToHistory(
                self.state.currentInputLinePoints,
                color,
                thickness
            );

            // cлужебная информация в консоль
            self.printServiceLog();

            self.setState({
                buffer: [],
                currentInputLinePoints: [],
            });

            self.sendURL();
        }

        // если произошел единичный тап по холсту,
        // будем закрывать слайдер, не обрабатывая точку
        // для этого...
        let closingSliderOnSingleTap;

        // компьютерное управление
        canvas.addEventListener('mousedown', onMouseDown);

        function onMouseDown(event) {
            // ...при нажатии проверяем, открыт ли слайдер
            if (self.props.app.thicknessSlider.open) {
                closingSliderOnSingleTap = true;
            } else {
                startInput(
                    event.pageX - coords.left,
                    event.pageY - coords.top
                );
            }

            canvas.addEventListener('mousemove', onMouseMove);
            canvas.addEventListener('mouseup', onMouseUp);
        };

        function onMouseMove(event) {
            // если движение началось, закрываем слайдер и рисуем
            closingSliderOnSingleTap = false;

            if (self.props.app.thicknessSlider.open) {
                self.props.closeSlider();
            }

            moveTo(
                event.pageX - coords.left,
                event.pageY - coords.top
            );
        };

        function onMouseUp(event) {
            // если движения не было, просто закрываем слайдер и всё
            if (closingSliderOnSingleTap) {
                self.props.closeSlider();
                canvas.removeEventListener('mousemove', onMouseMove);
                canvas.removeEventListener('mouseup', onMouseUp);
                return;
            };

            endInput();

            canvas.removeEventListener('mousemove', onMouseMove);
            canvas.removeEventListener('mouseup', onMouseUp);
        };

        // управление на мобильных устройствах
        canvas.addEventListener('touchstart', onTouchStart);

        function onTouchStart(event) {
            event.preventDefault();
            if (self.props.app.thicknessSlider.open) {
                closingSliderOnSingleTap = true;
            } else {
                startInput(
                    event.targetTouches[0].pageX - coords.left,
                    event.targetTouches[0].pageY - coords.top
                );
            }

            canvas.addEventListener('touchmove', onTouchMove);
            canvas.addEventListener('touchend', onTouchEnd);
        }

        function onTouchMove(event) {
            event.preventDefault();
            closingSliderOnSingleTap = false;
            if (self.props.app.thicknessSlider.open) {
                self.props.closeSlider();
            }
            moveTo(
                event.targetTouches[0].pageX - coords.left,
                event.targetTouches[0].pageY - coords.top
            );
        }

        function onTouchEnd(event) {
            event.preventDefault();

            if (closingSliderOnSingleTap) {
                self.props.closeSlider();
                canvas.removeEventListener('touchmove', onMouseMove);
                canvas.removeEventListener('touchend', onMouseUp);
                return;
            };

            endInput();

            canvas.removeEventListener('touchmove', onTouchMove);
            canvas.removeEventListener('touchend', onTouchEnd);
        }
    }

    addPointToCurrentInputLine(x, y) {
        let currentInputLinePoints = this.state.currentInputLinePoints.slice();
        currentInputLinePoints.push({x: x, y: y});

        let buffer = this.state.buffer.slice();
        buffer.push(currentInputLinePoints[currentInputLinePoints.length-1]);

        this.setState({ currentInputLinePoints, buffer });
    }

    addLineToHistory(currentInputLinePoints, color, thickness) {
        const points = currentInputLinePoints.slice();
        const history = this.state.history.slice();
        history.push({
            points,
            color,
            thickness
        });
        this.setState({ history });
    }

    undo() {
        console.log('REDRAWING TO STEP ' + (this.state.history.length-1));
        const ctx = this.refs.canvas.getContext('2d');

        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, this.props.width, this.props.height);

        if (this.state.history.length === 0) return;

        const history = this.state.history.slice();
        history.pop();
        this.setState({ history });

        history.forEach((stage) => {
            ctx.save();

            let buffer = [];
            stage.points.forEach((point) => {
                // let buffer = this.state.buffer.slice();
                buffer.push(point);
                if (buffer.length === 1) {
                    this.drawPoint(point.x, point.y, stage.color, stage.thickness);
                }
                if (buffer.length >= 4) {
                    this.UPDATE(buffer, stage.color, stage.thickness);
                    buffer = [].concat(buffer[buffer.length-1]);
                }
            });

            ctx.restore();
        });

        this.setState({ buffer: [] });
    }

    UPDATE(buffer, color, thickness) {
        const N = buffer.length;
        let dxMax = 0, dyMax = 0;
        for (let i = 0; i < N-1; i++) {
            const {x:x1, y:y1} = buffer[i];
            const {x:x2, y:y2} = buffer[i+1];
            const dx = Math.abs(x1 - x2);
            const dy = Math.abs(y1 - y2);
            if (dx > dxMax) dxMax = dx;
            if (dy > dyMax) dyMax = dy;
        }

        if (dxMax > thickness / 2 || dyMax > thickness / 2) {
            this.drawCurve(buffer, color, thickness);
        } else {
            buffer.forEach((point) => {
                this.drawPoint(
                    point.x, point.y, color, thickness
                );
            });
        }
    }

    drawCurve(points, color, thickness) { // кривая Безье по четырем точкам
        const ctx = this.refs.canvas.getContext('2d');

        ctx.strokeStyle = color;
        ctx.lineWidth = thickness;
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
    }

    drawPoint(x, y, color, thickness) {
        const canvas = this.refs.canvas;
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = color;

        ctx.beginPath();
        ctx.arc(x, y, thickness / 2, 0, Math.PI*2);
        ctx.fill();
    }

    render() {
        return (
            <canvas
                id='canvas'
                ref='canvas'
                width={this.props.width}
                height={this.props.height}
                style={{
                    position: 'fixed',
                    top: this.props.app.controlPanel.height + 'px',
                    left: 0,
                }}
            ></canvas>
        );
    }

}
