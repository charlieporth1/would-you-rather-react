import UserSelector from "../../components/userSelector/UserSelector";
import DefaultInput from "../../components/inputs/DefaultInput";
import * as questionData from "../../_DATA";
import * as React from "react";
import PropTypes from "prop-types";
import {withRouter} from "react-router-dom";
import {history} from "../../stores/configure.store";


class LoginPage extends React.Component<> {
    constructor(props) {
        super(props);
        this.state = {
            users: null,
        };
    }

    async componentDidMount(): void {
        const users = await questionData._getUsers();
        const {authStore, history} = this.props;
        authStore(history);
        this.setState({users});

    }

    render() {
        const {newUserName, users} = this.state;
        const {store, authStore, history} = this.props;

        if (!users) {
            return <div/>;
        }
        return (<div>
                <h2>Login</h2>
                <div>Select User</div>
                <UserSelector users={users} store={store}/>
                {/*<div>Or</div>*/}
                {/*<DefaultInput value={newUserName} placeholder="Your name" autocomplete="name"*/}
                {/*              onChange={(event) => console.log(event.target.value)}/>*/}
            </div>
        );
    }
}

LoginPage.propTypes = {
    store: PropTypes.object,
    authStore: PropTypes.func,
};
export default withRouter(LoginPage);