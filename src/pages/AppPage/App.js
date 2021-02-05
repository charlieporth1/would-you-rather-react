import logo from '../../static/assets/logo.svg';
import './App.css';
import * as questionData from '../../_DATA';
import * as React from "react";
import QuestionBlock from "../../components/questionBlock/QuestionBlock";
import {makeCleanClassName, objectToArray, randomNumber} from "../../utils/utils";
import RoundedButton from "../../components/button/RoundedButton";
import PropTypes from "prop-types";
import {withRouter} from "react-router-dom";

class App extends React.Component<App.propTypes> {
    state = {
        questions: null,
        newUserName: '',
        currentUser: null,
        currentQuestion: null,
        showPolls: false,
        showCreateQuestion: false,
    };

    async componentDidMount(): void {
        const {store} = this.props;
        const {userStore} = store.getState();
        const questions = await questionData._getQuestions();
        const {user} = await userStore;
        this.setState({questions, currentUser: user});
    }

    async user() {
        const {store, history} = this.props;
        const {userStore} = store.getState();
        const {user} = (await userStore);
        if (user) {
            return user;
        } else {
            console.warn("No User logged in. Logging out");
            history.push('/login');
        }
    }

    render() {
        const {store, history} = this.props;

        const {questions, currentUser, currentQuestion, showPolls, showCreateQuestion} = this.state;
        this.user().then();

        store.subscribe(async () => {
            await this.user().then((user) => {
                console.debug("User refreshed");
                this.setState({currentUser: user})
            })
        });
        if (!questions || !currentUser) {
            return <div/>
        }

        const questionsArray = objectToArray(questions);
        const question = questionsArray[randomNumber(0, questionsArray.length - 1)];

        store.subscribe(() => {
            if (question !== currentQuestion && showPolls) {
                this.setState({currentQuestion: question, showPolls: false})
            }
        });
        const cqq = currentQuestion || question;
        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo"/>
                </header>
                <div>
                    <QuestionBlock title={`${currentUser.name} would you rather...`}
                                   question={cqq} store={store}/>
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
};
export default withRouter(App);