import * as React from "react";
import {withRouter} from "react-router";
import PropTypes from 'prop-types';
import './Leaderboard.css';
import * as questionData from "../../_DATA";
import {objectToArray} from "../../utils/utils";

class Leaderboard extends React.Component<Leaderboard.propTypes > {
    state = {
        users: [],
    };
    async componentDidMount(): void {
        const {authStore, history} = this.props;
        authStore(history);
        const users = await objectToArray(await questionData._getUsers());
        this.setState({users});
    }

    render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        const {users} = this.state;
        if (!users) {
            return <div/>;
        }
        const sortedTopAnsweredQuestionUser = users.sort((a,b)=> a.questions.length - b.questions.length);
        return (<div>
                <h2>
                    Most answered questions
                </h2>
            {sortedTopAnsweredQuestionUser.map((user)=> {
                return <p>{user.name}</p>
            })}
        </div>);
    }
}
export default withRouter(Leaderboard);
Leaderboard.propTypes = {
    store:PropTypes.object.isRequired,
    authStore: PropTypes.func.isRequired,
};