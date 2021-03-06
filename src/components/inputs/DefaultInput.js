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
        const title = event.target.value.length <= 0 ? undefined : placeholder;
        this.setState({title});
        onChange(event);

    }

    PlaceholderTitle() {
        const {title} = this.state;
        return (title ? <div className={makeCleanClassName(['default-placeholder-text-default-input'])}>
            {title}
        </div> : <div className={makeCleanClassName(['default-placeholder-text-default-input'])}>&nbsp;</div>)
    }

    render() {
        const {placeholder, styles, classNames = [], classNamesInput = []} = this.props;
        return (
            <div className={makeCleanClassName(["default-input-div", ...classNames])}>
                {this.PlaceholderTitle()}
                <input placeholder={placeholder}
                       className={makeCleanClassName(['default-input-input', ...classNamesInput])} style={styles}
                       onChange={(event) => this.onInputChange(event)}/>
            </div>);
    }
}

DefaultInput.propTypes = {
    styles: PropTypes.object,
    placeholder: PropTypes.string.isRequired,
    autocomplete: PropTypes.string,
    onChange: PropTypes.func,
    value: PropTypes.string,
    classNames: PropTypes.arrayOf(PropTypes.string),
    classNamesInput: PropTypes.arrayOf(PropTypes.string),
};