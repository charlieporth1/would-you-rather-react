import * as React from "react";
import PropTypes from 'prop-types';
import DefaultInput from "../../components/inputs/DefaultInput";
import RoundedButton from "../../components/button/RoundedButton";
import {withRouter} from "react-router-dom";
import {makeCleanClassName} from "../../utils/utils";
import './CreateQuestionPage.css';

class CreateQuestionPage extends React.Component<CreateQuestionPage.propTypes> {
    constructor(props) {
        super(props);
        this.state = {
            optionOneText: null,
            optionTwoText: null,
        }
    }

    saveNewQuestion = async ({optionOneText, optionTwoText, author}) => {
        const {store, history} = this.props;
        store.dispatch({type: 'question/addQuestion', payload: {optionOneText, optionTwoText, author}});
        alert("Question Saved");
        history.push('/home');
    };


    async onSave() {
        const {optionOneText, optionTwoText} = this.state;
        const {store} = this.props;
        const {userStore} = store.getState();
        const {user} = await userStore;
        const author = user.id;
        await this.saveNewQuestion({optionOneText, optionTwoText, author})
    }

    render() {
        const {authStore, history} = this.props;
        // authStore(history);
        return (<div className={makeCleanClassName(['create-question-page-container'])}>
            <h1 className={makeCleanClassName(['title-create-question'])}>Create a question</h1>

            <h2 className={makeCleanClassName(['default-question-h2-create-question'])}>Would you rather...</h2>
            <div className={makeCleanClassName(['root-container-create-question'])}>
                <DefaultInput placeholder={"Option one"}
                              onChange={(event) => this.setState({optionOneText: event.target.value})}
                              classNames={makeCleanClassName(['create-question-page-input'])}/>
                <DefaultInput placeholder={"Option two"}
                              onChange={(event) => this.setState({optionTwoText: event.target.value})}
                              classNames={makeCleanClassName(['create-question-page-input'])}/>

                <RoundedButton classNames={makeCleanClassName(['create-question-page-save-btn'])}
                               title="Save"
                               onClick={async () => await this.onSave()}/>
            </div>
        </div>);
    }
}

CreateQuestionPage.propTypes = {
    store: PropTypes.object.isRequired,
    authStore: PropTypes.func,
};
export default withRouter(CreateQuestionPage);