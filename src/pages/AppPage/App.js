import logo from '../../static/assets/logo.svg';
import './App.css';
import * as React from "react";
import QuestionBlock from "../../components/questionBlock/QuestionBlock";
import {makeCleanClassName, randomNumber} from "../../utils/utils";
import RoundedButton from "../../components/button/RoundedButton";
import PropTypes from "prop-types";
import {withRouter} from "react-router-dom";

class App extends React.Component<App.propTypes> {
    state = {
        questions: [],
        newUserName: '',
        questionsArray: [],
        currentUser: null,
        currentQuestion: null,
        showPolls: false,
        showCreateQuestion: false,
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
        const {questions, currentUser, currentQuestion, showPolls, showCreateQuestion, questionsArray} = this.state;
        const index = randomNumber(0, questionsArray.length - 1);
        const question = questionsArray[index];


        const cqq = !currentQuestion ? question : currentQuestion;
        if (!questions || !currentUser || !question) {
            return <div/>
        }

        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo"/>
                </header>
                <RoundedButton title="Log out" onClick={()=> history.push('/login')}/>
                <div>
                    <QuestionBlock title={`${currentUser.name} would you rather...`}
                                   question={cqq} store={store}
                                   onUpdate={async () => await this.getQuestions()}/>
                    <div className={makeCleanClassName(['button-grid-app-div'])}>
                        <RoundedButton styleButton={{marginRight: 30}} title="Show Results"
                                       onClick={() => this.setState({showPolls: !showPolls})}/>
                        <RoundedButton styleButton={{marginLeft: 30}} title="Create Question"
                                       onClick={() => this.setState({showCreateQuestion: !showCreateQuestion})}/>
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