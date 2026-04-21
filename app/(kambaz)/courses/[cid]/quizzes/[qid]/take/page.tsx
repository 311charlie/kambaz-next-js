"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button, Card, FormCheck, FormControl, Alert } from "react-bootstrap";
import * as client from "../../../../client";

export default function TakeQuiz() {
  const { cid, qid } = useParams();
  const router = useRouter();
  const [quiz, setQuiz] = useState<any>(null);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [attempt, setAttempt] = useState<any>(null);
  const [attemptCount, setAttemptCount] = useState(0);
  const [canTake, setCanTake] = useState(true);
  const [accessCodeInput, setAccessCodeInput] = useState("");
  const [accessGranted, setAccessGranted] = useState(false);

  useEffect(() => {
    let ignore = false;
    async function fetchData() {
      const quizData = await client.findQuizById(qid as string);
      const attempts = await client.getMyAttempts(qid as string);
      const latestAttempt = await client.getLatestAttempt(qid as string);

      if (!ignore) {
        setQuiz(quizData);
        setAttemptCount(attempts.length);

        if (latestAttempt) {
          setAttempt(latestAttempt);
          const answersMap: Record<string, any> = {};
          latestAttempt.answers?.forEach((a: any) => {
            answersMap[a.questionId] = a.answer;
          });
          setAnswers(answersMap);
          setSubmitted(true);
        }

        const maxAttempts = quizData.multipleAttempts ? quizData.howManyAttempts : 1;
        if (attempts.length >= maxAttempts) {
          setCanTake(false);
        }

        if (!quizData.accessCode || latestAttempt) {
          setAccessGranted(true);
        }
      }
    }
    fetchData();
    return () => { ignore = true; };
  }, [qid]);

  const handleAnswer = (questionId: string, answer: any) => {
    setAnswers({ ...answers, [questionId]: answer });
  };

  const handleSubmit = async () => {
    const answersArray = Object.entries(answers).map(([questionId, answer]) => ({
      questionId,
      answer,
    }));
    const result = await client.submitAttempt(qid as string, answersArray);
    setAttempt(result);
    setSubmitted(true);
    setAttemptCount(attemptCount + 1);
  };

  const handleRetake = () => {
    setSubmitted(false);
    setAttempt(null);
    setAnswers({});
    setCurrentQuestionIndex(0);
  };

  const handleAccessCode = () => {
    if (accessCodeInput === quiz.accessCode) {
      setAccessGranted(true);
    } else {
      alert("Incorrect access code");
    }
  };

  const isCorrect = (question: any) => {
    const userAnswer = answers[question._id];
    if (question.type === "MULTIPLE_CHOICE") {
      const correctChoice = question.choices?.find((c: any) => c.isCorrect);
      return userAnswer === correctChoice?._id;
    } else if (question.type === "TRUE_FALSE") {
      return userAnswer === question.correctAnswer;
    } else if (question.type === "FILL_IN_BLANK") {
      const correctAnswers = question.blanks?.map((b: string) => b.toLowerCase().trim()) || [];
      return correctAnswers.includes(userAnswer?.toLowerCase().trim());
    }
    return false;
  };

  const totalPoints = quiz?.questions?.reduce((sum: number, q: any) => sum + (q.points || 0), 0) || 0;

  if (!quiz) return <div>Loading...</div>;

  const now = new Date();
  const availableFrom = quiz.availableFrom ? new Date(quiz.availableFrom) : null;
  const availableUntil = quiz.availableUntil ? new Date(quiz.availableUntil) : null;

  if (availableFrom && now < availableFrom) {
    return (
      <div className="alert alert-warning">
        <h4>Quiz Not Available</h4>
        <p>This quiz is not available until {availableFrom.toLocaleDateString()}</p>
        <Button variant="secondary" onClick={() => router.push(`/courses/${cid}/quizzes`)}>
          Back to Quizzes
        </Button>
      </div>
    );
  }

  if (availableUntil && now > availableUntil) {
    return (
      <div className="alert alert-danger">
        <h4>Quiz Closed</h4>
        <p>This quiz closed on {availableUntil.toLocaleDateString()}</p>
        <Button variant="secondary" onClick={() => router.push(`/courses/${cid}/quizzes`)}>
          Back to Quizzes
        </Button>
      </div>
    );
  }

  if (!accessGranted) {
    return (
      <div id="wd-quiz-access">
        <h2>{quiz.title}</h2>
        <Alert variant="warning">
          This quiz requires an access code.
        </Alert>
        <div className="d-flex">
          <FormControl
            type="text"
            placeholder="Enter access code"
            value={accessCodeInput}
            onChange={(e) => setAccessCodeInput(e.target.value)}
            className="me-2"
          />
          <Button variant="primary" onClick={handleAccessCode}>
            Submit
          </Button>
        </div>
      </div>
    );
  }

  const questions = quiz.questions || [];
  const currentQuestion = questions[currentQuestionIndex];
  const showOneAtATime = quiz.oneQuestionAtATime;
  const maxAttempts = quiz.multipleAttempts ? quiz.howManyAttempts : 1;

  const renderQuestion = (question: any, index: number) => (
    <Card
      key={question._id}
      className={`mb-3 ${submitted && quiz.showCorrectAnswers ? (isCorrect(question) ? "border-success" : "border-danger") : ""}`}
    >
      <Card.Header className="d-flex justify-content-between">
        <span>Question {index + 1}</span>
        <span>{question.points} pts</span>
      </Card.Header>
      <Card.Body>
        <div className="fw-bold" dangerouslySetInnerHTML={{ __html: question.question }} />

        {question.type === "MULTIPLE_CHOICE" && (
          <div>
            {question.choices?.map((choice: any) => (
              <FormCheck
                key={choice._id}
                type="radio"
                name={`question-${question._id}`}
                label={choice.text}
                checked={answers[question._id] === choice._id}
                onChange={() => handleAnswer(question._id, choice._id)}
                disabled={submitted}
                className={submitted && quiz.showCorrectAnswers && choice.isCorrect ? "text-success fw-bold" : ""}
              />
            ))}
          </div>
        )}

        {question.type === "TRUE_FALSE" && (
          <div>
            <FormCheck
              type="radio"
              name={`question-${question._id}`}
              label="True"
              checked={answers[question._id] === true}
              onChange={() => handleAnswer(question._id, true)}
              disabled={submitted}
              className={submitted && quiz.showCorrectAnswers && question.correctAnswer === true ? "text-success fw-bold" : ""}
            />
            <FormCheck
              type="radio"
              name={`question-${question._id}`}
              label="False"
              checked={answers[question._id] === false}
              onChange={() => handleAnswer(question._id, false)}
              disabled={submitted}
              className={submitted && quiz.showCorrectAnswers && question.correctAnswer === false ? "text-success fw-bold" : ""}
            />
          </div>
        )}

        {question.type === "FILL_IN_BLANK" && (
          <div>
            <FormControl
              type="text"
              placeholder="Enter your answer"
              value={answers[question._id] || ""}
              onChange={(e) => handleAnswer(question._id, e.target.value)}
              disabled={submitted}
            />
            {submitted && quiz.showCorrectAnswers && (
              <small className="text-muted">
                Accepted answers: {question.blanks?.join(", ")}
              </small>
            )}
          </div>
        )}

        {submitted && quiz.showCorrectAnswers && (
          <div className={`mt-2 ${isCorrect(question) ? "text-success" : "text-danger"}`}>
            {isCorrect(question) ? "Correct" : "Incorrect"}
          </div>
        )}
      </Card.Body>
    </Card>
  );

  return (
    <div id="wd-take-quiz">
      <h2>{quiz.title}</h2>

      {submitted && (
        <Alert variant="info">
          <strong>Score: {attempt?.score || 0} / {totalPoints}</strong>
          <br />
          <small>Attempt {attemptCount} of {maxAttempts}</small>
        </Alert>
      )}

      {!canTake && !submitted && (
        <Alert variant="danger">
          You have used all {maxAttempts} attempt(s) for this quiz.
        </Alert>
      )}

      {(canTake || submitted) && (
        <>
          {showOneAtATime ? (
            <div>
              {currentQuestion && renderQuestion(currentQuestion, currentQuestionIndex)}
              <div className="d-flex justify-content-between">
                <Button
                  variant="secondary"
                  disabled={currentQuestionIndex === 0}
                  onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
                >
                  Previous
                </Button>
                <div>
                  {questions.map((_: any, index: number) => (
                    <Button
                      key={index}
                      variant={currentQuestionIndex === index ? "primary" : "outline-primary"}
                      className="mx-1"
                      onClick={() => setCurrentQuestionIndex(index)}
                    >
                      {index + 1}
                    </Button>
                  ))}
                </div>
                <Button
                  variant="secondary"
                  disabled={currentQuestionIndex === questions.length - 1}
                  onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          ) : (
            questions.map((question: any, index: number) => renderQuestion(question, index))
          )}

          <hr />

          <div className="d-flex justify-content-end">
            {!submitted ? (
              <Button variant="danger" onClick={handleSubmit}>
                Submit Quiz
              </Button>
            ) : (
              <>
                {canTake && attemptCount < maxAttempts && (
                  <Button variant="warning" className="me-2" onClick={handleRetake}>
                    Retake Quiz
                  </Button>
                )}
                <Button variant="primary" onClick={() => router.push(`/courses/${cid}/quizzes`)}>
                  Back to Quizzes
                </Button>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
