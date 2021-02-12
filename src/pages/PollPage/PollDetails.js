import ViewPolls from "../../components/viewPolls/ViewPolls";
import PropTypes from "prop-types";
import React from "react";
import {withRouter} from "react-router-dom";
import {makeCleanClassName} from "../../utils/utils";
import './PollDetails.css'
class PollDetails extends React.Component<PollDetails.propTypes> {
    constructor(props) {
        super(props);
        this.state = {
            questions: null,
        }
    }

    async componentDidMount(): void {
        const {store, authStore, history} = this.props;
        authStore(history);
        store.dispatch({type: 'question/getQuestions'});
        const {questionStore} = store.getState();
        const {questions} = await questionStore;
        this.setState({questions});
    }

    render() {
        const {questionId} = this.props;
        const {questions} = this.state;
        if (!questions) {
            return <div/>
        }
        const question = questions[questionId];
        return (
            <div className={makeCleanClassName(['poll-details-container'])}>
                <div className={makeCleanClassName(['poll-details-data-element'])}>
                <ViewPolls containerClass={['view-polls-container', 'm-design']} question={question} title="Would you rather..."/>
                </div>
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