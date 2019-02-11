import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';

document.addEventListener('mousedown', function (event) {
    event.preventDefault();
});

document.addEventListener('dblclick', function (event) {
    event.preventDefault();
});

document.addEventListener('contextmenu', function (event) {
    event.preventDefault();
});

document.addEventListener('touchstart', function (event) {
    event.preventDefault();
});

document.addEventListener('touchmove', function (event) {
    event.preventDefault();
});

const root = document.getElementById('root');

ReactDOM.render(<App />, root);
