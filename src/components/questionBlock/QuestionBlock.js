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
        return (<div className={makeCleanClassName(["container-question-block"])}>
            <h1>{title}</h1>
            <div className={makeCleanClassName(['question-block-btn-row'])}>
                <RoundedButton title={questionOne}
                               onClick={async () => await this.optionClick("optionOne")}/>
                <RoundedButton title={questionTwo}
                               onClick={async () => await this.optionClick("optionTwo")}/>
            </div>
        </div>);
    }

    async optionClick(answer) {
        const {question, store, onUpdate} = this.props;
        const {userStore} = store.getState();
        const {user} = await userStore;
        const qid = question.id;
        const authedUser = user.id;
        await store.dispatch({type: 'question/addAnswer', payload: {authedUser, qid, answer}});
        setTimeout(() => onUpdate(), 5);

    }
}
QuestionBlock.propTypes = {
    title: PropTypes.string,
    classNames: PropTypes.arrayOf(PropTypes.string),
    question: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired,
    onUpdate: PropTypes.func.isRequired,
    isDisabled: PropTypes.bool,
};
