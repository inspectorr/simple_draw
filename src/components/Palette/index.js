import React, { Component } from 'react';
import './style.css';

export default class Palette extends Component {
    constructor(props) {
        super(props);

        const R = 5*Math.min(this.props.width, this.props.height)*0.5 / 6;
        const r = 2*R / 3;

        this.state = {
            R,
            r,
        };
    }

    componentDidMount() {
        this.draw();
        const canvas = this.refs.canvas;
        const self = this;

        // компьютерное управление
        canvas.addEventListener('click', function(event){
            const width = self.props.width;
            const height = self.props.height;

            const colors = self.props.colors;
            const N = colors.length;

            const R = self.state.R;
            const r = self.state.r;

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

            // выбор цветового сегмента по углу от центра
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
        const R = this.state.R;
        const r = this.state.r;

        // фон
        this.refs.bg.style.backgroundColor = 'rgba(255, 255, 255, 0.7)';
        this.animate({
            duration: 200,
            timing: (timeFraction) => Math.pow(timeFraction, 2),
            draw: function slide(progress) {
                if (!self.refs.bg) return;
                self.refs.bg.style.top =
                    self.props.panelProps.height -
                    self.props.height + self.props.height*progress + 'px';
            }
        });



        // сектора палитры
        let lastDrawedSector = -1;
        let angle = 2*Math.PI / N;
        let start = -Math.PI/2;

        // начало координат в центре круга
        ctx.translate(width/2, height/2);

        setTimeout(() => this.animate({
            duration: 150,
            timing: (timeFraction) => Math.pow(timeFraction, 2),
            draw: function appear(progress) {
                // текущий
                let sector = Math.ceil(N*progress)-1;

                // рисование секторов от последнего нарисованного до текущего
                for (let i = lastDrawedSector + 1; i <= sector; i++) {
                    ctx.fillStyle = colors[i];

                    ctx.beginPath();
                    ctx.arc(0, 0, R, start, start+angle, false);
                    ctx.arc(0, 0, r, start+angle, start, true);
                    ctx.closePath();
                    ctx.fill();

                    // поворот, следующий сектор
                    ctx.rotate(angle);
                }

                lastDrawedSector = sector;
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
            >
            </canvas>
            </div>
        );
    }
}
