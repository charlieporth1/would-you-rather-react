import logo from './logo.svg';
import './App.css';
import * as questionData from '../_DATA';
import * as React from "react";
import QuestionBlock from "../components/questionBlock/QuestionBlock";
import {objectToArray, randomNumber} from "../utils/utils";
import RoundedButton from "../components/button/RoundedButton";
import ViewPolls from "../components/viewPolls/ViewPolls";
import PropTypes from "prop-types";
import {withRouter} from "react-router-dom";
import configureStore from "../stores/configure.store";

class App extends React.Component<App.propTypes> {
    state = {
        questions: null,
        newUserName: '',
        currentUser: null,
        currentQuestion: null,
        showPolls: false,
    };

    async componentDidMount(): void {
        const {store} = this.props;
        const {userStore} = store.getState();
        const questions = await questionData._getQuestions();
        const {user} = await userStore;
        this.setState({questions, currentUser: user});
    }

    render() {
        const {store, history} = this.props;
        const {userStore, questionStore} = store.getState();
        const {questions, currentUser, currentQuestion, showPolls} = this.state;

        store.subscribe(async () => {
            const {user} = (await userStore);
            if (user) {
                console.warn("User refreshed");
                this.setState({currentUser: user});
            }
        });
        if (!questions || !currentUser) {
            return <div/>
        }

        const questionsArray = objectToArray(questions);
        const question = questionsArray[randomNumber(0, questionsArray.length - 1)];

        store.subscribe(() => {
            if (question !== currentQuestion && showPolls) {
                console.log(currentUser);
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
                    <RoundedButton title="Show Results"
                                   onClick={() => this.setState({showPolls: !showPolls})}/>
                    {showPolls && history.push(`/questions/${cqq.id}`) }
                </div>
            </div>
        );
    }
}


App.propTypes = {
    store: PropTypes.object,
};
export default withRouter(App);