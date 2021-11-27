const { handlers } = require("../src/handlers");

// join
it("Adds new player to empty array", () => {
    const quizState = { players: [] };
    const name = "Jen";
    const expectedQuizState = { players: [{ name: "Jen", score: 0 }] };
    const result = {
        newQuizState: expectedQuizState,
        messages: [{ type: "stateUpdated", data: expectedQuizState }],
    };

    expect(handlers.join(quizState, { name })).toEqual(result);
});

it("Adds new player to non empty array", () => {
    const quizState = { players: [{ name: "James", score: 2 }] };
    const name = "Jen";
    const expectedQuizState = {
        players: [
            { name: "James", score: 2 },
            { name: "Jen", score: 0 },
        ],
    };
    const result = {
        newQuizState: expectedQuizState,
        messages: [{ type: "stateUpdated", data: expectedQuizState }],
    };

    expect(handlers.join(quizState, { name })).toEqual(result);
});

// askQuestion
it("Player asks question", () => {
    const name = "Jen";
    const text = "How many?";
    const expectedQuizState = {
        currentQuestion: {
            name,
            text,
            answers: {},
            forceMark: false,
        },
    };
    const result = {
        newQuizState: expectedQuizState,
        messages: [{ type: "stateUpdated", data: expectedQuizState }],
    };

    expect(handlers.ask({}, { name, text })).toEqual(result);
});

// answerQuestion

it("Player answers question", () => {
    const name = "Jen";
    const answer = "7";
    const quizState = { currentQuestion: { answers: {} } };
    const expectedQuizState = {
        currentQuestion: {
            answers: { Jen: "7" },
        },
    };
    const result = {
        newQuizState: expectedQuizState,
        messages: [{ type: "stateUpdated", data: expectedQuizState }],
    };

    expect(handlers.answer(quizState, { name, answer })).toEqual(result);
});

// Show scores

it("Admin toggles scores off", () => {
    const admin = "Jen";
    const quizState = { showScores: true };
    const expectedQuizState = {
        showScores: false,
    };
    const result = {
        newQuizState: expectedQuizState,
        messages: [
            { type: "stateUpdated", data: expectedQuizState },
            {
                type: "scoresToggled",
                data: { toggle: false, admin },
            },
        ],
    };

    expect(handlers.showScores(quizState, { admin })).toEqual(result);
});

it("Admin toggles scores on", () => {
    const admin = "Jen";
    const quizState = { showScores: false };
    const expectedQuizState = {
        showScores: true,
    };
    const result = {
        newQuizState: expectedQuizState,
        messages: [
            { type: "stateUpdated", data: expectedQuizState },
            {
                type: "scoresToggled",
                data: { toggle: true, admin },
            },
        ],
    };

    expect(handlers.showScores(quizState, { admin })).toEqual(result);
});

// apply results

it("Apply results", () => {
    const results = { Jen: 2, James: 6 };
    const quizState = {
        players: [
            { name: "Jen", score: 1 },
            { name: "James", score: 0 },
        ],
    };
    const expectedQuizState = {
        players: [
            { name: "Jen", score: 3 },
            { name: "James", score: 6 },
        ],
        currentQuestion: null,
    };
    const result = {
        newQuizState: expectedQuizState,
        messages: [{ type: "stateUpdated", data: expectedQuizState }],
    };

    expect(handlers.results(quizState, { results })).toEqual(result);
});

it("Apply results for subset of players", () => {
    const results = { James: 2 };
    const quizState = {
        players: [
            { name: "Jen", score: 1 },
            { name: "James", score: 0 },
        ],
    };
    const expectedQuizState = {
        players: [
            { name: "Jen", score: 1 },
            { name: "James", score: 2 },
        ],
        currentQuestion: null,
    };
    const result = {
        newQuizState: expectedQuizState,
        messages: [{ type: "stateUpdated", data: expectedQuizState }],
    };

    expect(handlers.results(quizState, { results })).toEqual(result);
});

// Force mark
it("Force mark", () => {
    const quizState = {
        currentQuestion: {},
    };
    const expectedQuizState = {
        currentQuestion: { forceMark: true },
    };
    const result = {
        newQuizState: expectedQuizState,
        messages: [{ type: "stateUpdated", data: expectedQuizState }],
    };

    expect(handlers.forceMark(quizState, {})).toEqual(result);
});

