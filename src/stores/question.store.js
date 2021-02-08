import * as questionData from '../_DATA';
import {objectToArray} from "../utils/utils";
async function getQuestions() {
    const questions = await questionData._getQuestions();
    return questions;
}

export async function questionReducer(state = {questions: getQuestions(), newQuestion: null, currentQuestion:null, savedQuestion: null, questionsArray: null}, action) {
    switch (action.type) {
        case 'counter/incremented':
            return {questions: {}, ...state};
        case 'question/addAnswer':
            const {authedUser, qid, answer} = action.payload;
            const savedQuestion = await questionData._saveQuestionAnswer({authedUser, qid, answer});
            return {questions: await getQuestions(), savedQuestion, ...state};
        case 'question/addQuestion':
            const {optionOneText, optionTwoText, author} = action.payload;
            const newQuestion = await questionData._saveQuestion({optionOneText, optionTwoText, author});
            return {questions: await getQuestions(), newQuestion, ...state};
        case 'question/getQuestions':
            const questions = await getQuestions();
            const questionsArray = await objectToArray(questions);
            return {questions, questionsArray, ...state};
        default:
            return state
    }
}