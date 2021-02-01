import React from "react";
import PropTypes from 'prop-types'; // ES6
import 'RoundedButton.css';
export default class RoundedButton extends React.Component<> {
    render() {
        const {styleButton, onClick, title, titleStyle, classNames} = this.props;
        return (
            <button className={[...classNames]} style={{...styleButton}} onClick={onClick()}>
                <div  className={["default-text-style"]} style={{...titleStyle}}>{title}</div>
            </button>

        );
    }
}


RoundedButton.propTypes = {
    title: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    titleStyle:PropTypes.object,
    styleButton:PropTypes.object,
    classNames:PropTypes.array,
};
