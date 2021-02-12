import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {Route, Switch, Redirect} from "react-router";
import reportWebVitals from './utils/reportWebVitals';
import LoginPage from "./pages/LoginPage/Login";
import App from "./pages/AppPage/App";
import PollDetails from "./pages/PollPage/PollDetails";
import {Provider} from 'react-redux'
import configureStore, {history} from './stores/configure.store'
import {ConnectedRouter} from 'connected-react-router'
import CreateQuestionPage from "./pages/CreateQuestionPage/CreateQuestionPage";
import {isArrayEquals, objectToArray, runOnce} from "./utils/utils";
import {Routes} from "./static/assets/Routes";

const store = configureStore();
export const isAuthStore = async (history, goHome = false): string => {
    let result;
    const isAuthAutoLogOut = async (): string => {
        console.debug("isAuth");
        const {userStore} = store.getState();
        const {user} = await userStore;
        if (user && user.id) {
            console.debug("Logged in");
            if (goHome || !history) {
                console.debug("Going home");
                return Routes.home;
            }
        } else {
            console.debug("Logged out");
            return Routes.login;
        }
    };

    const listener = store.subscribe(async () => {
        result = await isAuthAutoLogOut();
        console.log("result ", result);
        if (history && result)
            history.push(result);
        if (goHome)
            await listener();
    });
    result = await isAuthAutoLogOut();
    return result
};
const refreshQuestions = (data): void => {
    console.debug("refreshQuestions");
    const refresher = async () => {
        const {questionStore} = store.getState();
        const {questionsArray = [], questions = {}} = await questionStore;
        const newQuestionsArray = await objectToArray(questions);
        if (!isArrayEquals(questionsArray, newQuestionsArray)) {
            console.log("Questions refreshed");
            runOnce(() => {
                store.dispatch({type: 'question/getQuestions'});
            });
            return data;
        } else {
            console.log("Questions not refreshed");
        }
        store.subscribe(async () => {
            await refresher();
        });
    };
};
ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <ConnectedRouter history={history}>
                <div>
                    <Switch>
                        <Route exact path={Routes.login} render={(props) => <LoginPage {...props} store={store}
                                                                                 authStore={(history) => isAuthStore(history, true)}/>}/>
                        <Route exact path={Routes.home} render={(props) => <App {...props} store={store}
                                                                          authStore={(history) => isAuthStore(history)}/>}/>
                        <Route path={Routes.createQuestion}
                               render={(props) => <CreateQuestionPage {...props}
                                                                      store={store}
                                                                      authStore={(history) => isAuthStore(history)}
                               />}/> {/* This needs to come first because react doesn't know if create is an id or not*/}
                        <Route path="/questions/:question_id"
                               render={(props) => <PollDetails {...props} store={store}
                                                               authStore={(history) => isAuthStore(history)}
                                                               questionId={props.match.params.question_id}/>}/>
                        <Redirect to={{pathname: '/login'}}/>
                        {(() => {
                            refreshQuestions();
                        })()}
                    </Switch>
                </div>
            </ConnectedRouter>
        </Provider>
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
