import logo from './logo.svg';
import './App.css';
import * as questionData from '../_DATA';

import * as React from "react";

export default class App extends React.Component<> {

    state = {
        users: [],
        questions: [],
    };

    componentWillMount(): void {
        const users = questionData._getUsers();
        const questions = questionData._getQuestions();
        this.setState({users, questions})
    }

    render() {

        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo"/>
                </header>
                <body>

                </body>
            </div>
        );
    }
}

export default App;
