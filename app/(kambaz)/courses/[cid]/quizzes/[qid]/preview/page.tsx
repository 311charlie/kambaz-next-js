"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button, Card, FormCheck, FormControl } from "react-bootstrap";
import * as client from "../../../../client";

export default function QuizPreview() {
  const { cid, qid } = useParams();
  const router = useRouter();
  const [quiz, setQuiz] = useState<any>(null);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    let ignore = false;
    async function fetchData() {
      const data = await client.findQuizById(qid as string);
      if (!ignore) {
        setQuiz(data);
      }
    }
    fetchData();
    return () => { ignore = true; };
  }, [qid]);

  const handleAnswer = (questionId: string, answer: any) => {
    setAnswers({ ...answers, [questionId]: answer });
  };

  const calculateScore = () => {
    let totalScore = 0;
    quiz.questions?.forEach((question: any) => {
      const userAnswer = answers[question._id];
      if (question.type === "MULTIPLE_CHOICE") {
        const correctChoice = question.choices?.find((c: any) => c.isCorrect);
        if (userAnswer === correctChoice?._id) {
          totalScore += question.points || 0;
        }
      } else if (question.type === "TRUE_FALSE") {
        if (userAnswer === question.correctAnswer) {
          totalScore += question.points || 0;
        }
      } else if (question.type === "FILL_IN_BLANK") {
        const correctAnswers = question.blanks?.map((b: string) => b.toLowerCase().trim()) || [];
        if (correctAnswers.includes(userAnswer?.toLowerCase().trim())) {
          totalScore += question.points || 0;
        }
      }
    });
    return totalScore;
  };

  const handleSubmit = () => {
    const finalScore = calculateScore();
    setScore(finalScore);
    setSubmitted(true);
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

  const questions = quiz.questions || [];
  const currentQuestion = questions[currentQuestionIndex];
  const showOneAtATime = quiz.oneQuestionAtATime;

  const renderQuestion = (question: any, index: number) => (
    <Card key={question._id} className={`mb-3 ${submitted ? (isCorrect(question) ? "border-success" : "border-danger") : ""}`}>
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
                className={submitted ? (choice.isCorrect ? "text-success fw-bold" : "") : ""}
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
              className={submitted && question.correctAnswer === true ? "text-success fw-bold" : ""}
            />
            <FormCheck
              type="radio"
              name={`question-${question._id}`}
              label="False"
              checked={answers[question._id] === false}
              onChange={() => handleAnswer(question._id, false)}
              disabled={submitted}
              className={submitted && question.correctAnswer === false ? "text-success fw-bold" : ""}
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
            {submitted && (
              <small className="text-muted">
                Accepted answers: {question.blanks?.join(", ")}
              </small>
            )}
          </div>
        )}

        {submitted && (
          <div className={`mt-2 ${isCorrect(question) ? "text-success" : "text-danger"}`}>
            {isCorrect(question) ? "Correct" : "Incorrect"}
          </div>
        )}
      </Card.Body>
    </Card>
  );

  return (
    <div id="wd-quiz-preview">
      <div className="alert alert-warning">
        <strong>Preview Mode:</strong> This is a preview of how students will see the quiz.
      </div>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>{quiz.title}</h2>
        <Button variant="secondary" onClick={() => router.push(`/courses/${cid}/quizzes/${qid}/edit`)}>
          Edit Quiz
        </Button>
      </div>

      {submitted && (
        <div className="alert alert-info">
          <strong>Score: {score} / {totalPoints}</strong>
        </div>
      )}

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
          <Button variant="primary" onClick={() => router.push(`/courses/${cid}/quizzes/${qid}`)}>
            Back to Quiz Details
          </Button>
        )}
      </div>
    </div>
  );
}
