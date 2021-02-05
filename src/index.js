import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {BrowserRouter as Router, Route, Switch, Redirect} from "react-router-dom";
import reportWebVitals from './utils/reportWebVitals';
import LoginPage from "./pages/LoginPage/Login";
import App from "./pages/AppPage/App";
import PollDetails from "./pages/PollPage/PollDetails";
import {Provider} from 'react-redux'
import configureStore, {history} from './stores/configure.store'
import {ConnectedRouter} from 'connected-react-router'

const store = configureStore();
// const {userStore, questionStore} = store.getState();
ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <ConnectedRouter history={history}>
                <Router>
                    <Switch>
                        <Route exact path='/login' render={(props) => <LoginPage {...props} store={store}/>}/>
                        <Route exact path='/home' render={(props) => <App {...props} store={store}/>}/>
                        <Route path="/questions/:question_id" render={(props) => <PollDetails {...props} questionId={props.match.params.question_id}/>}/>
                        <Redirect to={'/login'}/>
                    </Switch>
                </Router>
            </ConnectedRouter>
        </Provider>
    </React.StrictMode>
    ,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
