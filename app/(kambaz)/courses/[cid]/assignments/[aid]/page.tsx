import { Form, FormControl, FormLabel, FormSelect, Row, Col, Button } from "react-bootstrap";

export default function AssignmentEditor() {
  return (
    <div id="wd-assignments-editor">
      <FormLabel htmlFor="wd-name">Assignment Name</FormLabel>
      <FormControl id="wd-name" defaultValue="A1 - ENV + HTML" className="mb-3" />

      <FormControl
        as="textarea"
        id="wd-description"
        rows={5}
        className="mb-3"
        defaultValue="The assignment is available online. Submit a link to the landing page of your Web application running on Vercel."
      />

      <Form>
        <Row className="mb-3">
          <Col sm={3}>
            <FormLabel htmlFor="wd-points" className="float-end">Points</FormLabel>
          </Col>
          <Col sm={9}>
            <FormControl id="wd-points" type="number" defaultValue={100} />
          </Col>
        </Row>

        <Row className="mb-3">
          <Col sm={3}>
            <FormLabel htmlFor="wd-group" className="float-end">Assignment Group</FormLabel>
          </Col>
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
          <Col sm={3}>
            <FormLabel htmlFor="wd-display-grade-as" className="float-end">Display Grade as</FormLabel>
          </Col>
          <Col sm={9}>
            <FormSelect id="wd-display-grade-as">
              <option value="PERCENTAGE">Percentage</option>
              <option value="LETTER">Letter</option>
              <option value="POINTS">Points</option>
            </FormSelect>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col sm={3}>
            <FormLabel htmlFor="wd-submission-type" className="float-end">Submission Type</FormLabel>
          </Col>
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
          <Col sm={3}>
            <FormLabel htmlFor="wd-assign-to" className="float-end">Assign to</FormLabel>
          </Col>
          <Col sm={9}>
            <FormControl id="wd-assign-to" defaultValue="Everyone" />
          </Col>
        </Row>

        <Row className="mb-3">
          <Col sm={3}>
            <FormLabel htmlFor="wd-due-date" className="float-end">Due</FormLabel>
          </Col>
          <Col sm={9}>
            <FormControl id="wd-due-date" type="date" defaultValue="2024-05-13" />
          </Col>
        </Row>

        <Row className="mb-3">
          <Col sm={3}>
            <FormLabel htmlFor="wd-available-from" className="float-end">Available from</FormLabel>
          </Col>
          <Col sm={9}>
            <FormControl id="wd-available-from" type="date" defaultValue="2024-05-06" />
          </Col>
        </Row>

        <Row className="mb-3">
          <Col sm={3}>
            <FormLabel htmlFor="wd-available-until" className="float-end">Until</FormLabel>
          </Col>
          <Col sm={9}>
            <FormControl id="wd-available-until" type="date" defaultValue="2024-05-20" />
          </Col>
        </Row>

        <hr />
        <div className="d-flex justify-content-end">
          <Button variant="secondary" className="me-2">Cancel</Button>
          <Button variant="danger">Save</Button>
        </div>
      </Form>
    </div>
  );
}
