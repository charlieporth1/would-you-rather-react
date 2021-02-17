import ViewPolls from "../../components/viewPolls/ViewPolls";
import PropTypes from "prop-types";
import React from "react";
import {withRouter} from "react-router-dom";
import {makeCleanClassName} from "../../utils/utils";
import './PollDetails.css'
import RoundedButton from "../../components/button/RoundedButton";
import {Routes} from "../../static/assets/Routes";
import {push} from 'connected-react-router'

class PollDetails extends React.Component<PollDetails.propTypes> {
    constructor(props) {
        super(props);
        this.state = {
            questions: null,
        }
    }
    async componentWillMount():void {
        const {store, authStore, history} = this.props;
        authStore(history);
        store.dispatch({type: 'question/getQuestions'});
        const {questionStore} = store.getState();
        const {questions} = await questionStore;
        const {router} = store.getState() || {location: null};
        const {state} = router.location;
        const {currentUser} = state || {currentUser: null};
        this.setState({currentUser, questions})
    }

    render() {
        const {questionId, store} = this.props;
        const {questions, currentUser} = this.state;
        if (!questions) {
            return <div/>
        }
        const question = questions[questionId];
        return (
            <div className={makeCleanClassName(['poll-details-container'])}>
                <div className={makeCleanClassName(['poll-details-data-element'])}>
                    <ViewPolls containerClass={['view-polls-container', 'm-design']} question={question}
                               title="Would you rather..." user={currentUser}/>
                    <RoundedButton title="Next question" onClick={() => store.dispatch(push(Routes.home))}/>
                </div>
            </div>
        )
    }
}

PollDetails.propTypes = {
    questionId: PropTypes.string.isRequired,
    store: PropTypes.object.isRequired,
    authStore: PropTypes.func.isRequired,
};

export default withRouter(PollDetails);