"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { Button } from "react-bootstrap";
import { RootState } from "../../../../store";
import * as client from "../../../client";

export default function QuizDetails() {
  const { cid, qid } = useParams();
  const router = useRouter();
  const [quiz, setQuiz] = useState<any>(null);
  const [attemptCount, setAttemptCount] = useState(0);
  const [latestAttempt, setLatestAttempt] = useState<any>(null);
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);
  const isFaculty = currentUser?.role === "FACULTY" || currentUser?.role === "ADMIN";

  const handlePublish = async () => {
    const updatedQuiz = { ...quiz, published: !quiz.published };
    await client.updateQuiz(updatedQuiz);
    setQuiz(updatedQuiz);
  };

  useEffect(() => {
    let ignore = false;
    async function fetchData() {
      const data = await client.findQuizById(qid as string);
      if (!ignore) {
        setQuiz(data);
      }

      if (!isFaculty) {
        try {
          const attempts = await client.getMyAttempts(qid as string);
          const latest = await client.getLatestAttempt(qid as string);
          if (!ignore) {
            setAttemptCount(attempts.length);
            setLatestAttempt(latest);
          }
        } catch (e) {
          // No attempts yet
        }
      }
    }
    fetchData();
    return () => { ignore = true; };
  }, [qid, isFaculty]);

  if (!quiz) return <div>Loading...</div>;

  const totalPoints = quiz.questions?.reduce((sum: number, q: any) => sum + (q.points || 0), 0) || 0;
  const maxAttempts = quiz.multipleAttempts ? quiz.howManyAttempts : 1;
  const hasAttemptsLeft = attemptCount < maxAttempts;

  return (
    <div id="wd-quiz-details">
      <div className="d-flex justify-content-end mb-3">
        {isFaculty && (
          <>
            <Button variant={quiz.published ? "secondary" : "success"} className="me-2" onClick={handlePublish}>
              {quiz.published ? "Unpublish" : "Publish"}
            </Button>
            <Button variant="warning" className="me-2" onClick={() => router.push(`/courses/${cid}/quizzes/${qid}/preview`)}>
              Preview
            </Button>
            <Button variant="primary" onClick={() => router.push(`/courses/${cid}/quizzes/${qid}/edit`)}>
              Edit
            </Button>
          </>
        )}
        {!isFaculty && quiz.published && (
          <Button variant="primary" onClick={() => router.push(`/courses/${cid}/quizzes/${qid}/take`)}>
            {attemptCount === 0 ? "Start Quiz" : hasAttemptsLeft ? "Retake Quiz" : "View Results"}
          </Button>
        )}
      </div>

      {!isFaculty && latestAttempt && (
        <div className="alert alert-info">
          <strong>Your Score: {latestAttempt.score} / {totalPoints}</strong>
          <br />
          <small>Attempt {attemptCount} of {maxAttempts}</small>
        </div>
      )}

      <hr />

      <h2>{quiz.title}</h2>

      <div className="row mb-2">
        <div className="col-3 text-end"><strong>Quiz Type:</strong></div>
        <div className="col-9">{quiz.quizType?.replace(/_/g, " ") || "Graded Quiz"}</div>
      </div>
      <div className="row mb-2">
        <div className="col-3 text-end"><strong>Points:</strong></div>
        <div className="col-9">{totalPoints}</div>
      </div>
      <div className="row mb-2">
        <div className="col-3 text-end"><strong>Assignment Group:</strong></div>
        <div className="col-9">{quiz.assignmentGroup || "Quizzes"}</div>
      </div>
      <div className="row mb-2">
        <div className="col-3 text-end"><strong>Shuffle Answers:</strong></div>
        <div className="col-9">{quiz.shuffleAnswers ? "Yes" : "No"}</div>
      </div>
      <div className="row mb-2">
        <div className="col-3 text-end"><strong>Time Limit:</strong></div>
        <div className="col-9">{quiz.timeLimit || 20} Minutes</div>
      </div>
      <div className="row mb-2">
        <div className="col-3 text-end"><strong>Multiple Attempts:</strong></div>
        <div className="col-9">{quiz.multipleAttempts ? "Yes" : "No"}</div>
      </div>
      {quiz.multipleAttempts && (
        <div className="row mb-2">
          <div className="col-3 text-end"><strong>How Many Attempts:</strong></div>
          <div className="col-9">{quiz.howManyAttempts || 1}</div>
        </div>
      )}
      <div className="row mb-2">
        <div className="col-3 text-end"><strong>Show Correct Answers:</strong></div>
        <div className="col-9">{quiz.showCorrectAnswers ? "Yes" : "No"}</div>
      </div>
      {isFaculty && (
        <div className="row mb-2">
          <div className="col-3 text-end"><strong>Access Code:</strong></div>
          <div className="col-9">{quiz.accessCode || "None"}</div>
        </div>
      )}
      <div className="row mb-2">
        <div className="col-3 text-end"><strong>One Question at a Time:</strong></div>
        <div className="col-9">{quiz.oneQuestionAtATime ? "Yes" : "No"}</div>
      </div>
      <div className="row mb-2">
        <div className="col-3 text-end"><strong>Webcam Required:</strong></div>
        <div className="col-9">{quiz.webcamRequired ? "Yes" : "No"}</div>
      </div>
      <div className="row mb-2">
        <div className="col-3 text-end"><strong>Lock Questions After Answering:</strong></div>
        <div className="col-9">{quiz.lockQuestionsAfterAnswering ? "Yes" : "No"}</div>
      </div>
      <div className="row mb-2">
        <div className="col-3 text-end"><strong>Due Date:</strong></div>
        <div className="col-9">{quiz.dueDate ? new Date(quiz.dueDate).toLocaleDateString() : "N/A"}</div>
      </div>
      <div className="row mb-2">
        <div className="col-3 text-end"><strong>Available From:</strong></div>
        <div className="col-9">{quiz.availableFrom ? new Date(quiz.availableFrom).toLocaleDateString() : "N/A"}</div>
      </div>
      <div className="row mb-2">
        <div className="col-3 text-end"><strong>Available Until:</strong></div>
        <div className="col-9">{quiz.availableUntil ? new Date(quiz.availableUntil).toLocaleDateString() : "N/A"}</div>
      </div>
    </div>
  );
}
