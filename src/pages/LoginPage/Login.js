import UserSelector from "../../components/userSelector/UserSelector";
import * as React from "react";
import PropTypes from "prop-types";
import {withRouter} from "react-router-dom";
import {Routes} from "../../static/assets/Routes";
import * as questionData from "../../_DATA";

class LoginPage extends React.Component<LoginPage.propTypes> {
    constructor(props) {
        super(props);
        this.state = {
            users: null,
        };
    }

    async componentDidMount(): void {
        const {authStore, history} = this.props;
        authStore(history);
        const users = await questionData._getUsers();
        this.setState({users});
    }

    render() {
        const {newUserName, users} = this.state;
        const {store, history, authStore} = this.props;

        if (!users) {
            return <div/>;
        }
        return (<div>
                <h2>Login</h2>
                <div>Select User</div>
                <UserSelector users={users} store={store} onUpdate={authStore(history)}/>
                {/*<div>Or</div>*/}
                {/*<DefaultInput value={newUserName} placeholder="Your name" autocomplete="name"*/}
                {/*              onChange={(event) => console.log(event.target.value)}/>*/}
            </div>
        );
    }
}

LoginPage.propTypes = {
    store: PropTypes.object.isRequired,
    authStore: PropTypes.func.isRequired,
};
export default withRouter(LoginPage);