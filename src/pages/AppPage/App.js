import logo from '../../static/assets/logo.svg';
import './App.css';
import * as React from "react";
import QuestionBlock from "../../components/questionBlock/QuestionBlock";
import {makeCleanClassName, randomNumber} from "../../utils/utils";
import RoundedButton from "../../components/button/RoundedButton";
import PropTypes from "prop-types";
import {withRouter} from "react-router-dom";
const QuestionType = {
    ViewAnsweredQ: "Viewing answered questions",
    ViewUnAnsweredQ: "Viewing unanswered Questions",
    All:"Viewing all questions"
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
        questionType:QuestionType.All,
    };

    async componentDidMount(): void {
        const {authStore, history} = this.props;
        authStore(history);
        await this.getQuestions();
    }

    getQuestions = async () => {
        const {store} = this.props;
        store.dispatch({type: 'question/getQuestions'});
        const {userStore, questionStore} = store.getState();
        const {questions, questionsArray} = await questionStore;
        const {user} = await userStore;
        const newUserState = !this.state.currentUser ? {currentUser: user} : {};
        this.setState({questions, questionsArray, ...newUserState});
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
            questionType
        } = this.state;
        let filteredQuestionsArray = questionsArray;
        if (isViewAnsweredQ) {
            filteredQuestionsArray = questionsArray.filter((question) => {
                let result = false;
                if (question.optionOne.votes.filter((userId) => userId === currentUser.id))
                    result = true;
                if (question.optionTwo.votes.filter((userId) => userId === currentUser.id))
                    result = true;
                return result;
            });
        } else if (isViewUnAnsweredQ) {
            filteredQuestionsArray = questionsArray.filter((question) => {
                let result = false;
                if (question.optionOne.votes.filter((userId) => userId !== currentUser.id))
                    result = true;
                if (question.optionTwo.votes.filter((userId) => userId !== currentUser.id))
                    result = true;
                return result;
            });
        }

        const index = randomNumber(0, questionsArray.length - 1);
        const question = filteredQuestionsArray[index];


        const cqq = !currentQuestion ? question : currentQuestion;
        if (!questions || !currentUser || !question) {
            return <div/>
        }

        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo"/>
                </header>
                <div>
                    <h2>{questionType}</h2>
                    <QuestionBlock title={`${currentUser.name} would you rather...`}
                                   question={cqq} store={store}
                                   onUpdate={async () => await this.getQuestions()}/>
                    <div className={makeCleanClassName(['button-grid-app-div'])}>
                        <RoundedButton styleButton={{marginRight: 30}} title="Show Results"
                                       onClick={() => this.setState({showPolls: !showPolls})}/>
                        <RoundedButton styleButton={{marginLeft: 30}} title="Create Question"
                                       onClick={() => this.setState({showCreateQuestion: !showCreateQuestion})}/>
                    </div>
                    <div className={makeCleanClassName(['app-options-container'])}>
                        <h3>Options</h3>
                        <div className={makeCleanClassName(['app-options'])}>
                            <RoundedButton title="Toggle view unanswered questions"
                                           onClick={() => this.setState({isViewUnAnsweredQ: !isViewUnAnsweredQ, questionType: QuestionType.ViewUnAnsweredQ})}/>
                            <RoundedButton title="Toggle view answered questions"
                                           onClick={() => this.setState({isViewAnsweredQ: !isViewAnsweredQ, questionType: QuestionType.ViewAnsweredQ})}/>
                            <RoundedButton title="View all questions"
                                           onClick={() => this.setState({isViewAnsweredQ: false, isViewUnAnsweredQ: false, questionType: QuestionType.All})}/>
                            <RoundedButton title="Log out" onClick={() => history.push('/login')}/>
                        </div>
                    </div>
                    {showPolls && history.push(`/questions/${cqq.id}`)}
                    {showCreateQuestion && history.push(`/questions/create`)}
                </div>
            </div>
        );
    }
}


App.propTypes = {
    store: PropTypes.object,
    authStore: PropTypes.func,
};
export default withRouter(App);