import { createStore} from 'redux'
import User from "../models/users.model";
import * as questionData from "../_DATA";

async function getUsers() {
    return await questionData._getUsers();
}

export function userReducer(state = {user: null}, action) {
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

// let UserStore = createStore();
// UserStore.subscribe(async () => console.log(await UserStore.getState()));
//
export const addUser = (name = 'Charlie Porth') => {
    userReducer().dispatch({type: 'addUser/name', state: {name}});
};
//
//
// export default UserStore;