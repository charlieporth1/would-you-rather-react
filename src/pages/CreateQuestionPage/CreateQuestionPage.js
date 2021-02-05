import * as React from "react";
import PropTypes from 'prop-types';
import * as questionData from '../../_DATA';
import DefaultInput from "../../components/inputs/DefaultInput";
import RoundedButton from "../../components/button/RoundedButton";

export default class CreateQuestionPage extends React.Component<CreateQuestionPage.propTypes> {
    constructor(props) {
        super(props);
        this.state = {
            optionOne: null,
            optionTwo: null,
        }
    }

    saveNewQuestion = ({optionOneText, optionTwoText, author}) => {
        questionData._saveQuestion({optionOneText, optionTwoText, author});
        alert("Question Saved");
        this.props.history.push('/home');
    };

    onInputChange(event, inputName: string) {
        const value: string = event.target.value.toString() || '';
        switch (inputName.toLowerCase().trim()) {
            case "optionone":
                if (value !== '') {
                    this.setState({optionOne: value});
                }
                break;
            case "optiontwo":
                if (value !== '') {
                    this.setState({optionTwo: value});
                }
                break;
            default:
                break;
        }
    }

    async user() {
        const {store, history} = this.props;
        const {userStore} = store.getState();
        const {user} = (await userStore);

        if (user) {
            return user;
        } else {
            console.warn("No User logged in. Logging out");
            history.push('/login');
        }
    }


    async onSave() {
        const {optionOne, optionTwo} = this.state;
        const {store} = this.props;
        this.user().then();
        console.log(store);
        const {userStore} = store.getState();
        console.log(userStore);
        const {user} = await userStore;
        console.log(user);
        const author = user.id;
        this.saveNewQuestion({optionOne, optionTwo, author});
    }

    render() {

        return (<div>
            <h2>Would you rather...</h2>
            <DefaultInput placeholder={"Option one"} autocomplete={false}
                          onChange={(event) => this.onInputChange(event, "optionOne")}/>
            <DefaultInput placeholder={"Option two"} autocomplete={false}
                          onChange={(event) => this.onInputChange(event, "optionTwo")}/>
            <RoundedButton title={"Save"} onClick={async () => await this.onSave()}/>
        </div>);
    }
}
CreateQuestionPage.propTypes = {
    store: PropTypes.object.isRequired,
};