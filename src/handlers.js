const joinQuiz = (quizState, { name }) => {
    const newPlayer = {
        name,
        score: 0,
    };
    const newQuizState = {
        ...quizState,
        players: [...quizState.players, newPlayer],
    };

    return {
        newQuizState,
        messages: [{ type: "stateUpdated", data: newQuizState }],
    };
};

const askQuestion = (quizState, { name, text }) => {
    const newQuizState = {
        ...quizState,
        currentQuestion: {
            name,
            text,
            answers: {},
            forceMark: false,
        },
    };
    return {
        newQuizState,
        messages: [{ type: "stateUpdated", data: newQuizState }],
    };
};

const answerQuestion = (quizState, { name, answer }) => {
    const newQuizState = {
        ...quizState,
    };
    newQuizState.currentQuestion.answers[name] = answer;
    return {
        newQuizState,
        messages: [{ type: "stateUpdated", data: newQuizState }],
    };
};

const showScores = (quizState, { admin }) => {
    const newQuizState = {
        ...quizState,
        showScores: !quizState.showScores,
    };
    return {
        newQuizState,
        messages: [
            { type: "stateUpdated", data: newQuizState },
            {
                type: "scoresToggled",
                data: { toggle: newQuizState.showScores, admin },
            },
        ],
    };
};

const applyResults = (quizState, { results }) => {
    const newPlayers = quizState.players.map((player) => ({
        ...player,
        score: player.score + (results[player.name] ?? 0),
    }));
    const newQuizState = {
        ...quizState,
        players: newPlayers,
        currentQuestion: null,
    };

    return {
        newQuizState,
        messages: [{ type: "stateUpdated", data: newQuizState }],
    };
};

const forceMark = (quizState) => {
    const newQuizState = {
        ...quizState,
        currentQuestion: { ...quizState.currentQuestion, forceMark: true },
    };

    return {
        newQuizState,
        messages: [{ type: "stateUpdated", data: newQuizState }],
    };
};

const handleTyping = (quizState, { name, active }) => {
    const newTyping = !active
        ? quizState.typing.filter((player) => player != name)
        : !quizState.typing.includes(name)
        ? quizState.typing.concat(name)
        : quizState.typing;
    const newQuizState = {
        ...quizState,
        typing: newTyping,
    };

    return {
        newQuizState,
        messages: [{ type: "stateUpdated", data: newQuizState }],
    };
};

const finishQuiz = (quizState, { name }) => {
    const newQuizState = {
        ...quizState,
        active: false,
    };
    return {
        newQuizState,
        messages: [
            { type: "stateUpdated", data: newQuizState },
            { type: "quizFinished", data: name },
        ],
    };
};

const adjustScores = (quizState, { scores, admin }) => {
    const playersAdjusted = quizState.players
        .filter((player) => scores[player.name] != player.score)
        .map((player) => player.name);

    const newPlayers = quizState.players.map((player) => ({
        ...player,
        score: scores[player.name] ?? player.score,
    }));
    const newQuizState = { ...quizState, players: newPlayers };
    return {
        newQuizState,
        messages: [
            { type: "stateUpdated", data: newQuizState },
            {
                type: "scoresAdjusted",
                data: { playersAdjusted: playersAdjusted ?? [], admin },
            },
        ],
    };
};

const removePlayer = (quizState, { name, admin }) => {
    const newQuizState = {
        ...quizState,
        players: quizState.players.filter((player) => player.name != name),
    };
    return {
        newQuizState: newQuizState,
        messages: [
            { type: "stateUpdated", data: newQuizState },
            {
                type: "playerRemoved",
                data: { name, admin },
            },
        ],
    };
};

const handlers = {
    join: joinQuiz,
    ask: askQuestion,
    answer: answerQuestion,
    showScores: showScores,
    results: applyResults,
    forceMark: forceMark,
    typing: handleTyping,
    finish: finishQuiz,
    adjustScores: adjustScores,
    removePlayer: removePlayer,
};

module.exports = { handlers };
