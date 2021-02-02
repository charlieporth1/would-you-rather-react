import React from "react";
import PropTypes from 'prop-types'; // ES6
import 'DefaultInput.css';

export default class DefaultInput extends React.Component<DefaultInput.propTypes> {
    onInputChange(event) {
        const {onChange} = this.props;

    }

    static PlaceholderTitle(props: { value: string }) {
        const {value} = props;
        return (value && value.toString().trim() !== '' ?
                <div className={['default-placeholder-text-default-input']}>      </div>
                : <div className={['default-placeholder-text-default-input']}>{value}</div>

        )
    }

    render() {
        const {onChange, value, title} = this.props;
        <div>
            <PlaceholderTitle value={value}/>
            <input onChange={(event) =>onChange(event)}/>
        </div>
    }
}

DefaultInput.propTypes = {
    styles: PropTypes.object,
    title: PropTypes.string.isRequired,
    autocomplete: PropTypes.string,
    onChange(event): PropTypes.func {},
    value: PropTypes.string,
};