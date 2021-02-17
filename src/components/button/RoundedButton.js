import React from "react";
import PropTypes from 'prop-types'; // ES6
import './RoundedButton.css';
import {makeCleanClassName} from "../../utils/utils";
export default class RoundedButton extends React.Component<RoundedButton.propTypes> {
    render() {
        const {styleButton, title, titleStyle, classNames = [], onClick, isValid = false} = this.props;
        return (
            <button className={makeCleanClassName([...classNames, "default-button-style", 'm-design', (isValid && 'default-button-style-invalid')])} style={styleButton} onClick={()=>onClick()}>
                <div  className={makeCleanClassName(["default-text-style"])} style={titleStyle}>{title}</div>
            </button>

        );
    }
}


RoundedButton.propTypes = {
    title: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    titleStyle:PropTypes.object,
    styleButton:PropTypes.object,
    classNames:PropTypes.arrayOf(PropTypes.string),
    isValid:PropTypes.bool,
};
