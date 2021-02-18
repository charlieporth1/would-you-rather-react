import * as React from "react";
import {withRouter} from "react-router";
import PropTypes from 'prop-types';
import './Leaderboard.css';
import {
    makeCleanClassName,
    objectToArray,
    objectToArrayNonAsync,
} from "../../utils/utils";

class Leaderboard extends React.Component<Leaderboard.propTypes> {
    constructor(props: any) {
        super(props);
        this.state = {
            users: [],
        };
    }

    async componentWillMount(): void {
        const {authStore, history, store} = this.props;
        authStore(history);
        store.dispatch({type: 'user/getUsers'});
        const {userStore} = store.getState();
        let {users} = await userStore;
        users = await objectToArray(users);
        this.setState({users});
    }

    render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        const {users} = this.state;
        if (!users) {
            return <div/>;
        }
        const sortTopQuestions = (a, b) => objectToArrayNonAsync(a.answers).length - objectToArrayNonAsync(b.answers).length;
        const sortTopAsks = (a, b) => a.questions.length - b.questions.length;
        const sortTopQuestionsDescending = (a, b): number => sortTopQuestions(b, a);
        const sortTopAsksDescending = (a, b): number => sortTopAsks(b, a);
        const sortedTopAnsweredQuestionUser = users.sort(sortTopQuestionsDescending);
        const sortedTopAskedQuestionUser = users.sort(sortTopAsksDescending);
        return (<div className={makeCleanClassName(['leaderboard-container'])}>
            <h1>Leaderboard</h1>
            <div className={makeCleanClassName(['leaderboard-data'])}>
                <h3 className={makeCleanClassName(['leaderboard-data-grid-item'])}>
                    Most answered questions
                </h3>
                <div style={{display: 'block'}} className={makeCleanClassName(['leaderboard-data-grid-item'])}>
                    {sortedTopAnsweredQuestionUser.map((user, index) => {
                        return <p key={`${index}-name`}>{user.name}</p>
                    })}
                </div>
                <h3 className={makeCleanClassName(['leaderboard-data-grid-item'])}>
                    Number of questions answered
                </h3>
                <div style={{display: 'block'}} className={makeCleanClassName(['leaderboard-data-grid-item'])}>
                    {sortedTopAnsweredQuestionUser.map((user, index) => {
                        const length = (objectToArrayNonAsync(user.answers)).length;
                        return <p key={`${index}-questions-l`}>{length}</p>
                    })}
                </div>
                <h3 className={makeCleanClassName(['leaderboard-data-grid-item'])}>
                    Number of questions submitted
                </h3>
                <div style={{display: 'block'}} className={makeCleanClassName(['leaderboard-data-grid-item'])}>
                    {sortedTopAskedQuestionUser.map((user, index) => {
                        const length = user.questions.length;
                        return <p key={`${index}-asks-l`}>{length}</p>
                    })}
                </div>
            </div>
        </div>);
    }
}

export default withRouter(Leaderboard);
Leaderboard.propTypes = {
    store: PropTypes.object.isRequired,
    authStore: PropTypes.func.isRequired,
};