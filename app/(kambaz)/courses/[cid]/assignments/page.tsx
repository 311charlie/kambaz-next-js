"use client";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ListGroup, ListGroupItem } from "react-bootstrap";
import { BsGripVertical } from "react-icons/bs";
import { FaSearch, FaPlus, FaCaretDown, FaCheckCircle, FaTrash } from "react-icons/fa";
import { IoEllipsisVertical } from "react-icons/io5";
import { useSelector, useDispatch } from "react-redux";
import { deleteAssignment } from "./reducer";
import { RootState } from "../../../store";

export default function Assignments() {
  const { cid } = useParams();
  const { assignments } = useSelector((state: RootState) => state.assignmentsReducer);
  const dispatch = useDispatch();
  const courseAssignments = assignments.filter((a: any) => a.course === cid);
  return (
    <div id="wd-assignments">
      <div className="d-flex mb-3">
        <div className="input-group w-50">
          <span className="input-group-text bg-white"><FaSearch /></span>
          <input type="text" className="form-control" placeholder="Search for Assignments" id="wd-search-assignment" />
        </div>
        <div className="ms-auto">
          <button className="btn btn-secondary me-2" id="wd-add-assignment-group">
            <FaPlus className="me-1" /> Group
          </button>
          <Link href={`/courses/${cid}/assignments/new`} className="btn btn-danger" id="wd-add-assignment">
            <FaPlus className="me-1" /> Assignment
          </Link>
        </div>
      </div>

      <ListGroup className="rounded-0" id="wd-assignment-list">
        <ListGroupItem className="p-0 mb-5 fs-5 border-gray">
          <div className="wd-title p-3 ps-2 bg-secondary d-flex align-items-center">
            <BsGripVertical className="me-2 fs-3" />
            <FaCaretDown className="me-2" />
            <span className="fw-bold">ASSIGNMENTS</span>
            <span className="ms-auto badge bg-secondary text-dark border border-dark rounded-pill">40% of Total</span>
            <FaPlus className="ms-3" />
            <IoEllipsisVertical className="ms-2 fs-4" />
          </div>
          <ListGroup className="rounded-0">
            {courseAssignments.map((assignment: any) => (
              <ListGroupItem key={assignment._id} className="p-3 ps-1 d-flex align-items-center wd-lesson">
                <BsGripVertical className="me-2 fs-3" />
                <div className="flex-grow-1">
                  <Link href={`/courses/${cid}/assignments/${assignment._id}`}
                    className="wd-assignment-link text-decoration-none text-dark fw-bold">
                    {assignment.title}
                  </Link>
                  <br />
                  <span className="text-muted">
                    <span className="text-danger">Multiple Modules</span> | <b>Not available until</b> {assignment.availableFrom} | <b>Due</b> {assignment.dueDate} | {assignment.points} pts
                  </span>
                </div>
                <FaCheckCircle className="text-success me-2" />
                <FaTrash className="text-danger me-2" style={{ cursor: "pointer" }}
                  onClick={() => {
                    if (window.confirm("Are you sure you want to remove this assignment?")) {
                      dispatch(deleteAssignment(assignment._id));
                    }
                  }} />
                <IoEllipsisVertical className="fs-4" />
              </ListGroupItem>
            ))}
          </ListGroup>
        </ListGroupItem>
      </ListGroup>
    </div>
  );
}
