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
import CreateQuestionPage from "./pages/CreateQuestionPage/CreateQuestionPage";
import {isArrayEquals, objectToArray, runOnce} from "./utils/utils";

const store = configureStore();
const isAuthStore = async (history, goHome = false): void => {
    const isAuthAutoLogOut = async () => {
        console.debug("isAuth");
        const {userStore} = store.getState();
        const {user} = await userStore;
        if (user && user.id) {
            console.debug("Logged in");
            if (goHome) {
                console.debug("Going home");
                history.push('/home');
            }
        } else {
            console.debug("Logged out");
            history.push('/login');
        }
    };
    const listener = store.subscribe(async () => {
        await isAuthAutoLogOut();
        if (goHome)
            await listener();
    });
};
const refreshQuestions = (data): void => {
    console.debug("refreshQuestions");
    const refresher = async () => {
            const {questionStore} = store.getState();
            const {questionsArray = [], questions = {}} = await questionStore;
            const newQuestionsArray = await objectToArray(questions);
            if (!isArrayEquals(questionsArray, newQuestionsArray)) {
                console.log("Questions refreshed");
                store.dispatch({type: 'question/getQuestions'});
                return data;
            } else {
                console.log("Questions not refreshed");
            }
        const listener = store.subscribe(async () => {
            await refresher();
        });
        // setTimeout(() => listener(), 500);
    };


};

ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <ConnectedRouter history={history}>
                <Router>
                    <Switch>
                        <Route exact path='/login' render={(props) => <LoginPage {...props} store={store}
                                                                                 authStore={(history) => isAuthStore(history, true)}/>}/>
                        <Route exact path='/home' render={(props) => <App {...props} store={store}
                                                                          authStore={(history) => isAuthStore(history)}/>}/>
                        <Route path="/questions/create"
                               render={(props) => <CreateQuestionPage {...props}
                                                                      store={store}
                                                                      />}/> {/* This needs to come first because react doesn't know if create is an id or not*/}
                        <Route path="/questions/:question_id" render={(props) => <PollDetails {...props} store={store}
                                                                                              questionId={props.match.params.question_id}/>}/>
                        <Redirect to={'/login'}/>
                        {(()=> {
                            refreshQuestions();
                        })()}
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
