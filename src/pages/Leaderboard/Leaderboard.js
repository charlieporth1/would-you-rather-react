import * as React from "react";
import {withRouter} from "react-router";
import PropTypes from 'prop-types';
import './Leaderboard.css';
import * as questionData from "../../_DATA";
import {makeCleanClassName, objectToArray} from "../../utils/utils";

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
        const sortTopQuestions = (a,b)=> a.questions.length - b.questions.length;
        const sortedTopAnsweredQuestionUser = users.sort(sortTopQuestions);
        return (<div className={makeCleanClassName(['leaderboard-container'])}>
            <h1>Leaderboard</h1>
            <div className={makeCleanClassName(['leaderboard-data'])}>
                <h3 className={makeCleanClassName(['leaderboard-data-grid-item'])}>
                    Most answered questions
                </h3>
                <div style={{display: 'block'}} className={makeCleanClassName(['leaderboard-data-grid-item'])}>
                {sortedTopAnsweredQuestionUser.map((user)=> {
                    return <p>{user.name}</p>
                })}
                </div>
                <h3 className={makeCleanClassName(['leaderboard-data-grid-item'])}>
                    Number of questions answered
                </h3>
                <div style={{display: 'block'}} className={makeCleanClassName(['leaderboard-data-grid-item'])}>
                {sortedTopAnsweredQuestionUser.map((user)=> {
                    return <p>{user.questions.length}</p>
                })}
                </div>
            </div>
        </div>);
    }
}
export default withRouter(Leaderboard);
Leaderboard.propTypes = {
    store:PropTypes.object.isRequired,
    authStore: PropTypes.func.isRequired,
};