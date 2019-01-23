import React, { Component } from 'react';
import './style.css';

export default class ItemsList extends Component {
    render() {
        // const panelProps = this.props.panelProps;
        const items = this.props.items;

        return (
            <ul>
                {items}
            </ul>
        );
    }
}
