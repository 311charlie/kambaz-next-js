"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardImg, CardBody, CardTitle, CardText, Button, Row, Col, FormControl } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { setCourses } from "../courses/reducer";
import { RootState } from "../store";
import * as courseClient from "../courses/client";

export default function Dashboard() {
  const { courses } = useSelector((state: RootState) => state.coursesReducer);
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);
  const dispatch = useDispatch();
  const [course, setCourse] = useState<any>({
    _id: "0", name: "New Course", number: "New Number",
    startDate: "2023-09-10", endDate: "2023-12-15",
    description: "New Description",
  });
  const [showAllCourses, setShowAllCourses] = useState(false);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<string[]>([]);

  const fetchCourses = async () => {
    try {
      const myCourses = await courseClient.findMyCourses();
      setEnrolledCourseIds(myCourses.map((c: any) => c._id));
      if (showAllCourses) {
        const allCourses = await courseClient.fetchAllCourses();
        dispatch(setCourses(allCourses));
      } else {
        dispatch(setCourses(myCourses));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const onAddNewCourse = async () => {
    const newCourse = await courseClient.createCourse(course);
    dispatch(setCourses([...courses, newCourse]));
    setEnrolledCourseIds([...enrolledCourseIds, newCourse._id]);
  };

  const onDeleteCourse = async (courseId: string) => {
    await courseClient.deleteCourse(courseId);
    dispatch(setCourses(courses.filter((c: any) => c._id !== courseId)));
  };

  const onUpdateCourse = async () => {
    await courseClient.updateCourse(course);
    dispatch(setCourses(courses.map((c: any) => (c._id === course._id ? course : c))));
  };

  const onEnroll = async (courseId: string) => {
    await courseClient.enrollInCourse(courseId);
    setEnrolledCourseIds([...enrolledCourseIds, courseId]);
  };

  const onUnenroll = async (courseId: string) => {
    await courseClient.unenrollFromCourse(courseId);
    setEnrolledCourseIds(enrolledCourseIds.filter((id) => id !== courseId));
  };

  useEffect(() => {
    fetchCourses();
  }, [currentUser, showAllCourses]);

  if (!currentUser) {
    return (
      <div id="wd-dashboard">
        <h1>Dashboard</h1>
        <p>Please <a href="/account/signin">sign in</a> to view courses.</p>
      </div>
    );
  }

  return (
    <div id="wd-dashboard">
      <h1 id="wd-dashboard-title">Dashboard</h1><hr />
      <h5>New Course
        <button className="btn btn-primary float-end" id="wd-add-new-course-click"
          onClick={onAddNewCourse}>Add</button>
        <button className="btn btn-warning float-end me-2" id="wd-update-course-click"
          onClick={onUpdateCourse}>Update</button>
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
      <h2 id="wd-dashboard-published">Published Courses ({courses.length})</h2><hr />
      <div id="wd-dashboard-courses">
        <Row xs={1} md={5} className="g-4">
          {courses.map((c: any) => (
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
                      onDeleteCourse(c._id);
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
                    {enrolledCourseIds.includes(c._id) ? (
                      <button className="btn btn-danger w-100" onClick={() => onUnenroll(c._id)}>Unenroll</button>
                    ) : (
                      <button className="btn btn-success w-100" onClick={() => onEnroll(c._id)}>Enroll</button>
                    )}
                  </div>
                )}
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
}
