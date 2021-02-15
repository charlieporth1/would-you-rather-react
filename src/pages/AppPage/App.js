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
    ViewAnsweredQ: "answered questions",
    ViewUnAnsweredQ: "unanswered Questions",
    All: "all questions"
};

class App extends React.Component<App.propTypes> {
    state = {
        questions: null,
        newUserName: '',
        questionsArray: [],
        currentUser: null,
        currentQuestion: null,
        showPolls: false,
        showCreateQuestion: false,
        isViewAnsweredQ: false,
        isViewUnAnsweredQ: true,
        questionType: QuestionType.ViewUnAnsweredQ,
        filteredQuestionsArray: [],
    };

    async componentDidMount(): void {
        const {authStore, history} = this.props;
        authStore(history);
        const {isViewAnsweredQ, isViewUnAnsweredQ} = this.state;
        const smallState = {isViewAnsweredQ, isViewUnAnsweredQ};
        await this.getQuestions(smallState);
    }

    getQuestions = async (additionalStateUpdates?) => {
        const {store} = this.props;
        let {
            currentUser,
        } = this.state;
        store.dispatch({type: 'question/getQuestions'});
        const {userStore, questionStore} = store.getState();

        const {questions, questionsArray} = await questionStore;
        const {user} = await userStore;

        currentUser = currentUser ? currentUser : user;

        // const filteredQuestionsArray = currentUser ? this.filteredQuestionsUpdate(currentUser, additionalStateUpdates) : questionsArray;
        // console.log("filteredQuestionsArray", filteredQuestionsArray);
        // const currentQuestion = this.updateQuestion(filteredQuestionsArray, additionalStateUpdates);
        // console.log("currentQuestion", currentQuestion)
        // filteredQuestionsArray,
        //     currentQuestion,
        this.setState({
            questions,
            questionsArray,
            currentUser,

            ...additionalStateUpdates
        });
    };

    onQuestionAnswer = async (questionId) => {
        const {store} = this.props;
        await this.getQuestions();
        setTimeout(() => store.dispatch(push(`/questions/${questionId}`, {...this.state})), 750)
    };

    filteredQuestionsUpdate (currentUser, additionalStateUpdates?) {
        const {questionsArray} = this.state;
        const currentState = additionalStateUpdates || this.state;
        const {
            isViewAnsweredQ,
            isViewUnAnsweredQ,
        } = currentState;
        const answeredQuestionFilter = (value, index, self) => {
            return value.toString() === currentUser.id.toString();
        };

        if (isViewAnsweredQ) {
            return questionsArray.filter((question) => {
                const isOptionOne: boolean = (question.optionOne.votes.filter(answeredQuestionFilter).length > 0);
                const isOptionTwo: boolean = (question.optionTwo.votes.filter(answeredQuestionFilter).length > 0);
                return isOptionOne || isOptionTwo;

            }).sort(timeStampSort);

        } else if (isViewUnAnsweredQ) {
            return questionsArray.filter((question) => {
                const notOptionOne: boolean = (question.optionOne.votes.filter(answeredQuestionFilter).length === 0);
                const notOptionTwo: boolean = (question.optionTwo.votes.filter(answeredQuestionFilter).length === 0);

                return notOptionOne && notOptionTwo;

            }).sort(timeStampSort);
        } else {
            let filteredQuestionsArray: [] = questionsArray.sort(timeStampSort);
            return filteredQuestionsArray;
        }
    };
    updateQuestion (filteredQuestionsArray: [] = [], additionalStateUpdates?)  {
        const currentState = additionalStateUpdates || this.state;
        const {
            isViewAnsweredQ,
            isViewUnAnsweredQ,
        } = currentState;

        const isViewingAll = !isViewUnAnsweredQ && !isViewAnsweredQ;

        let currentQuestion;
        if (isViewingAll) {
            const index = randomNumber(0, filteredQuestionsArray.length - 1);
            currentQuestion = filteredQuestionsArray[index];
        } else {
            currentQuestion = filteredQuestionsArray.shift();
        }
        return currentQuestion;
    };

    render() {
        const {store} = this.props;
        const {
            questions,
            currentUser,
            currentQuestion,
            showPolls,
            showCreateQuestion,
            isViewAnsweredQ,
            isViewUnAnsweredQ,
            questionType,
            questionsArray,
        } = this.state;

        if (!questions || !currentUser)
            return <div/>;

        const filteredQuestionsArray = this.filteredQuestionsUpdate( currentUser);
        const question = this.updateQuestion(filteredQuestionsArray);

        showPolls && store.dispatch(push(Routes.leaderboard));
        showCreateQuestion && store.dispatch(push(Routes.createQuestion));

        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo"/>
                </header>
                <div>
                    <div className={makeCleanClassName(['question-type-tabs-app'])}>
                        <RoundedButton
                            classNames={['question-tab-button', (isViewUnAnsweredQ ? 'question-tab-button-tab-clicked' : '')]}
                            title="View unanswered questions"
                            onClick={async () => await this.getQuestions({
                                isViewUnAnsweredQ: true,
                                isViewAnsweredQ: false,
                                questionType: QuestionType.ViewUnAnsweredQ
                            })}/>
                        <RoundedButton
                            classNames={['question-tab-button', (isViewAnsweredQ ? 'question-tab-button-tab-clicked' : '')]}
                            title="View answered questions"
                            onClick={async () => await this.getQuestions({
                                isViewUnAnsweredQ: false,
                                isViewAnsweredQ: true,
                                questionType: QuestionType.ViewAnsweredQ
                            })}/>
                    </div>
                    <h2>Viewing {questionType}</h2>
                    {question ? (<div className={makeCleanClassName(['button-grid-app-div'])}>
                        <QuestionBlock
                            title={`${currentUser.name} would you rather...`}
                            question={question}
                            store={store}
                            onUpdate={async () => await this.onQuestionAnswer(question.id)}/>
                    </div>) : <div>No {questionType} left</div>
                    }
                    <div className={makeCleanClassName(['app-options-container'])}>
                        <h3>Options</h3>
                        <div className={makeCleanClassName(['app-options'])}>
                            <RoundedButton title="Show Leaderboard"
                                           onClick={() => this.setState({showPolls: !showPolls})}/>
                            <RoundedButton title="Create Question"
                                           onClick={() => {
                                               this.setState({showCreateQuestion: !showCreateQuestion});
                                           }}/>
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