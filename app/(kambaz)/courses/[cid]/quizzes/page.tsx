"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { ListGroup, ListGroupItem, Dropdown } from "react-bootstrap";
import { BsGripVertical } from "react-icons/bs";
import { IoEllipsisVertical, IoRocketOutline } from "react-icons/io5";
import { FaCheckCircle, FaBan, FaPlus } from "react-icons/fa";
import { RootState } from "../../../store";
import { setQuizzes, removeQuiz, updateQuiz } from "./reducer";
import * as client from "../../client";

export default function Quizzes() {
  const { cid } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const { quizzes } = useSelector((state: RootState) => state.quizzesReducer);
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);
  const isFaculty = currentUser?.role === "FACULTY" || currentUser?.role === "ADMIN";
  const [attempts, setAttempts] = useState<Record<string, any>>({});

  useEffect(() => {
    let ignore = false;
    async function fetchData() {
      const data = await client.findQuizzesForCourse(cid as string);
      if (!ignore) {
        dispatch(setQuizzes(data));
      }
    }
    fetchData();
    return () => { ignore = true; };
  }, [cid, dispatch]);

  useEffect(() => {
    if (isFaculty || quizzes.length === 0) return;

    let ignore = false;
    async function fetchAttempts() {
      const attemptsMap: Record<string, any> = {};
      for (const quiz of quizzes) {
        try {
          const latestAttempt = await client.getLatestAttempt(quiz._id);
          if (latestAttempt) {
            attemptsMap[quiz._id] = latestAttempt;
          }
        } catch (e) {
          // No attempt yet
        }
      }
      if (!ignore) {
        setAttempts(attemptsMap);
      }
    }
    fetchAttempts();
    return () => { ignore = true; };
  }, [quizzes, isFaculty]);

  const handleAddQuiz = async () => {
    const newQuiz = await client.createQuiz(cid as string, {
      title: "New Quiz",
      description: "Quiz Description",
      points: 0,
      published: false,
    });
    dispatch(setQuizzes([...quizzes, newQuiz]));
    router.push(`/courses/${cid}/quizzes/${newQuiz._id}/edit`);
  };

  const handleDeleteQuiz = async (quizId: string) => {
    if (window.confirm("Are you sure you want to delete this quiz?")) {
      await client.deleteQuiz(quizId);
      dispatch(removeQuiz(quizId));
    }
  };

  const handleTogglePublish = async (quiz: any) => {
    const updatedQuiz = { ...quiz, published: !quiz.published };
    await client.updateQuiz(updatedQuiz);
    dispatch(updateQuiz(updatedQuiz));
  };

  const handleEditQuiz = (quizId: string) => {
    router.push(`/courses/${cid}/quizzes/${quizId}/edit`);
  };

  const getAvailabilityStatus = (quiz: any) => {
    if (!quiz.published) return "Closed";

    const now = new Date();
    const availableFrom = quiz.availableFrom ? new Date(quiz.availableFrom) : null;
    const availableUntil = quiz.availableUntil ? new Date(quiz.availableUntil) : null;

    if (availableUntil && now > availableUntil) return "Closed";
    if (availableFrom && now < availableFrom) return `Not available until ${availableFrom.toLocaleDateString()}`;

    return "Available";
  };

  const renderQuizList = () => {
    const filteredQuizzes = quizzes.filter((q: any) => isFaculty || q.published);
    return filteredQuizzes.map((quiz: any) => {
      const totalPoints = quiz.questions?.reduce((sum: number, q: any) => sum + (q.points || 0), 0) || 0;
      const attempt = attempts[quiz._id];

      return (
        <ListGroupItem key={quiz._id} className="p-3 ps-1 d-flex align-items-center">
          <BsGripVertical className="me-2 fs-3" />
          <IoRocketOutline className="me-3 fs-4 text-success" />
          <div className="flex-grow-1">
            <a href={`/courses/${cid}/quizzes/${quiz._id}`} className="fw-bold text-decoration-none text-dark">
              {quiz.title}
            </a>
            <br />
            <small className="text-muted">
              <strong>{getAvailabilityStatus(quiz)}</strong>
              {quiz.dueDate && (
                <span> | <strong>Due</strong> {new Date(quiz.dueDate).toLocaleDateString()}</span>
              )}
              <span> | {totalPoints} pts</span>
              <span> | {quiz.questions?.length || 0} Questions</span>
              {!isFaculty && attempt && (
                <span> | <strong>Score:</strong> {attempt.score}/{totalPoints}</span>
              )}
            </small>
          </div>
          {isFaculty && (
            <div className="d-flex align-items-center">
              <span className="me-2">
                {quiz.published ? (
                  <FaCheckCircle className="text-success fs-5" />
                ) : (
                  <FaBan className="text-danger fs-5" />
                )}
              </span>
              <Dropdown>
                <Dropdown.Toggle variant="link" className="p-0 text-dark" id={`dropdown-${quiz._id}`}>
                  <IoEllipsisVertical className="fs-4" />
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => handleEditQuiz(quiz._id)}>Edit</Dropdown.Item>
                  <Dropdown.Item onClick={() => handleDeleteQuiz(quiz._id)}>Delete</Dropdown.Item>
                  <Dropdown.Item onClick={() => handleTogglePublish(quiz)}>
                    {quiz.published ? "Unpublish" : "Publish"}
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          )}
        </ListGroupItem>
      );
    });
  };

  return (
    <div id="wd-quizzes">
      {isFaculty && (
        <div className="d-flex justify-content-end mb-3">
          <button className="btn btn-danger" onClick={handleAddQuiz}>
            <FaPlus className="me-2" />
            Quiz
          </button>
        </div>
      )}

      {quizzes.length === 0 ? (
        <div className="text-center text-muted p-4">
          <p>No quizzes yet.</p>
          {isFaculty && <p>Click + Quiz to create a new quiz.</p>}
        </div>
      ) : (
        <ListGroup className="rounded-0">
          <ListGroupItem className="p-0 mb-3 fs-5 border-gray">
            <div className="wd-title p-3 ps-2 bg-secondary d-flex align-items-center">
              <BsGripVertical className="me-2 fs-3" />
              <span className="fw-bold">QUIZZES</span>
            </div>
            <ListGroup className="rounded-0">
              {renderQuizList()}
            </ListGroup>
          </ListGroupItem>
        </ListGroup>
      )}
    </div>
  );
}
