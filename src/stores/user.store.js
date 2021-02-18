import * as questionData from "../_DATA";

async function getUsers() {
    return await questionData._getUsers();
}

export async function userReducer(state = {user: null, users: getUsers()}, action) {
    const users = await getUsers();
        console.log(action);
        switch (action.type) {
            case 'user/addUser':
                const name = state.name;
                return {user: name};
            case 'login/id':
                return {user: users[action.payload.userId], ...state};
            case 'user/getUsers':
                const u = await getUsers();
                return {users:u, ...state} ;
            default:
                return state
        }

}

