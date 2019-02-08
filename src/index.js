import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';

document.addEventListener('touchstart', function(event) {
    event.preventDefault();
});

const root = document.getElementById('root');

ReactDOM.render(<App />, root);
