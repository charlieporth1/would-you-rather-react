import React from "react";
import PropTypes from "prop-types";
import './UserSelector.css';
import {makeCleanClassName, objectToArray, runOnce} from "../../utils/utils";
const defaultUser = {name: 'Select User', id: "selectuser"};
export default class UserSelector extends React.Component<UserSelector.propTypes> {
    state = {
        usersArray: []
    };


    onStatusChange(userId) {
        if (defaultUser.id !== userId) {
            const {store, onUpdate} = this.props;
            store.dispatch({type: "login/id", payload: {userId}});
            if (onUpdate) {
                runOnce(() => onUpdate());
            }

        } else {
            alert("Not a user select another user")
        }
    }

    async componentDidMount(): void {
        let {users} = this.props;
        let usersArray = await objectToArray(users);
        usersArray = [defaultUser, ...usersArray];
        this.setState({usersArray});
    }

    render() {
        const {usersArray} = this.state;
        console.log(usersArray);
        return (<select className={makeCleanClassName(["user-selector-select"])}
                        value={defaultUser}
                        onChange={(event) => this.onStatusChange(event.target.value)}>
            {usersArray.map((user) => <option key={user.id} value={user.id}>{user.name}</option>)}
        </select>);

    }
}
UserSelector.propTypes = {
    users: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired,
    onUpdate:PropTypes.func,
};