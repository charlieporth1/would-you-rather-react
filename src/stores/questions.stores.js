import {createStore} from 'redux'
import User from "../models/users.model";

let users: User[] = [];

function userQuestionReducer(state = {user: new User({}), value: 0}, action) {
    const currentUsers:User[] | null = users.filter(users === state.user) || null;
    let currentUser:User;
    if (currentUsers.length <= 0) {
        users.push(state.user);
        currentUser = state.user;
    } else {
        currentUser = currentUsers.shift();
    }

    switch (action.type) {
        case 'counter/incremented':
            return {user: new User({...currentUser}), value: state.value + 1};
        case 'counter/decremented':
            return {user: new User({...currentUser}), value: state.value - 1};
        case 'user/addQuestion':
            return {user: new User({...currentUser}), value: state.value - 1};
        default:
            return state
    }
}
const updateUser = (oldUser:User, newUser:User):User => {
    const newUserList:User[] = users.filter(users !== oldUser);
    newUser = Object.assign(oldUser, newUser);
    newUserList.push(newUser);
    users = newUserList;
    return newUser;
};

let QuestionStore = createStore(userQuestionReducer);

QuestionStore.subscribe(() => console.log(QuestionStore.getState()));

// The only way to mutate the internal state is to dispatch an action.
// The actions can be serialized, logged or stored and later replayed.
// store.dispatch({ type: 'counter/incremented' });
// {value: 1}
// store.dispatch({ type: 'counter/incremented' });
// {value: 2}
QuestionStore.dispatch({type: 'counter/decremented'});


export default QuestionStore;