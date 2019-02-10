import React, { Component } from 'react';
import './style.css';

export default class ThicknessSlider extends Component {
    shouldComponentUpdate() {
        return false;
    }

    componentDidMount() {
        this.appear();

        const line = this.refs.line;
        let lineCoords = line.getBoundingClientRect();

        const thumb = this.refs.thumb;
        let shiftX;

        const minThickness = this.props.panelProps.brush.minThickness;
        const maxThickness = this.props.panelProps.brush.maxThickness;
        const self = this;

        thumb.addEventListener('mousedown', function(event) {
            startDrag(event.clientX);
            document.addEventListener('mousemove', onDocumentMouseMove);
            document.addEventListener('mouseup', onDocumentMouseUp);
        });

        document.addEventListener('touchstart', function(event) {
            if (!event.target.closest('.slider__bg')) return;
            startDrag(event.targetTouches[0].clientX);
            document.addEventListener('touchmove', onDocumentTouchMove);
            document.addEventListener('touchend', onDocumentTouchEnd);
        })

        function startDrag(startClientX) {
            const thumbCoords = thumb.getBoundingClientRect();
            shiftX = startClientX - thumbCoords.left;
        }

        function onDocumentMouseMove(event) {
            moveTo(event.clientX);
        }

        function onDocumentTouchMove(event) {
            moveTo(event.targetTouches[0].clientX);
        }

        function moveTo(clientX) {
            let newLeft = clientX - shiftX - lineCoords.left;

            if (newLeft < 0) newLeft = 0;

            const rightEdge = line.offsetWidth - thumb.offsetWidth;
            if (newLeft > rightEdge) newLeft = rightEdge;

            thumb.style.left = newLeft + 'px';

            let newThickness =
                minThickness + newLeft/rightEdge * maxThickness;
            self.props.setBrushThickness(newThickness);
        }

        function onDocumentMouseUp() {
            document.removeEventListener('mousemove', onDocumentMouseMove);
            document.removeEventListener('mouseup', onDocumentMouseUp);
        }

        function onDocumentTouchEnd() {
            document.removeEventListener('touchmove', onDocumentTouchMove);
            document.removeEventListener('touchend', onDocumentTouchEnd);
        }

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

    appear() {
        const self = this;
        this.animate({
            duration: 150,
            timing: (timeFraction) => Math.pow(timeFraction, 2),
            draw: function slide(progress) {
                if (!self.refs.slider) return;
                self.refs.slider.style.top =
                    self.props.panelProps.height -
                    self.props.height + self.props.height*progress + 'px';
            }
        });
    }

    render() {
        const sliderLineHeight = this.props.height / 5;
        const sliderThumbHeight = 5*this.props.height / 6;
        const sliderThumbWidth = sliderThumbHeight / 3;

        const minThickness = this.props.panelProps.brush.minThickness;
        const maxThickness = this.props.panelProps.brush.maxThickness;
        const thickness = this.props.panelProps.brush.thickness;

        const rightEdge = Math.floor(this.props.width - sliderThumbWidth);
        const thumbStartLeft = thickness/maxThickness * rightEdge -
            minThickness/maxThickness * rightEdge;

        return (
            <div
                className='slider__bg'
                ref='slider'
                style={{
                    backgroundColor: 'rgba(222, 222, 222, 0.5)',
                    width: this.props.width + 'px',
                    height: this.props.height + 'px',
                    marginLeft: -this.props.width/2 + 'px',
                    borderBottomLeftRadius: 0.1*this.props.height + 'px',
                    borderBottomRightRadius: 0.1*this.props.height + 'px',
                }}
            >
                <div
                    className='slider__line'
                    ref='line'
                    style={{
                        backgroundColor: this.props.bgColor,
                        height: sliderLineHeight + 'px',
                        marginTop: -sliderLineHeight/2 + 'px'
                    }}
                >
                    <div
                        className='slider__thumb'
                        ref='thumb'
                        style={{
                            backgroundColor: this.props.panelProps.brush.color,
                            height: sliderThumbHeight + 'px',
                            width: sliderThumbWidth + 'px',
                            top: -sliderThumbHeight/2 + sliderLineHeight/2 + 'px',
                            left: thumbStartLeft + 'px'
                        }}
                    >
                    </div>
                </div>
            </div>
        );
    }
}
