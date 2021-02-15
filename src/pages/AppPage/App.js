import logo from '../../static/assets/logo.svg';
import './App.css';
import * as React from "react";
import QuestionBlock from "../../components/questionBlock/QuestionBlock";
import {makeCleanClassName, randomNumber, timeStampSort} from "../../utils/utils";
import RoundedButton from "../../components/button/RoundedButton";
import PropTypes from "prop-types";
import {withRouter} from "react-router-dom";
import {push} from 'connected-react-router'
import {Routes} from "../../static/assets/Routes";

const QuestionType = {
    ViewAnsweredQ: "Viewing answered questions",
    ViewUnAnsweredQ: "Viewing unanswered Questions",
    All: "Viewing all questions"
};

class App extends React.Component<App.propTypes> {
    state = {
        questions: [],
        newUserName: '',
        questionsArray: [],
        currentUser: null,
        currentQuestion: null,
        showPolls: false,
        showCreateQuestion: false,
        isViewAnsweredQ: false,
        isViewUnAnsweredQ: true,
        questionType: QuestionType.ViewUnAnsweredQ,
        isQuestionAnswered: false,
        isDoneViewingPoll: true,
    };

    async componentDidMount(): void {
        const {authStore, history} = this.props;
        authStore(history);
        await this.getQuestions();
    }

    getQuestions = async (additionalStateUpdate = {}) => {
        const {store} = this.props;
        store.dispatch({type: 'question/getQuestions'});
        const {userStore, questionStore} = store.getState();
        const {questions, questionsArray} = await questionStore;
        const {user} = await userStore;
        const newUserState = !this.state.currentUser ? {currentUser: user} : {};
        this.setState({questions, questionsArray, ...newUserState, ...additionalStateUpdate});
    };
    onQuestionAnswer = async (questionId) => {
        const {store}= this.props;
        const {isQuestionAnswered, isDoneViewingPoll} = this.state;

        store.dispatch(push(`/questions/${questionId}`));
        await this.getQuestions();
    };

    render() {
        const {store, history} = this.props;
        const {
            questions,
            currentUser,
            currentQuestion,
            showPolls,
            showCreateQuestion,
            questionsArray,
            isViewAnsweredQ,
            isViewUnAnsweredQ,
            isQuestionAnswered,
            questionType
        } = this.state;
        const isViewingAll = !isViewUnAnsweredQ && !isViewUnAnsweredQ;

        let filteredQuestionsArray = questionsArray.sort(timeStampSort);
        if (isViewAnsweredQ) {
            filteredQuestionsArray = questionsArray.filter((question) => {
                let result = false;
                if (question.optionOne.votes.filter((userId) => userId === currentUser.id))
                    result = true;
                if (question.optionTwo.votes.filter((userId) => userId === currentUser.id))
                    result = true;
                return result;
            }).sort(timeStampSort);
        } else if (isViewUnAnsweredQ) {
            filteredQuestionsArray = questionsArray.filter((question) => {
                let result = false;
                if (question.optionOne.votes.filter((userId) => userId !== currentUser.id))
                    result = true;
                if (question.optionTwo.votes.filter((userId) => userId !== currentUser.id))
                    result = true;
                return result;
            }).sort(timeStampSort);
        }
        let question;
        if (isViewingAll) {
            const index = randomNumber(0, questionsArray.length - 1);
            question = filteredQuestionsArray[index];
        } else {
            question = filteredQuestionsArray.shift();
        }


        const cqq = !currentQuestion ? question : currentQuestion;
        if (!questions || !currentUser || !question) {
            return <div/>
        }
        showPolls && store.dispatch(push(Routes.leaderboard));  //history.push(`/questions/${cqq.id}`);
        showCreateQuestion && store.dispatch(push(Routes.createQuestion));

        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo"/>
                </header>
                <div>
                    <div className={makeCleanClassName(['question-type-tabs-app'])}>
                        <RoundedButton
                            classNames={['question-tab-button', (isViewUnAnsweredQ && 'question-tab-button-tab-clicked')]}
                            title="View unanswered questions"
                            onClick={() => this.setState({
                                isViewUnAnsweredQ: !isViewUnAnsweredQ,
                                isViewAnsweredQ: false,
                                questionType: QuestionType.ViewUnAnsweredQ
                            })}/>
                        <RoundedButton
                            classNames={['question-tab-button', (isViewAnsweredQ && 'question-tab-button-tab-clicked')]}
                            title="View answered questions"
                            onClick={() => this.setState({
                                isViewAnsweredQ: !isViewAnsweredQ,
                                isViewUnAnsweredQ: false,
                                questionType: QuestionType.ViewAnsweredQ
                            })}/>
                    </div>
                    <h2>{questionType}</h2>
                    <QuestionBlock isDisabled={isQuestionAnswered} title={`${currentUser.name} would you rather...`}
                                   question={cqq} store={store}
                                   onUpdate={async () => await this.onQuestionAnswer()}/>
                    <div className={makeCleanClassName(['button-grid-app-div'])}>
                    </div>
                    <div className={makeCleanClassName(['app-options-container'])}>
                        <h3>Options</h3>
                        <div className={makeCleanClassName(['app-options'])}>
                            <RoundedButton title="Show Leaderboard"
                                           onClick={() => this.setState({showPolls: !showPolls})}/>
                            <RoundedButton title="Create Question"
                                           onClick={() => this.setState({showCreateQuestion: !showCreateQuestion})}/>
                            <RoundedButton title="View all questions (Random order)"
                                           onClick={() => this.setState({
                                               isViewAnsweredQ: false,
                                               isViewUnAnsweredQ: false,
                                               questionType: QuestionType.All
                                           })}/>
                            <RoundedButton title="Log out" onClick={() => store.dispatch(push(Routes.login))}/>
                        </div>
                        <div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}


App.propTypes = {
    store: PropTypes.object.isRequired,
    authStore: PropTypes.func.isRequired,
};
export default withRouter(App);