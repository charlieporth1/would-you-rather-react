import logo from './logo.svg';
import './App.css';
import * as questionData from '../_DATA';

import * as React from "react";
import DefaultInput from "../components/inputs/DefaultInput";
import User from "../models/users.model";
import QuestionBlock from "../components/questionBlock/QuestionBlock";
import {addUser} from "../stores/user.store";

class App extends React.Component<> {
    state = {
        users:null,
        questions: null,
        newUserName: '',
    };

    async componentWillMount(): void {
        const users =  await questionData._getUsers();
        const questions = await questionData._getQuestions();
        console.log(questions, users);
        this.setState({users, questions})
    }
    render() {
        const {newUserName, users, questions } = this.state;
        console.log(questions, users);
        if (!questions && !users) {
            return <div/>
        }
        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo"/>
                </header>
                <body>
                    <DefaultInput value={newUserName} placeholder={"Your name"} autocomplete="name"
                    onChange={(event)=> addUser(event.target.value)}/>
                    <QuestionBlock title={"Would you rather..."} question={questions['8xf0y6ziyjabvozdd253nd']}/>
                </body>
            </div>
        );
    }
}

export default App;
