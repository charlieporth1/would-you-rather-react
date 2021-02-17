import logo from '../../static/assets/logo.svg';
import './App.css';
import * as React from "react";
import QuestionBlock from "../../components/questionBlock/QuestionBlock";
import {combineArrays, makeCleanClassName, randomNumber, timeStampSort} from "../../utils/utils";
import RoundedButton from "../../components/button/RoundedButton";
import PropTypes from "prop-types";
import {withRouter} from "react-router-dom";
import {push} from 'connected-react-router'
import {Routes} from "../../static/assets/Routes";

export const QuestionType = {
    ViewAnsweredQ: "answered questions",
    ViewUnAnsweredQ: "unanswered Questions",
    All: "all questions"
};

class App extends React.Component<App.propTypes> {
    constructor(props: any) {
        super(props);
        this.state = {
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

    }

    _isMounted = false;

    async componentWillMount(): void {
        const {authStore, history, store} = this.props;
        authStore(history);
        const {isViewAnsweredQ, isViewUnAnsweredQ} = this.state;
        const {router} = store.getState() || {location: null};
        const {state} = router.location;
        const {questionsArrays} = state || {questionsArrays: []};
        const smallState = {isViewAnsweredQ, isViewUnAnsweredQ, questionsArrays};
        await this.getQuestions(smallState);
    }

    componentDidMount() {
        this._isMounted = true;
    }

    async getQuestions(additionalStateUpdates?) {
        const {store} = this.props;
        const {questionsArrays} = additionalStateUpdates || {questionsArrays: []};
        let {
            currentUser,
        } = this.state;
        await store.dispatch({type: 'question/getQuestions'});
        const {userStore, questionStore} = store.getState();

        let {questions, questionsArray} = await questionStore;
        questionsArray = await combineArrays(questionsArray, questionsArrays);

        const {user} = await userStore;
        currentUser = (!!currentUser) ? currentUser : user;
        const filteredQuestionsArray = await this.filteredQuestionsUpdate(questionsArray, currentUser, additionalStateUpdates);
        setTimeout(() => this.setState({
            questions,
            questionsArray,
            currentUser,
            filteredQuestionsArray,
            ...additionalStateUpdates
        }), 60);
    };

    async onQuestionAnswer(questionId) {
        const {store} = this.props;
        const {currentUser} = this.state;
        await this.getQuestions();
        setTimeout(() => store.dispatch(push(`/questions/${questionId}`, {currentUser})), 10)
    };

    async filteredQuestionsUpdate(questionsArray, currentUser, additionalStateUpdates?) {
        const currentState = additionalStateUpdates || this.state;
        const {
            isViewAnsweredQ,
            isViewUnAnsweredQ,
        } = currentState;

        const userId = (currentUser || {id: ''}).id;
        if (isViewAnsweredQ) {
            const answeredQuestions = questionsArray.filter((question) => {
                const isOptionOne: boolean = (question.optionOne.votes.includes(userId));
                const isOptionTwo: boolean = (question.optionTwo.votes.includes(userId));
                return isOptionOne === true || isOptionTwo === true;

            }).sort(timeStampSort);
            return answeredQuestions;
        } else if (isViewUnAnsweredQ) {
            const unansweredQuestions = questionsArray.filter((question) => {
                const notOptionOne: boolean = (question.optionOne.votes.includes(userId));
                const notOptionTwo: boolean = (question.optionTwo.votes.includes(userId));

                return notOptionOne === false && notOptionTwo === false;

            }).sort(timeStampSort);
            return unansweredQuestions;

        } else {
            const filteredQuestionsArray: [] = questionsArray.sort(timeStampSort);
            return filteredQuestionsArray;
        }
    };

    updateQuestion(filteredQuestionsArray: [] = [], additionalStateUpdates?) {
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
            isViewAnsweredQ,
            isViewUnAnsweredQ,
            questionType,
            showPolls,
            showCreateQuestion,
            filteredQuestionsArray = [],
        } = this.state;

        if (!questions || !currentUser || !this._isMounted) {
            return <div/>;
        }

        showPolls && store.dispatch(push(Routes.leaderboard));
        showCreateQuestion && store.dispatch(push(Routes.createQuestion));
        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo"/>
                </header>
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

                    <div>
                        <h2>Viewing {questionType}</h2>
                        <div className={makeCleanClassName(['button-grid-app-div'])}>
                            {filteredQuestionsArray.length > 0 ? filteredQuestionsArray.map((question) => {
                                    const isFirstQuestion = question.id === filteredQuestionsArray[0].id;
                                    const title = isFirstQuestion ? `${currentUser.name} would you rather...` : '';
                                    return (
                                        <QuestionBlock
                                            key={question.id}
                                            title={title}
                                            question={question}
                                            store={store}
                                            onUpdate={async () => await this.onQuestionAnswer(question.id)}/>
                                    )
                                }) :
                                <div>No {questionType} left</div>}
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
            </div>
        );
    }
}


App.propTypes = {
    store: PropTypes.object.isRequired,
    authStore: PropTypes.func.isRequired,
};
export default withRouter(App);