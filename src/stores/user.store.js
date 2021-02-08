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
                return {user: name};
            case 'login/id':
                return {user: users[action.payload.userId]};
            default:
                return state
        }
    });

}

