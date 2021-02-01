export default class User {
    id = '';
    name = '';
    avatarURL = '';
    answers = {};
    questions = [];

    constructor(param: Partial<User>) {
        const {
            name = 'Charles Porth',
            avatarURL = '',
            answers = {},
            questions = []
        } = param;
        this.id = name.replace(" ", "");
        this.name = name;
        this.avatarURL = avatarURL;
        this.answers = {...this.answers, answers};
        this.questions = [...this.questions, questions];
    }
}