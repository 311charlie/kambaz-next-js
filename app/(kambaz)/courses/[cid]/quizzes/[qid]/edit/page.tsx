"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Form, FormControl, FormLabel, FormSelect, FormCheck, Row, Col, Button, Nav } from "react-bootstrap";
import * as client from "../../../../client";

export default function QuizEditor() {
  const { cid, qid } = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("details");
  const [quiz, setQuiz] = useState<any>({
    title: "",
    description: "",
    quizType: "GRADED_QUIZ",
    points: 0,
    assignmentGroup: "QUIZZES",
    shuffleAnswers: true,
    timeLimit: 20,
    multipleAttempts: false,
    howManyAttempts: 1,
    showCorrectAnswers: false,
    accessCode: "",
    oneQuestionAtATime: true,
    webcamRequired: false,
    lockQuestionsAfterAnswering: false,
    dueDate: "",
    availableFrom: "",
    availableUntil: "",
    published: false,
    questions: [],
  });

  useEffect(() => {
    let ignore = false;
    async function fetchData() {
      const data = await client.findQuizById(qid as string);
      if (!ignore) {
        setQuiz({
          ...data,
          dueDate: data.dueDate?.split("T")[0] || "",
          availableFrom: data.availableFrom?.split("T")[0] || "",
          availableUntil: data.availableUntil?.split("T")[0] || "",
        });
      }
    }
    fetchData();
    return () => { ignore = true; };
  }, [qid]);

  const handleSave = async () => {
    await client.updateQuiz(quiz);
    router.push(`/courses/${cid}/quizzes/${qid}`);
  };

  const handleSaveAndPublish = async () => {
    const updatedQuiz = { ...quiz, published: true };
    await client.updateQuiz(updatedQuiz);
    router.push(`/courses/${cid}/quizzes`);
  };

  const handleCancel = () => {
    router.push(`/courses/${cid}/quizzes`);
  };

  return (
    <div id="wd-quiz-editor">
      <Nav variant="tabs" className="mb-3">
        <Nav.Item>
          <Nav.Link active={activeTab === "details"} onClick={() => setActiveTab("details")}>
            Details
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link active={activeTab === "questions"} onClick={() => router.push(`/courses/${cid}/quizzes/${qid}/questions`)}>
            Questions
          </Nav.Link>
        </Nav.Item>
      </Nav>

      <Form>
        <Row className="mb-3">
          <Col>
            <FormLabel htmlFor="title">Title</FormLabel>
            <FormControl
              id="title"
              value={quiz.title}
              onChange={(e) => setQuiz({ ...quiz, title: e.target.value })}
            />
          </Col>
        </Row>

        <Row className="mb-3">
          <Col>
            <FormLabel htmlFor="description">Description</FormLabel>
            <FormControl
              as="textarea"
              id="description"
              rows={4}
              value={quiz.description}
              onChange={(e) => setQuiz({ ...quiz, description: e.target.value })}
            />
          </Col>
        </Row>

        <Row className="mb-3">
          <Col sm={3}>
            <FormLabel>Quiz Type</FormLabel>
          </Col>
          <Col sm={9}>
            <FormSelect value={quiz.quizType} onChange={(e) => setQuiz({ ...quiz, quizType: e.target.value })}>
              <option value="GRADED_QUIZ">Graded Quiz</option>
              <option value="PRACTICE_QUIZ">Practice Quiz</option>
              <option value="GRADED_SURVEY">Graded Survey</option>
              <option value="UNGRADED_SURVEY">Ungraded Survey</option>
            </FormSelect>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col sm={3}>
            <FormLabel>Points</FormLabel>
          </Col>
          <Col sm={9}>
            <FormControl
              type="number"
              value={quiz.questions?.reduce((sum: number, q: any) => sum + (q.points || 0), 0) || 0}
              readOnly
              disabled
            />
          </Col>
        </Row>

        <Row className="mb-3">
          <Col sm={3}>
            <FormLabel>Assignment Group</FormLabel>
          </Col>
          <Col sm={9}>
            <FormSelect value={quiz.assignmentGroup} onChange={(e) => setQuiz({ ...quiz, assignmentGroup: e.target.value })}>
              <option value="QUIZZES">Quizzes</option>
              <option value="EXAMS">Exams</option>
              <option value="ASSIGNMENTS">Assignments</option>
              <option value="PROJECT">Project</option>
            </FormSelect>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col sm={3}>
            <FormLabel>Options</FormLabel>
          </Col>
          <Col sm={9}>
            <FormCheck
              type="checkbox"
              label="Shuffle Answers"
              checked={quiz.shuffleAnswers}
              onChange={(e) => setQuiz({ ...quiz, shuffleAnswers: e.target.checked })}
            />
            <FormCheck
              type="checkbox"
              label="Multiple Attempts"
              checked={quiz.multipleAttempts}
              onChange={(e) => setQuiz({ ...quiz, multipleAttempts: e.target.checked })}
            />
            <FormCheck
              type="checkbox"
              label="Show Correct Answers"
              checked={quiz.showCorrectAnswers}
              onChange={(e) => setQuiz({ ...quiz, showCorrectAnswers: e.target.checked })}
            />
            <FormCheck
              type="checkbox"
              label="One Question at a Time"
              checked={quiz.oneQuestionAtATime}
              onChange={(e) => setQuiz({ ...quiz, oneQuestionAtATime: e.target.checked })}
            />
            <FormCheck
              type="checkbox"
              label="Webcam Required"
              checked={quiz.webcamRequired}
              onChange={(e) => setQuiz({ ...quiz, webcamRequired: e.target.checked })}
            />
            <FormCheck
              type="checkbox"
              label="Lock Questions After Answering"
              checked={quiz.lockQuestionsAfterAnswering}
              onChange={(e) => setQuiz({ ...quiz, lockQuestionsAfterAnswering: e.target.checked })}
            />
          </Col>
        </Row>

        <Row className="mb-3">
          <Col sm={3}>
            <FormLabel>Time Limit (Minutes)</FormLabel>
          </Col>
          <Col sm={9}>
            <FormControl
              type="number"
              value={quiz.timeLimit}
              onChange={(e) => setQuiz({ ...quiz, timeLimit: parseInt(e.target.value) || 0 })}
            />
          </Col>
        </Row>

        {quiz.multipleAttempts && (
          <Row className="mb-3">
            <Col sm={3}>
              <FormLabel>How Many Attempts</FormLabel>
            </Col>
            <Col sm={9}>
              <FormControl
                type="number"
                value={quiz.howManyAttempts}
                onChange={(e) => setQuiz({ ...quiz, howManyAttempts: parseInt(e.target.value) || 1 })}
              />
            </Col>
          </Row>
        )}

        <Row className="mb-3">
          <Col sm={3}>
            <FormLabel>Access Code</FormLabel>
          </Col>
          <Col sm={9}>
            <FormControl
              type="text"
              value={quiz.accessCode}
              onChange={(e) => setQuiz({ ...quiz, accessCode: e.target.value })}
              placeholder="Leave blank for no access code"
            />
          </Col>
        </Row>

        <Row className="mb-3">
          <Col sm={3}>
            <FormLabel>Due Date</FormLabel>
          </Col>
          <Col sm={9}>
            <FormControl
              type="date"
              value={quiz.dueDate}
              onChange={(e) => setQuiz({ ...quiz, dueDate: e.target.value })}
            />
          </Col>
        </Row>

        <Row className="mb-3">
          <Col sm={3}>
            <FormLabel>Available From</FormLabel>
          </Col>
          <Col sm={9}>
            <FormControl
              type="date"
              value={quiz.availableFrom}
              onChange={(e) => setQuiz({ ...quiz, availableFrom: e.target.value })}
            />
          </Col>
        </Row>

        <Row className="mb-3">
          <Col sm={3}>
            <FormLabel>Available Until</FormLabel>
          </Col>
          <Col sm={9}>
            <FormControl
              type="date"
              value={quiz.availableUntil}
              onChange={(e) => setQuiz({ ...quiz, availableUntil: e.target.value })}
            />
          </Col>
        </Row>

        <hr />

        <div className="d-flex justify-content-end">
          <Button variant="secondary" className="me-2" onClick={handleCancel}>
            Cancel
          </Button>
          <Button variant="primary" className="me-2" onClick={handleSave}>
            Save
          </Button>
          <Button variant="danger" onClick={handleSaveAndPublish}>
            Save and Publish
          </Button>
        </div>
      </Form>
    </div>
  );
}
