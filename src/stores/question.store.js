import * as questionData from '../_DATA';
import {objectToArray, onlyUnique} from "../utils/utils";

async function getQuestions() {
    const questions = await questionData._getQuestions();
    return questions;
}

export async function questionReducer(state = {
    questions: getQuestions(),
    newQuestion: null,
    currentQuestion: null,
    savedQuestion: null,
    questionsArray: []
}, action) {
    switch (action.type) {
        case 'question/addAnswer':
            const {authedUser, qid, answer} = action.payload;
            const savedQuestion = await questionData._saveQuestionAnswer({authedUser, qid, answer});
            const q = await getQuestions();
            const qa = (await objectToArray(q)).filter(onlyUnique);
            return await {questions:q, questionsArray:qa, savedQuestion, ...state};
        case 'question/addQuestion':
            const {optionOneText, optionTwoText, author} = action.payload;
            const newQuestion = await questionData._saveQuestion({optionOneText, optionTwoText, author});
            const q1 = await getQuestions();
            const qa1 = (await objectToArray(q1)).filter(onlyUnique);
            return await {questions:q1, questionsArray:qa1, newQuestion, ...state};
        case 'question/getQuestions':
            const questions = await getQuestions();
            const questionsArray = (await objectToArray(questions)).filter(onlyUnique);
            return await {questions, questionsArray, ...state};
        default:
            return state
    }
}