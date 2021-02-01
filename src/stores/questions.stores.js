import {createStore} from 'redux'
import User from "../models/users.model";

let users: User[] = [];

function userQuestionReducer(state = {user: new User(), value: 0}, action) {
    const currentUsers:User[] = users.filter(users === state.user);
    let currentUser:User;
    if (currentUsers.length <= 0) {
        users.push(state.user);
        currentUser = state.user;
    } else {
        currentUser = currentUsers.shift();
    }

    switch (action.type) {
        case 'counter/incremented':
            return {user: currentUser, value: state.value + 1};
        case 'counter/decremented':
            return {user: currentUser, value: state.value - 1};
        default:
            return state
    }
}

let store = createStore(userQuestionReducer);

store.subscribe(() => console.log(store.getState()));

// The only way to mutate the internal state is to dispatch an action.
// The actions can be serialized, logged or stored and later replayed.
// store.dispatch({ type: 'counter/incremented' });
// {value: 1}
// store.dispatch({ type: 'counter/incremented' });
// {value: 2}
store.dispatch({type: 'counter/decremented'});