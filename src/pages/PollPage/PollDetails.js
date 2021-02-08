import ViewPolls from "../../components/viewPolls/ViewPolls";
import PropTypes from "prop-types";
import React from "react";
import {withRouter} from "react-router-dom";

class PollDetails extends React.Component<PollDetails.propTypes> {
    constructor(props) {
        super(props);
        this.state = {
            questions: null,
        }
    }

    async componentDidMount(): void {
        const {store} = this.props;
        store.dispatch({type: 'question/getQuestions'});
        const {questionStore} = store.getState();
        const {questions} = await questionStore;
        this.setState({questions});
    }

    render() {
        const {questionId, authStore, history} = this.props;
        const {questions} = this.state;
        // authStore(history);
        if (!questions) {
            return <div/>
        }
        const question = questions[questionId];
        return (
            <div>
                <ViewPolls question={question} title="Would you rather..."/>
            </div>
        )
    }
}

PollDetails.propTypes = {
    questionId: PropTypes.string.isRequired,
    store: PropTypes.object.isRequired,
    authStore: PropTypes.func,
};

export default withRouter(PollDetails);