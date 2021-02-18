import PropTypes from "prop-types";
import * as React from "react";
import {makeCleanClassName, reduceArrayToPercent, uppercaseFirstLetter} from "../../utils/utils";
import './ViewPolls.css';

export default class ViewPolls extends React.Component<ViewPolls.propTypes> {
    render() {
        const {question, title, containerClass, user} = this.props;

        const questionOne = this.questionAdditions(question.optionOne.text);
        const questionTwo = this.questionAdditions(question.optionTwo.text);

        const data = reduceArrayToPercent(question.optionOne.votes, question.optionTwo.votes);

        const whichOne = this.whichQuestions(question.optionOne.votes, question.optionTwo.votes, user.id);

        return (<div className={makeCleanClassName(['view-polls-container-div', ...containerClass])}>
            <h1>{title}</h1>
            <div className={makeCleanClassName(['view-polls-div-results'])}>
                <h3>{questionOne}</h3>  <h3>{questionTwo}</h3>
                <p className={makeCleanClassName([whichOne ? "view-polls-answered-question" : ""])}>{data.array1Percent.toFixed(2)}%</p>
                <p className={makeCleanClassName([!whichOne ? "view-polls-answered-question" : ""])}>{data.array2Percent.toFixed(2)}%</p>
                <p>Vote counts: {question.optionOne.votes.length}</p>
                <p>Vote counts: {question.optionTwo.votes.length}</p>
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
    };
    whichQuestions = (array1 = [], array2 = [], userId: string) => {
        if (userId && array1.includes(userId)) {
            return true; // 1
        } else if (userId && array2.includes(userId)) {
            return false; // 2
        } else {
            return null; // nil
        }
    };
}

ViewPolls.propTypes = {
    question: PropTypes.object.isRequired,
    title: PropTypes.string.isRequired,
    containerClass: PropTypes.arrayOf(PropTypes.string),
    user: PropTypes.object,
};