import PropTypes from "prop-types";
import * as React from "react";
import {makeCleanClassName, reduceArrayToPercent, uppercaseFirstLetter} from "../../utils/utils";
import './ViewPolls.css';

export default class ViewPolls extends React.Component<ViewPolls.propTypes> {

    render() {
        const {question, title} = this.props;
        const questionOne = uppercaseFirstLetter(question.optionOne.text) + "?";
        const questionTwo = uppercaseFirstLetter(question.optionTwo.text) + "?";
        const data = reduceArrayToPercent(question.optionOne.votes, question.optionTwo.votes);
        return (<div className={makeCleanClassName(['view-polls-container-div'])}>
            <div className={makeCleanClassName(['view-polls-div-results'])}>
                <h1>{title}</h1>
                <h3>{questionOne}</h3>  <h3>{questionTwo}</h3>
                <p>{data.array1Percent}%</p>   <p>{data.array2Percent}%</p>
            </div>
            <p>{data.count} total votes</p>
        </div>);
    }
}

ViewPolls.propTypes = {
    question: PropTypes.object.isRequired,
    title: PropTypes.string.isRequired,
};