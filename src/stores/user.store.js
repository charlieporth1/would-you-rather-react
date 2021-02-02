
import {createStore} from 'redux'
import User from "../models/users.model";
let currentUser;
let name ='';

function userQuestionReducer(state = {user: new User({}), name: 'Charles Porth' }, action) {

    switch (action.type) {
        case 'addUser/name':
            const name = state.name;
            return {user: new User({name})};
        default:
            return state
    }
}

let UserStore = createStore(userQuestionReducer);
UserStore.subscribe(() => console.log(UserStore.getState()));
export default UserStore;
export const addUser =(name = 'Charlie Porth')=> {
    UserStore.dispatch({type: 'addUser/name', state: {name}});
};