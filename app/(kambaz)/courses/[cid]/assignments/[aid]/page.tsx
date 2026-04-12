"use client";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Form, FormControl, FormLabel, FormSelect, Row, Col, Button } from "react-bootstrap";
import Link from "next/link";
import * as coursesClient from "../../../client";

export default function AssignmentEditor() {
  const { cid, aid } = useParams();
  const router = useRouter();
  const isNew = aid === "new";
  const [assignment, setAssignment] = useState<any>({
    title: "New Assignment",
    description: "",
    points: 100,
    course: cid,
    dueDate: "2024-05-13",
    availableFrom: "2024-05-06",
    availableUntil: "2024-05-20",
  });
  const [loading, setLoading] = useState(!isNew);

  const fetchAssignment = async () => {
    if (isNew) return;
    const assignments = await coursesClient.findAssignmentsForCourse(cid as string);
    const existing = assignments.find((a: any) => a._id === aid);
    if (existing) {
      setAssignment({
        ...existing,
        dueDate: existing.dueDate?.split("T")[0] || "",
        availableFrom: existing.availableFrom?.split("T")[0] || "",
        availableUntil: existing.availableUntil?.split("T")[0] || "",
      });
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (isNew) {
      await coursesClient.createAssignmentForCourse(cid as string, assignment);
    } else {
      await coursesClient.updateAssignment(assignment);
    }
    router.push(`/courses/${cid}/assignments`);
  };

  useEffect(() => {
    fetchAssignment();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div id="wd-assignments-editor">
      <FormLabel htmlFor="wd-name">Assignment Name</FormLabel>
      <FormControl id="wd-name" value={assignment.title} className="mb-3"
        onChange={(e) => setAssignment({ ...assignment, title: e.target.value })} />
      <FormControl as="textarea" id="wd-description" rows={5} className="mb-3"
        value={assignment.description}
        onChange={(e) => setAssignment({ ...assignment, description: e.target.value })} />
      <Form>
        <Row className="mb-3">
          <Col sm={3}><FormLabel htmlFor="wd-points" className="float-end">Points</FormLabel></Col>
          <Col sm={9}>
            <FormControl id="wd-points" type="number" value={assignment.points}
              onChange={(e) => setAssignment({ ...assignment, points: parseInt(e.target.value) })} />
          </Col>
        </Row>
        <Row className="mb-3">
          <Col sm={3}><FormLabel htmlFor="wd-group" className="float-end">Assignment Group</FormLabel></Col>
          <Col sm={9}>
            <FormSelect id="wd-group">
              <option value="ASSIGNMENTS">ASSIGNMENTS</option>
              <option value="QUIZZES">QUIZZES</option>
              <option value="EXAMS">EXAMS</option>
              <option value="PROJECT">PROJECT</option>
            </FormSelect>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col sm={3}><FormLabel htmlFor="wd-display-grade-as" className="float-end">Display Grade as</FormLabel></Col>
          <Col sm={9}>
            <FormSelect id="wd-display-grade-as">
              <option value="PERCENTAGE">Percentage</option>
              <option value="LETTER">Letter</option>
              <option value="POINTS">Points</option>
            </FormSelect>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col sm={3}><FormLabel htmlFor="wd-submission-type" className="float-end">Submission Type</FormLabel></Col>
          <Col sm={9}>
            <FormSelect id="wd-submission-type">
              <option value="ONLINE">Online</option>
              <option value="PAPER">Paper</option>
              <option value="EXTERNAL">External Tool</option>
            </FormSelect>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col sm={3}></Col>
          <Col sm={9}>
            <Form.Check type="checkbox" id="wd-text-entry" label="Text Entry" />
            <Form.Check type="checkbox" id="wd-website-url" label="Website URL" />
            <Form.Check type="checkbox" id="wd-media-recordings" label="Media Recordings" />
            <Form.Check type="checkbox" id="wd-student-annotation" label="Student Annotation" />
            <Form.Check type="checkbox" id="wd-file-upload" label="File Uploads" />
          </Col>
        </Row>
        <Row className="mb-3">
          <Col sm={3}><FormLabel htmlFor="wd-due-date" className="float-end">Due</FormLabel></Col>
          <Col sm={9}>
            <FormControl id="wd-due-date" type="date" value={assignment.dueDate}
              onChange={(e) => setAssignment({ ...assignment, dueDate: e.target.value })} />
          </Col>
        </Row>
        <Row className="mb-3">
          <Col sm={3}><FormLabel htmlFor="wd-available-from" className="float-end">Available from</FormLabel></Col>
          <Col sm={9}>
            <FormControl id="wd-available-from" type="date" value={assignment.availableFrom}
              onChange={(e) => setAssignment({ ...assignment, availableFrom: e.target.value })} />
          </Col>
        </Row>
        <Row className="mb-3">
          <Col sm={3}><FormLabel htmlFor="wd-available-until" className="float-end">Until</FormLabel></Col>
          <Col sm={9}>
            <FormControl id="wd-available-until" type="date" value={assignment.availableUntil}
              onChange={(e) => setAssignment({ ...assignment, availableUntil: e.target.value })} />
          </Col>
        </Row>
        <hr />
        <div className="d-flex justify-content-end">
          <Link href={`/courses/${cid}/assignments`} className="btn btn-secondary me-2">Cancel</Link>
          <Button variant="danger" onClick={handleSave}>Save</Button>
        </div>
      </Form>
    </div>
  );
}
