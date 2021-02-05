import UserSelector from "../../components/userSelector/UserSelector";
import DefaultInput from "../../components/inputs/DefaultInput";
import {addUser} from "../../stores/user.store";
import * as questionData from "../../_DATA";
import * as React from "react";
import PropTypes from "prop-types";
import {withRouter} from "react-router-dom";


class LoginPage extends React.Component<> {
    constructor(props) {
        super(props);
        this.state = {
            users: null,
        };
    }

    async componentDidMount(): void {
        const users = await questionData._getUsers();
        this.setState({users});

    }

    render() {
        const {newUserName, users} = this.state;
        const {history, store} = this.props;

        store.subscribe(async () => {
            const {userStore} = store.getState();
            const {user} = (await userStore);
            if (user) {
                history.push('/home');
            }
        });
        if (!users) {
            return <div/>;
        }

        return (<div>
                <UserSelector users={users} store={store}/>
                <DefaultInput value={newUserName} placeholder="Your name" autocomplete="name"
                              onChange={(event) => addUser(event.target.value)}/>
            </div>
        );
    }
}

LoginPage.propTypes = {
    store: PropTypes.object,
    userStore: PropTypes.object,
};
export default withRouter(LoginPage);