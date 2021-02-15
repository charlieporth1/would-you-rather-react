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
import {isArrayEquals, objectToArray, runOnce, uuidv4} from "./utils/utils";
import {Routes} from "./static/assets/Routes";
import Leaderboard from "./pages/Leaderboard/Leaderboard";

const store = configureStore();
export const isAuthStore = (history, windowListener: string = 'logout', goHome: boolean = false): string => {
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
    const listener = store.subscribe(() => runOnce(async () => {
        result = await isAuthAutoLogOut();
        console.log("result ", result);
        if (history && result)
            history.push(result);
    }, windowListener));
};
const refreshQuestions = (): void => {
    console.debug("refreshQuestions");
    const refresher = async (uuid) => {
        const {questionStore} = store.getState();
        const {questionsArray = [], questions = {}} = await questionStore;
        const newQuestionsArray = await objectToArray(questions);
        if (!isArrayEquals(questionsArray, newQuestionsArray)) {
            runOnce(() => {
                console.log("Questions refreshed");
                store.dispatch({type: 'question/getQuestions'});
            }, `questionBlock${uuid}`);
        } else {
            console.log("Questions not refreshed");
        }
    };
    const listener = store.subscribe(() => runOnce(async () => await refresher(uuidv4().toString().substr(0,4))));
};
ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <ConnectedRouter history={history}>
                <div>
                    <Switch>
                        <Route exact path={Routes.login} render={(props) => <LoginPage {...props} store={store}
                                                                                       authStore={(history) => isAuthStore(history, 'login', true)}/>}/>
                        <Route exact path={Routes.home} render={(props) => <App {...props} store={store}
                                                                                authStore={(history) => isAuthStore(history)}/>}/>
                        <Route exact path={Routes.createQuestion}
                               render={(props) => <CreateQuestionPage {...props}
                                                                      store={store}


                                                                      authStore={(history) => isAuthStore(history)}
                               />}/> {/* This needs to come first because react doesn't know if create is an id or not*/}
                        <Route path="/questions/:question_id"
                               render={(props) => <PollDetails {...props} store={store}
                                                               authStore={(history) => isAuthStore(history)}
                                                               questionId={props.match.params.question_id}/>}/>
                        <Route exact path={Routes.leaderboard}
                               render={(props) => <Leaderboard {...props} store={store}
                                                               authStore={(history) => isAuthStore(history)}/>}/>
                        <Redirect to={{pathname: Routes.login}}/>
                        {()=>refreshQuestions()()}
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
