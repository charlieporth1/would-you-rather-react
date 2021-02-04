import React from "react";
import PropTypes from "prop-types";
import './UserSelector.css';
import {makeCleanClassName, objectToArray} from "../../utils/utils";

export default class UserSelector extends React.Component<UserSelector.propTypes> {

    onStatusChange(userId) {
        const {store} = this.props;
        store.dispatch({type: "login/id", payload: {userId}});
    }

    render() {
        let {users, store} = this.props;
        users = objectToArray(users);
        return (<select className={makeCleanClassName(["user-selector-select"])}
                        value={store.getState(user=> user) || users[0]}
                        onChange={(event) => this.onStatusChange(event.target.value)}>
            {users.map((user) => <option key={user.id} value={user.id}>{user.name}</option>)}
        </select>);
    }
}
UserSelector.propTypes = {
    users: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired,
};