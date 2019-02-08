import React, { Component } from 'react';
import './style.css';

export default class ItemsList extends Component {
    render() {
        let items = this.props.items.slice();

        items = items.map((item) => {
            return <li key={item.key}>{item}</li>;
        });

        return (
            <ul>
                {items}
            </ul>
        );
    }
}
