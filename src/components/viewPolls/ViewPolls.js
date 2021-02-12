import PropTypes from "prop-types";
import * as React from "react";
import {makeCleanClassName, reduceArrayToPercent, uppercaseFirstLetter} from "../../utils/utils";
import './ViewPolls.css';

export default class ViewPolls extends React.Component<ViewPolls.propTypes> {
    render() {
        const {question, title, containerClass = []} = this.props;

        const questionOne = this.questionAdditions(question.optionOne.text);
        const questionTwo = this.questionAdditions(question.optionTwo.text);

        const data = reduceArrayToPercent(question.optionOne.votes, question.optionTwo.votes);

        return (<div className={makeCleanClassName(['view-polls-container-div', ...containerClass])}>
            <h1>{title}</h1>
            <div className={makeCleanClassName(['view-polls-div-results'])}>
                <h3>{questionOne}</h3>  <h3>{questionTwo}</h3>
                <p>{data.array1Percent}%</p>   <p>{data.array2Percent}%</p>
                <p>Author: {question.author}</p>
                <p>{data.count} total votes</p>
            </div>
        </div>);
    }

    questionAdditions = (str: string) => {
        str = uppercaseFirstLetter(str.trim());
        if (!str.includes("?")) {
            return str + "?";
        } else {
            return str;
        }
    }
}

ViewPolls.propTypes = {
    question: PropTypes.object.isRequired,
    title: PropTypes.string.isRequired,
    containerClass: PropTypes.arrayOf(PropTypes.string),
};