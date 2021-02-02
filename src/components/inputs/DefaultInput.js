import React from "react";
import PropTypes from 'prop-types'; // ES6
import './DefaultInput.css';
import {makeCleanClassName} from "../../utils/utils";

export default class DefaultInput extends React.Component<DefaultInput.propTypes> {
    state = {
        title: undefined,
    };
    onInputChange(event) {
        const {placeholder, onChange} = this.props;
        const title  = event.target.value.length <= 0 ? undefined : placeholder;
        this.setState({title});
        onChange(event);

    }

    PlaceholderTitle(props: { value:''}) {
        const {value} = props;
        const {title} = this.state;
        return (title ? <div className={makeCleanClassName(['default-placeholder-text-default-input'])}>
            {title}
        </div> :<div className={makeCleanClassName(['default-placeholder-text-default-input'])}>&nbsp;</div> )
    }

    render() {
        const {onChange, value, placeholder, styles} = this.props;
        return (<div className={makeCleanClassName(["default-input-div"])}>
            {this.PlaceholderTitle({value})}
            <input placeholder={placeholder} className={makeCleanClassName(['default-input-input'])} style={styles} onChange={(event) => this.onInputChange(event)}/>
        </div>);
    }
}

DefaultInput.propTypes = {
    styles: PropTypes.object,
    placeholder: PropTypes.string.isRequired,
    autocomplete: PropTypes.string,
    onChange(event): PropTypes.func {},
    value: PropTypes.string,
};