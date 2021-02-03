import logo from './logo.svg';
import './App.css';
import * as questionData from '../_DATA';

import * as React from "react";
import DefaultInput from "../components/inputs/DefaultInput";
import QuestionBlock from "../components/questionBlock/QuestionBlock";
import UserStore, {addUser} from "../stores/user.store";
import UserSelector from "../components/userSelector/UserSelector";
import {objectToArray, randomNumber} from "../utils/utils";
import QuestionStore from "../stores/question.store";

class App extends React.Component<> {
    state = {
        users: null,
        questions: null,
        newUserName: '',
        currentUser:null,
        currentQuestion:null,
    };

    async componentDidMount(): void {
        const users = await questionData._getUsers();
        const questions = await questionData._getQuestions();
        this.setState({users, questions});
    }

    LoginBlock() {
        const {newUserName, users} = this.state;
        return (<div>
                <UserSelector users={users}/>
                <DefaultInput value={newUserName} placeholder={"Your name"} autocomplete="name"
                              onChange={(event) => addUser(event.target.value)}/>
            </div>
        );
    }

    render() {
        const {questions, users, currentUser, currentQuestion} = this.state;
        UserStore.subscribe(()=> UserStore.getState().then(data=> {
            this.setState({currentUser: data.user})
        }));


        if (!questions && !users) {
            return <div/>
        }
        const questionsArray = objectToArray(questions);
        const question = questionsArray[randomNumber(0, questionsArray.length - 1)];
        QuestionStore.subscribe(()=> {
            if (question !== currentQuestion) {
                this.setState({currentQuestion: question})
            }
        });
        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo"/>
                </header>
                <body>
                {!currentUser ? this.LoginBlock() :
                    <QuestionBlock title={`${currentUser.name} would you rather...`} question={currentQuestion || question}/>
                }
                </body>
            </div>
        );
    }
}

export default App;
