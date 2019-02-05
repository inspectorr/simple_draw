import React, { Component } from 'react';
import './style.css';

export default class Palette extends Component {
    componentDidMount() {
        const canvas = this.refs.canvas;
        this.draw();
        const self = this;
        // компьютерное управление
        canvas.addEventListener('click', function(event){
            const width = self.props.width;
            const height = self.props.height;

            const colors = self.props.colors;
            const N = colors.length;
            const R = Math.min(width, height) / 3;
            const r = 2*R / 3;

            let {clientX:x, clientY:y} = event;
            y -= self.props.panelProps.height;

            // переход в декартову систему в центре цветового круга
            x -= width/2;
            y -= height/2;
            y = -y;

            // выход за границы круга
            if (Math.sqrt(x*x+y*y) > R || Math.sqrt(x*x+y*y) < r) {
                self.props.closePalette();
                return;
            }


            // выбор цвета
            let fi = Math.atan2(x, y) / (Math.PI/180);
            fi = fi < 0 ? 360+fi : fi;
            const k = Math.floor(N*fi/360)

            const color = colors[k];
            self.props.setBrushColor(color);
            self.props.closePalette();
        });


    }

    animate(options) {
        const start = performance.now();
        requestAnimationFrame(function animate(time) {
            let timeFraction = (time-start)/options.duration;
            if (timeFraction < 0) timeFraction = 0;
            if (timeFraction > 1) timeFraction = 1;

            let progress = options.timing(timeFraction);
            options.draw(progress);

            if (timeFraction < 1) requestAnimationFrame(animate);
        });
    }

    draw() {
        const self = this;
        const ctx = this.refs.canvas.getContext('2d');
        const width = this.props.width;
        const height = this.props.height;

        const colors = this.props.colors;
        const N = colors.length;
        const R = Math.min(width, height) / 3;
        const r = 2*R / 3;

        // начало координат в центре круга
        ctx.translate(width/2, height/2);

        // фон
        let bgColor = this.props.bgColor.slice(1)
        let bgR = parseInt(bgColor.slice(0, 2), 16);
        let bgG = parseInt(bgColor.slice(2, 4), 16);
        let bgB = parseInt(bgColor.slice(4, 6), 16);
        this.animate({
            duration: 200,
            timing: (timeFraction) => Math.pow(timeFraction, 2),
            draw: function slide(progress) {
                self.refs.bg.style.backgroundColor = `rgba(${bgR}, ${bgG}, ${bgB}, ${1/2})`;
                self.refs.bg.style.top =
                    self.props.panelProps.height -
                    self.props.height + self.props.height*progress +'px';
            }
        });

        // сектора палитры
        let sector = 0;
        let angle = 2*Math.PI / N;
        let start = -Math.PI/2;
        setTimeout(() => this.animate({
            duration: 150,
            timing: (timeFraction) => Math.pow(timeFraction, 2),
            draw: function appear(progress) {
                // console.log(sector, progress);
                if (progress < sector/N) return;
                if (progress === 1) sector = N-1;

                // круг с цветами
                ctx.save();
                for (let k = 0; k <= sector; k++) {
                    ctx.fillStyle = colors[k];

                    ctx.beginPath();
                    ctx.arc(0, 0, R, start, start+angle, false);
                    ctx.arc(0, 0, r, start+angle, start, true);
                    ctx.closePath();
                    ctx.fill();

                    // поворот, следующий сектор
                    ctx.rotate(angle);

                }

                ctx.restore();

                // центральный круг
                // ctx.save();
                // ctx.fillStyle = self.props.panelProps.brush.color;
                // ctx.arc(0, 0, r, 0, 2*Math.PI);
                // ctx.fill();
                // ctx.restore();

                sector++;
            }
        }), 200);
    }

    render() {
        return (
            <div
                id='bg'
                ref='bg'
                style={{
                    marginTop: 0,
                    top: this.props.panelProps.height,
                    height: this.props.height,
                    width: this.props.width
                }}
            >
            <canvas
                id='palette'
                ref='canvas'
                height={this.props.height}
                width={this.props.width}
                // style={{top: this.props.panelProps.height}}
            >
            </canvas>
            </div>
        );
    }
}
