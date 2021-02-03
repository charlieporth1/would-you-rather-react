import {createStore} from 'redux'
import User from "../models/users.model";
import * as questionData from "../_DATA";

let currentUser;
let name = '';

async function getUsers() {
    return await questionData._getUsers();
}

function userReducer(state = {user: null}, action) {
    return getUsers().then(users => {
        console.log(action);
        switch (action.type) {
            case 'addUser/name':
                const name = state.name;
                return {user: new User({name})};
            case 'login/id':
                return {user: users[action.payload.userId]};
            default:
                return state
        }
    });

}

let UserStore = createStore(userReducer);
UserStore.subscribe(async () => console.log(await UserStore.getState()));
export default UserStore;
export const addUser = (name = 'Charlie Porth') => {
    UserStore.dispatch({type: 'addUser/name', state: {name}});
};