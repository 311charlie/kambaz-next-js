import Link from "next/link";
import { ListGroup, ListGroupItem } from "react-bootstrap";
import { BsGripVertical } from "react-icons/bs";
import { FaSearch, FaPlus, FaCaretDown } from "react-icons/fa";
import { IoEllipsisVertical } from "react-icons/io5";
import { FaCheckCircle } from "react-icons/fa";

export default function Assignments() {
  return (
    <div id="wd-assignments">
      <div className="d-flex mb-3">
        <div className="input-group w-50">
          <span className="input-group-text bg-white">
            <FaSearch />
          </span>
          <input
            type="text"
            className="form-control"
            placeholder="Search for Assignments"
            id="wd-search-assignment"
          />
        </div>
        <div className="ms-auto">
          <button className="btn btn-secondary me-2" id="wd-add-assignment-group">
            <FaPlus className="me-1" /> Group
          </button>
          <button className="btn btn-danger" id="wd-add-assignment">
            <FaPlus className="me-1" /> Assignment
          </button>
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
            <ListGroupItem className="p-3 ps-1 d-flex align-items-center wd-lesson">
              <BsGripVertical className="me-2 fs-3" />
              <div className="flex-grow-1">
                <Link href="/courses/1234/assignments/123" className="wd-assignment-link text-decoration-none text-dark fw-bold">
                  A1 - ENV + HTML
                </Link>
                <br />
                <span className="text-muted">
                  <span className="text-danger">Multiple Modules</span> | <b>Not available until</b> May 6 at 12:00am | <b>Due</b> May 13 at 11:59pm | 100 pts
                </span>
              </div>
              <FaCheckCircle className="text-success me-2" />
              <IoEllipsisVertical className="fs-4" />
            </ListGroupItem>
            <ListGroupItem className="p-3 ps-1 d-flex align-items-center wd-lesson">
              <BsGripVertical className="me-2 fs-3" />
              <div className="flex-grow-1">
                <Link href="/courses/1234/assignments/124" className="wd-assignment-link text-decoration-none text-dark fw-bold">
                  A2 - CSS + Bootstrap
                </Link>
                <br />
                <span className="text-muted">
                  <span className="text-danger">Multiple Modules</span> | <b>Not available until</b> May 13 at 12:00am | <b>Due</b> May 20 at 11:59pm | 100 pts
                </span>
              </div>
              <FaCheckCircle className="text-success me-2" />
              <IoEllipsisVertical className="fs-4" />
            </ListGroupItem>
            <ListGroupItem className="p-3 ps-1 d-flex align-items-center wd-lesson">
              <BsGripVertical className="me-2 fs-3" />
              <div className="flex-grow-1">
                <Link href="/courses/1234/assignments/125" className="wd-assignment-link text-decoration-none text-dark fw-bold">
                  A3 - JavaScript + React
                </Link>
                <br />
                <span className="text-muted">
                  <span className="text-danger">Multiple Modules</span> | <b>Not available until</b> May 20 at 12:00am | <b>Due</b> May 27 at 11:59pm | 100 pts
                </span>
              </div>
              <FaCheckCircle className="text-success me-2" />
              <IoEllipsisVertical className="fs-4" />
            </ListGroupItem>
          </ListGroup>
        </ListGroupItem>
      </ListGroup>
    </div>
  );
}
