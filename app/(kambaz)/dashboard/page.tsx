"use client";
import { useState } from "react";
import Link from "next/link";
import { Card, CardImg, CardBody, CardTitle, CardText, Button, Row, Col, FormControl } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { addNewCourse, deleteCourse, updateCourse } from "../courses/reducer";
import { RootState } from "../store";
import * as db from "../database";
import { enroll, unenroll } from "../enrollments/reducer";

export default function Dashboard() {
  const { courses } = useSelector((state: RootState) => state.coursesReducer);
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);
  const { enrollments } = useSelector((state: RootState) => state.enrollmentsReducer);
  const dispatch = useDispatch();
  const [course, setCourse] = useState<any>({
    _id: "0", name: "New Course", number: "New Number",
    startDate: "2023-09-10", endDate: "2023-12-15",
    description: "New Description",
  });
  const [showAllCourses, setShowAllCourses] = useState(false);

  if (!currentUser) {
    return (
      <div id="wd-dashboard">
        <h1>Dashboard</h1>
        <p>Please <a href="/account/signin">sign in</a> to view courses.</p>
      </div>
    );
  }

  const filteredCourses = showAllCourses
    ? courses
    : courses.filter((c: any) =>
      enrollments.some((e: any) => e.user === currentUser._id && e.course === c._id)
    );

  return (
    <div id="wd-dashboard">
      <h1 id="wd-dashboard-title">Dashboard</h1><hr />
      <h5>New Course
        <button className="btn btn-primary float-end" id="wd-add-new-course-click"
          onClick={() => dispatch(addNewCourse(course))}>Add</button>
        <button className="btn btn-warning float-end me-2" id="wd-update-course-click"
          onClick={() => dispatch(updateCourse(course))}>Update</button>
        <button className="btn btn-primary float-end me-2"
          onClick={() => setShowAllCourses(!showAllCourses)}>
          {showAllCourses ? "My Courses" : "All Courses"}
        </button>
      </h5><br />
      <FormControl value={course.name} className="mb-2"
        onChange={(e) => setCourse({ ...course, name: e.target.value })} />
      <FormControl as="textarea" value={course.description} rows={3} className="mb-2"
        onChange={(e) => setCourse({ ...course, description: e.target.value })} />
      <hr />
      <h2 id="wd-dashboard-published">Published Courses ({filteredCourses.length})</h2><hr />
      <div id="wd-dashboard-courses">
        <Row xs={1} md={5} className="g-4">
          {filteredCourses.map((c: any) => {
            const isEnrolled = enrollments.some(
              (e: any) => e.user === currentUser?._id && e.course === c._id
            );
            return (
              <Col key={c._id} className="wd-dashboard-course" style={{ width: "300px" }}>
                <Card>
                  <Link href={`/courses/${c._id}/home`}
                    className="wd-dashboard-course-link text-decoration-none text-dark">
                    <CardImg src="/images/reactjs.jpg" variant="top" width="100%" height={160} />
                    <CardBody>
                      <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">
                        {c.name}
                      </CardTitle>
                      <CardText className="wd-dashboard-course-description overflow-hidden" style={{ height: "100px" }}>
                        {c.description}
                      </CardText>
                      <Button variant="primary">Go</Button>
                      <button onClick={(event) => {
                        event.preventDefault();
                        dispatch(deleteCourse(c._id));
                      }} className="btn btn-danger float-end" id="wd-delete-course-click">
                        Delete
                      </button>
                      <button id="wd-edit-course-click" onClick={(event) => {
                        event.preventDefault();
                        setCourse(c);
                      }} className="btn btn-warning me-2 float-end">
                        Edit
                      </button>
                    </CardBody>
                  </Link>
                  {showAllCourses && (
                    <div className="p-2">
                      {isEnrolled ? (
                        <button className="btn btn-danger w-100"
                          onClick={() => dispatch(unenroll({ userId: currentUser?._id, courseId: c._id }))}>
                          Unenroll
                        </button>
                      ) : (
                        <button className="btn btn-success w-100"
                          onClick={() => dispatch(enroll({ userId: currentUser?._id, courseId: c._id }))}>
                          Enroll
                        </button>
                      )}
                    </div>
                  )}
                </Card>
              </Col>
            );
          })}
        </Row>
      </div>
    </div>
  );
}
