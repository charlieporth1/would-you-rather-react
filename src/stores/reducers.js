import {combineReducers} from "redux";
import {connectRouter} from "connected-react-router";
import {userReducer} from "./user.store";
import {questionReducer} from "./question.store";

const createRootReducer = (history) => combineReducers({
    router: connectRouter(history),
    userStore: userReducer,
    questionStore: questionReducer,
});
export default createRootReducer