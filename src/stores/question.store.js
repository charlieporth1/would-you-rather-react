import * as questionData from '../_DATA';


export function questionReducer(state = {questions: questionData._getQuestions()}, action) {
    switch (action.type) {
        case 'counter/incremented':
            return {questions: {}};
        case 'question/addAnswer':
            const {authedUser, qid, answer} = action.payload;
            questionData._saveQuestionAnswer({authedUser, qid, answer});
            return {questions: questionData._getQuestions()};
        case 'user/addQuestion':
            return {questions: {}};
        default:
            return state
    }
}

