import React from "react";
import PropTypes from 'prop-types';
import RoundedButton from "../button/RoundedButton";
import './QuestionBlock.css';
import {makeCleanClassName, uppercaseFirstLetter} from "../../utils/utils";

export default class QuestionBlock extends React.Component<QuestionBlock.propTypes> {


    render() {
        const {question, title} = this.props;
        const questionOne = uppercaseFirstLetter(question.optionOne.text) + "?";
        const questionTwo = uppercaseFirstLetter(question.optionTwo.text) + "?";
        return (<div className={makeCleanClassName(["button-blocks-question-block"])}>
            <h1>{title}</h1>
            <RoundedButton title={questionOne} onClick={() => this.optionClick("optionOne")}/>
            <RoundedButton title={questionTwo} onClick={() => this.optionClick("optionTwo")}/>
        </div>);
    }

    async optionClick(answer) {
        const {question, store} = this.props;
        const {userStore} = store.getState();
        const user = (await userStore).user;
        const qid = question.id;
        const authedUser = user.id;
        store.dispatch({type: 'question/addAnswer', payload: {authedUser, qid, answer}})

    }
}
QuestionBlock.propTypes = {
    title: PropTypes.string.isRequired,
    classNames: PropTypes.array,
    question: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired,
};
