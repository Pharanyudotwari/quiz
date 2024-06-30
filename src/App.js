import React, { useState, useEffect } from "react";
import axios from "axios";
import { List, Card, Radio, Button, message, Modal } from "antd";
import "./App.css";

const App = () => {
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [score, setScore] = useState(0);
    const [playerName, setPlayerName] = useState("PLAYER");
    const [leaderboard, setLeaderboard] = useState([]);
    const [finish, setFinish] = useState(false);
    const [first, setFirst] = useState(false);

    useEffect(() => {
        setFirst(true);
    }, []);

    useEffect(() => {
        first && fetchQuestions();
    }, [first]);

    useEffect(() => {
        if (finish) {
            setLeaderboard((prevLeaderboard) => [
                ...prevLeaderboard,
                { playerName, score },
            ]);
            SuccessModal();
        }
    }, [finish]);

    const fetchAdditionalQuestions = async () => {
        const filterQuestions = (questions) => {
            return questions.filter((question) => {
                const answers = Object.values(question.answers);
                const nonNullAnswers = answers.filter(
                    (answer) => answer !== null
                );
                const correctAnswer = question.correct_answer;
                return (
                    nonNullAnswers.length === 4 && correctAnswer !== undefined
                );
            });
        };

        try {
            const response = await axios.get(
                "https://quizapi.io/api/v1/questions",
                {
                    params: {
                        apiKey: "FGesGzFILNbP8GFeFY09tdFbcFhpVJINHQz9R1TB",
                        limit: 20, // maximum limit from quizapi
                        difficulty: "easy",
                    },
                }
            );
            return filterQuestions(response.data);
        } catch (error) {
            console.error("Error fetching additional questions:", error);
            return [];
        }
    };

    const fetchQuestions = async () => {
        try {
            let questions = [];
            while (questions.length < 20) {
                const additionalQuestions = await fetchAdditionalQuestions();
                questions = [...questions, ...additionalQuestions];
                if (questions.length >= 20) break;
            }

            const limitedQuestions = questions.slice(0, 20);
            console.log("limitedQuestions ", limitedQuestions);
            setQuestions(limitedQuestions);
            setCurrentQuestionIndex(0);
            setScore(0);
            setSelectedAnswer(null);
            setFinish(false);
        } catch (error) {
            console.error("Error fetching questions:", error);
        }
    };

    const checkCorrect = () => {
        const currentQuestion = questions[currentQuestionIndex];
        const correctAnswerKey = currentQuestion.correct_answer;
        const isCorrect = selectedAnswer === correctAnswerKey;

        if (isCorrect) {
            setScore((prevScore) => prevScore + 1);
            message.success("Correct answer!");
        } else {
            message.error("Incorrect answer.");
        }
    };

    const handleNextQuestion = () => {
        checkCorrect();
        setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
        setSelectedAnswer(null);
    };

    const handleFinishQuiz = () => {
        setFinish(true);
        checkCorrect();
    };

    const SuccessModal = () => {
        Modal.success({
            centered: true,
            title: "Quiz Summary",
            content: (
                <div>
                    <p>Congratulations! You have completed the quiz.</p>
                    <p>Your score: {score}</p>
                </div>
            ),
            onOk: fetchQuestions,
            okText: "Next Question",
            maskClosable: true,
        });
    };

    const renderRadioButtons = () => {
        const currentQuestion = questions[currentQuestionIndex];
        const filteredAnswers = Object.keys(currentQuestion.answers).filter(
            (key) => currentQuestion.answers[key] !== null
        );

        return (
            <Radio.Group
                className="radio-group"
                onChange={(e) => setSelectedAnswer(e.target.value)}
                value={selectedAnswer}
            >
                {filteredAnswers.map((key, index) => (
                    <Radio key={index} className="radio-item" value={key}>
                        {currentQuestion.answers[key]}
                    </Radio>
                ))}
            </Radio.Group>
        );
    };

    const renderButton = () => {
        const isLastQuestion = currentQuestionIndex === questions.length - 1;
        const buttonText = isLastQuestion ? "Finish" : "Next Question";
        const handleClick = isLastQuestion
            ? handleFinishQuiz
            : handleNextQuestion;

        return (
            <Button
                type="primary"
                className="next-button"
                onClick={handleClick}
                disabled={selectedAnswer === null}
            >
                {buttonText}
            </Button>
        );
    };

    const renderLeaderboard = () => {
        return (
            <List
                itemLayout="horizontal"
                dataSource={leaderboard}
                renderItem={(item, index) => (
                    <List.Item>
                        <List.Item.Meta
                            title={`#${index + 1} ${item.playerName}`}
                            description={`Score: ${item.score}`}
                        />
                    </List.Item>
                )}
            />
        );
    };

    if (questions.length === 0) {
        return <div>Loading...</div>;
    }

    const currentQuestion = questions[currentQuestionIndex];

    return (
        <div className="App">
            <h1 className="app-title">Quiz App</h1>
            <div className="quiz-container">
                <Card
                    title={`Question ${currentQuestionIndex + 1}`}
                    className="quiz-card"
                >
                    <p className="question-text">{currentQuestion.question}</p>
                    {renderRadioButtons()}
                    {renderButton()}
                </Card>
                <div className="leaderboard-container">
                    <h2 className="leaderboard-title">Leaderboard</h2>
                    {renderLeaderboard()}
                </div>
            </div>
        </div>
    );
};

export default App;
