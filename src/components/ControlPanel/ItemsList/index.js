import React, { Component } from 'react';
import './style.css';



export default class ItemsList extends Component {
    render() {
        let items = this.props.items;
        const settings = Object.assign({}, this.props.settings);

        items = items.map((item) => {
            // if (item.onClick) settings.onClick = item.onClick;
            let props = Object.assign(settings, item);
            // if (props.pressed) props.bgColor = muteColor(props.bgColor);
            return <li key={props.key}><item.component {...props} /></li>;
        });

        return (
            <ul>
                {items}
            </ul>
        );
    }
}