// Handle Typing
it("Player starts typing", () => {
    const quizState = {
        typing: ["Tigger"],
    };
    const expectedQuizState = {
        typing: ["Tigger", "Winnie"],
    };
    const result = {
        newQuizState: expectedQuizState,
        messages: [{ type: "stateUpdated", data: expectedQuizState }],
    };

    expect(
        handlers.typing(quizState, { name: "Winnie", active: true })
    ).toEqual(result);
});

it("Player continues typing", () => {
    const quizState = {
        typing: ["Tigger", "Winnie"],
    };
    const expectedQuizState = {
        typing: ["Tigger", "Winnie"],
    };
    const result = {
        newQuizState: expectedQuizState,
        messages: [{ type: "stateUpdated", data: expectedQuizState }],
    };

    expect(
        handlers.typing(quizState, { name: "Winnie", active: true })
    ).toEqual(result);
});

it("Player stops typing", () => {
    const quizState = {
        typing: ["Winnie"],
    };
    const expectedQuizState = {
        typing: [],
    };
    const result = {
        newQuizState: expectedQuizState,
        messages: [{ type: "stateUpdated", data: expectedQuizState }],
    };

    expect(
        handlers.typing(quizState, { name: "Winnie", active: false })
    ).toEqual(result);
});

// Finish Quiz

it("Quiz is finished", () => {
    const quizState = {};
    const name = "Piglet";
    const expectedQuizState = {
        active: false,
    };
    const result = {
        newQuizState: expectedQuizState,
        messages: [
            { type: "stateUpdated", data: expectedQuizState },
            { type: "quizFinished", data: name },
        ],
    };

    expect(handlers.finish(quizState, { name })).toEqual(result);
});

// Adjust scores
it("Adjust scores for some players", () => {
    const quizState = {
        players: [
            { name: "Jen", score: 1 },
            { name: "James", score: 2 },
        ],
    };
    const scores = { Jen: 2, James: 2 };
    const expectedQuizState = {
        players: [
            { name: "Jen", score: 2 },
            { name: "James", score: 2 },
        ],
    };
    const result = {
        newQuizState: expectedQuizState,
        messages: [
            { type: "stateUpdated", data: expectedQuizState },
            {
                type: "scoresAdjusted",
                data: { playersAdjusted: ["Jen"], admin: "Eeyore" },
            },
        ],
    };

    expect(
        handlers.adjustScores(quizState, { scores, admin: "Eeyore" })
    ).toEqual(result);
});

it("Adjust scores for all players", () => {
    const quizState = {
        players: [
            { name: "Jen", score: 5 },
            { name: "James", score: 2 },
        ],
    };
    const scores = { Jen: 7, James: 1 };
    const expectedQuizState = {
        players: [
            { name: "Jen", score: 7 },
            { name: "James", score: 1 },
        ],
    };
    const result = {
        newQuizState: expectedQuizState,
        messages: [
            { type: "stateUpdated", data: expectedQuizState },
            {
                type: "scoresAdjusted",
                data: { playersAdjusted: ["Jen", "James"], admin: "Eeyore" },
            },
        ],
    };

    expect(
        handlers.adjustScores(quizState, { scores, admin: "Eeyore" })
    ).toEqual(result);
});

it("Adjust scores when only subset sent", () => {
    const quizState = {
        players: [
            { name: "Jen", score: 5 },
            { name: "James", score: 2 },
        ],
    };
    const scores = { James: 10 };
    const expectedQuizState = {
        players: [
            { name: "Jen", score: 5 },
            { name: "James", score: 10 },
        ],
    };
    const result = {
        newQuizState: expectedQuizState,
        messages: [
            { type: "stateUpdated", data: expectedQuizState },
            {
                type: "scoresAdjusted",
                data: { playersAdjusted: ["Jen", "James"], admin: "Eeyore" },
            },
        ],
    };

    expect(
        handlers.adjustScores(quizState, { scores, admin: "Eeyore" })
    ).toEqual(result);
});

// Remove player
it("Remove player from quiz", () => {
    const quizState = {
        players: [
            { name: "Winnie", score: 5 },
            { name: "Tigger", score: 2 },
            { name: "Kanga", score: 2 },
        ],
    };
    const expectedQuizState = {
        players: [
            { name: "Winnie", score: 5 },
            { name: "Tigger", score: 2 },
        ],
    };
    const result = {
        newQuizState: expectedQuizState,
        messages: [
            { type: "stateUpdated", data: expectedQuizState },
            {
                type: "playerRemoved",
                data: { name: "Kanga", admin: "Winnie" },
            },
        ],
    };

    expect(
        handlers.removePlayer(quizState, { name: "Kanga", admin: "Winnie" })
    ).toEqual(result);
});
