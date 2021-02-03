import {createStore} from 'redux'
import * as questionData from '../_DATA';



function questionReducer(state = {questions: questionData._getQuestions()}, action) {
    switch (action.type) {
        case 'counter/incremented':
            return {questions:{}};
        case 'question/addAnswer':
            const {authedUser, qid, answer} = action.payload;
            questionData._saveQuestionAnswer({authedUser, qid, answer});
            return {questions:questionData._getQuestions()};
        case 'user/addQuestion':
            return {questions:{}};
        default:
            return state
    }
}

let QuestionStore = createStore(questionReducer);

QuestionStore.subscribe(() => console.log(QuestionStore.getState()));

// The only way to mutate the internal state is to dispatch an action.
// The actions can be serialized, logged or stored and later replayed.
// store.dispatch({ type: 'counter/incremented' });
// {value: 1}
// store.dispatch({ type: 'counter/incremented' });
// {value: 2}
QuestionStore.dispatch({type: 'counter/decremented'});


export default QuestionStore;