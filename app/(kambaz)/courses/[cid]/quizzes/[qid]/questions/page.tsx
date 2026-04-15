"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button, Nav, Card, FormControl, FormSelect, FormCheck, FormLabel } from "react-bootstrap";
import { FaPlus, FaTrash, FaPencilAlt } from "react-icons/fa";
import * as client from "../../../../client";

export default function QuizQuestionsEditor() {
  const { cid, qid } = useParams();
  const router = useRouter();
  const [quiz, setQuiz] = useState<any>(null);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [editingQuestion, setEditingQuestion] = useState<any>(null);

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

  const handleAddQuestion = async () => {
    const newQuestion = {
      type: "MULTIPLE_CHOICE",
      title: "New Question",
      points: 1,
      question: "Enter your question here",
      choices: [
        { _id: crypto.randomUUID(), text: "Option 1", isCorrect: true },
        { _id: crypto.randomUUID(), text: "Option 2", isCorrect: false },
      ],
      correctAnswer: true,
      blanks: [""],
    };
    const savedQuestion = await client.addQuestion(qid as string, newQuestion);
    const updatedQuestions = [...quiz.questions, savedQuestion];
    const totalPoints = updatedQuestions.reduce((sum: number, q: any) => sum + (q.points || 0), 0);
    const updatedQuiz = { ...quiz, questions: updatedQuestions, points: totalPoints };
    await client.updateQuiz(updatedQuiz);
    setQuiz(updatedQuiz);
    setEditingQuestionId(savedQuestion._id);
    setEditingQuestion(savedQuestion);
  };

  const handleSaveQuestion = async () => {
    await client.updateQuestion(qid as string, editingQuestion);
    const updatedQuestions = quiz.questions.map((q: any) =>
      q._id === editingQuestion._id ? editingQuestion : q
    );
    const totalPoints = updatedQuestions.reduce((sum: number, q: any) => sum + (q.points || 0), 0);
    const updatedQuiz = { ...quiz, questions: updatedQuestions, points: totalPoints };
    await client.updateQuiz(updatedQuiz);
    setQuiz(updatedQuiz);
    setEditingQuestionId(null);
    setEditingQuestion(null);
  };

  const handleCancelEdit = () => {
    setEditingQuestionId(null);
    setEditingQuestion(null);
  };

  const handleDeleteQuestion = async (questionId: string) => {
    if (window.confirm("Are you sure you want to delete this question?")) {
      await client.deleteQuestion(qid as string, questionId);
      const updatedQuestions = quiz.questions.filter((q: any) => q._id !== questionId);
      const totalPoints = updatedQuestions.reduce((sum: number, q: any) => sum + (q.points || 0), 0);
      const updatedQuiz = { ...quiz, questions: updatedQuestions, points: totalPoints };
      await client.updateQuiz(updatedQuiz);
      setQuiz(updatedQuiz);
    }
  };

  const handleEditQuestion = (question: any) => {
    setEditingQuestionId(question._id);
    setEditingQuestion({ ...question });
  };

  const handleAddChoice = () => {
    setEditingQuestion({
      ...editingQuestion,
      choices: [
        ...editingQuestion.choices,
        { _id: crypto.randomUUID(), text: "New Option", isCorrect: false },
      ],
    });
  };

  const handleRemoveChoice = (choiceId: string) => {
    setEditingQuestion({
      ...editingQuestion,
      choices: editingQuestion.choices.filter((c: any) => c._id !== choiceId),
    });
  };

  const handleAddBlank = () => {
    setEditingQuestion({
      ...editingQuestion,
      blanks: [...(editingQuestion.blanks || []), ""],
    });
  };

  const handleRemoveBlank = (index: number) => {
    const newBlanks = [...editingQuestion.blanks];
    newBlanks.splice(index, 1);
    setEditingQuestion({ ...editingQuestion, blanks: newBlanks });
  };

  const handleSave = async () => {
    router.push(`/courses/${cid}/quizzes/${qid}`);
  };

  const handleCancel = () => {
    router.push(`/courses/${cid}/quizzes`);
  };

  const handleSaveAndPublish = async () => {
    await client.updateQuiz({ ...quiz, published: true });
    router.push(`/courses/${cid}/quizzes`);
  };

  const totalPoints = quiz?.questions?.reduce((sum: number, q: any) => sum + (q.points || 0), 0) || 0;

  if (!quiz) return <div>Loading...</div>;

  const renderQuestionPreview = (question: any) => (
    <Card key={question._id} className="mb-3">
      <Card.Header className="d-flex justify-content-between align-items-center">
        <div>
          <strong>{question.title}</strong>
          <span className="ms-2 text-muted">({question.type?.replace(/_/g, " ")})</span>
        </div>
        <div>
          <span className="me-3">{question.points} pts</span>
          <FaPencilAlt
            className="me-2 text-primary"
            style={{ cursor: "pointer" }}
            onClick={() => handleEditQuestion(question)}
          />
          <FaTrash
            className="text-danger"
            style={{ cursor: "pointer" }}
            onClick={() => handleDeleteQuestion(question._id)}
          />
        </div>
      </Card.Header>
      <Card.Body>
        <p>{question.question}</p>
        {question.type === "MULTIPLE_CHOICE" && (
          <ul>
            {question.choices?.map((choice: any) => (
              <li key={choice._id} className={choice.isCorrect ? "text-success fw-bold" : ""}>
                {choice.text} {choice.isCorrect}
              </li>
            ))}
          </ul>
        )}
        {question.type === "TRUE_FALSE" && (
          <p><strong>Correct Answer:</strong> {question.correctAnswer ? "True" : "False"}</p>
        )}
        {question.type === "FILL_IN_BLANK" && (
          <p><strong>Accepted Answers:</strong> {question.blanks?.join(", ")}</p>
        )}
      </Card.Body>
    </Card>
  );

  const renderQuestionEditor = () => (
    <Card className="mb-3">
      <Card.Header>
        <div className="d-flex justify-content-between align-items-center">
          <FormControl
            className="w-50"
            value={editingQuestion.title}
            onChange={(e) => setEditingQuestion({ ...editingQuestion, title: e.target.value })}
            placeholder="Question Title"
          />
          <div className="d-flex align-items-center">
            <FormSelect
              className="me-2"
              style={{ width: "180px" }}
              value={editingQuestion.type}
              onChange={(e) => setEditingQuestion({ ...editingQuestion, type: e.target.value })}
            >
              <option value="MULTIPLE_CHOICE">Multiple Choice</option>
              <option value="TRUE_FALSE">True/False</option>
              <option value="FILL_IN_BLANK">Fill in the Blank</option>
            </FormSelect>
            <FormLabel className="mb-0 me-2">pts:</FormLabel>
            <FormControl
              type="number"
              style={{ width: "80px" }}
              value={editingQuestion.points}
              onChange={(e) => setEditingQuestion({ ...editingQuestion, points: parseInt(e.target.value) || 0 })}
            />
          </div>
        </div>
      </Card.Header>
      <Card.Body>
        <FormLabel>Question</FormLabel>
        <FormControl
          as="textarea"
          rows={3}
          className="mb-3"
          value={editingQuestion.question}
          onChange={(e) => setEditingQuestion({ ...editingQuestion, question: e.target.value })}
        />

        {editingQuestion.type === "MULTIPLE_CHOICE" && (
          <div>
            <FormLabel>Choices</FormLabel>
            {editingQuestion.choices?.map((choice: any, index: number) => (
              <div key={choice._id} className="d-flex align-items-center mb-2">
                <FormCheck
                  type="radio"
                  name="correctChoice"
                  checked={choice.isCorrect}
                  onChange={() => {
                    const newChoices = editingQuestion.choices.map((c: any) => ({
                      ...c,
                      isCorrect: c._id === choice._id,
                    }));
                    setEditingQuestion({ ...editingQuestion, choices: newChoices });
                  }}
                  className="me-2"
                />
                <FormControl
                  value={choice.text}
                  onChange={(e) => {
                    const newChoices = editingQuestion.choices.map((c: any) =>
                      c._id === choice._id ? { ...c, text: e.target.value } : c
                    );
                    setEditingQuestion({ ...editingQuestion, choices: newChoices });
                  }}
                  className="me-2"
                />
                <FaTrash
                  className="text-danger"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleRemoveChoice(choice._id)}
                />
              </div>
            ))}
            <Button variant="link" onClick={handleAddChoice}>
              <FaPlus className="me-1" /> Add Choice
            </Button>
          </div>
        )}

        {editingQuestion.type === "TRUE_FALSE" && (
          <div>
            <FormLabel>Correct Answer</FormLabel>
            <div>
              <FormCheck
                type="radio"
                label="True"
                name="trueFalse"
                checked={editingQuestion.correctAnswer === true}
                onChange={() => setEditingQuestion({ ...editingQuestion, correctAnswer: true })}
              />
              <FormCheck
                type="radio"
                label="False"
                name="trueFalse"
                checked={editingQuestion.correctAnswer === false}
                onChange={() => setEditingQuestion({ ...editingQuestion, correctAnswer: false })}
              />
            </div>
          </div>
        )}

        {editingQuestion.type === "FILL_IN_BLANK" && (
          <div>
            <FormLabel>Accepted Answers (case insensitive)</FormLabel>
            {editingQuestion.blanks?.map((blank: string, index: number) => (
              <div key={index} className="d-flex align-items-center mb-2">
                <FormControl
                  value={blank}
                  onChange={(e) => {
                    const newBlanks = [...editingQuestion.blanks];
                    newBlanks[index] = e.target.value;
                    setEditingQuestion({ ...editingQuestion, blanks: newBlanks });
                  }}
                  className="me-2"
                  placeholder="Possible correct answer"
                />
                <FaTrash
                  className="text-danger"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleRemoveBlank(index)}
                />
              </div>
            ))}
            <Button variant="link" onClick={handleAddBlank}>
              <FaPlus className="me-1" /> Add Answer
            </Button>
          </div>
        )}
      </Card.Body>
      <Card.Footer className="d-flex justify-content-end">
        <Button variant="secondary" className="me-2" onClick={handleCancelEdit}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSaveQuestion}>
          Save Question
        </Button>
      </Card.Footer>
    </Card>
  );

  return (
    <div id="wd-quiz-questions-editor">
      <Nav variant="tabs" className="mb-3">
        <Nav.Item>
          <Nav.Link onClick={() => router.push(`/courses/${cid}/quizzes/${qid}/edit`)}>
            Details
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link active>Questions</Nav.Link>
        </Nav.Item>
      </Nav>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Questions</h4>
        <div>
          <span className="me-3">Total Points: {totalPoints}</span>
          <Button variant="danger" onClick={handleAddQuestion}>
            <FaPlus className="me-1" /> New Question
          </Button>
        </div>
      </div>

      {quiz.questions?.length === 0 ? (
        <div className="text-center text-muted p-4">
          <p>No questions yet.</p>
          <p>Click + New Question to add a question.</p>
        </div>
      ) : (
        quiz.questions?.map((question: any) =>
          editingQuestionId === question._id
            ? <div key={question._id}>{renderQuestionEditor()}</div>
            : renderQuestionPreview(question)
        )
      )}

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
    </div>
  );
}
