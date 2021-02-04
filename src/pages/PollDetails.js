import ViewPolls from "../components/viewPolls/ViewPolls";
import PropTypes from "prop-types";
import React from "react";
import * as questionData from "../_DATA";
import {withRouter} from "react-router-dom";

class PollDetails extends React.Component<PollDetails.propTypes> {
    constructor(props) {
        super(props);
        this.state = {
            questions: null,
        }
    }

    async componentDidMount(): void {
        const questions = await questionData._getQuestions();
        this.setState({questions});
    }

    render() {
        const {questionId} = this.props;
        const {questions} = this.state;
        const question = questions[questionId];
        return (<ViewPolls question={question} title="Would you rather..."/>)
    }
}

PollDetails.propTypes = {
    questionId: PropTypes.object.isRequired,
};

export default withRouter(PollDetails);