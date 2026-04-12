"use client";
import { useEffect, useState } from "react";
import { FormControl, FormSelect } from "react-bootstrap";
import { FaUserCircle, FaCheck } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";
import { IoCloseSharp } from "react-icons/io5";
import * as client from "../client";

export default function PeopleDetails({ uid, onClose }: { uid: string | null; onClose: () => void }) {
  const [user, setUser] = useState<any>({});
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [editingName, setEditingName] = useState(false);
  const [editingEmail, setEditingEmail] = useState(false);
  const [editingRole, setEditingRole] = useState(false);

  const fetchUser = async () => {
    if (!uid) return;
    const fetchedUser = await client.findUserById(uid);
    setUser(fetchedUser);
    setName(`${fetchedUser.firstName} ${fetchedUser.lastName}`);
    setEmail(fetchedUser.email || "");
    setRole(fetchedUser.role || "");
  };

  const deleteUser = async (uid: string) => {
    await client.deleteUser(uid);
    onClose();
  };

  const saveName = async () => {
    const nameParts = name.trim().split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";
    const updatedUser = { ...user, firstName, lastName };
    await client.updateUser(updatedUser);
    setUser(updatedUser);
    setName(`${firstName} ${lastName}`.trim());
    setEditingName(false);
  };

  const saveEmail = async () => {
    const updatedUser = { ...user, email };
    await client.updateUser(updatedUser);
    setUser(updatedUser);
    setEditingEmail(false);
  };

  const saveRole = async () => {
    const updatedUser = { ...user, role };
    await client.updateUser(updatedUser);
    setUser(updatedUser);
    setEditingRole(false);
  };

  const cancelNameEdit = () => {
    setName(`${user.firstName} ${user.lastName}`);
    setEditingName(false);
  };

  const cancelEmailEdit = () => {
    setEmail(user.email || "");
    setEditingEmail(false);
  };

  const cancelRoleEdit = () => {
    setRole(user.role || "");
    setEditingRole(false);
  };

  useEffect(() => {
    if (uid) fetchUser();
  }, [uid]);

  if (!uid) return null;

  return (
    <div className="wd-people-details position-fixed top-0 end-0 bottom-0 bg-white p-4 shadow w-25">
      <button onClick={onClose} className="btn position-fixed end-0 top-0 wd-close-details">
        <IoCloseSharp className="fs-1" />
      </button>
      <div className="text-center mt-2">
        <FaUserCircle className="text-secondary me-2 fs-1" />
      </div>
      <hr />

      <div className="text-danger fs-4 mb-3">
        {!editingName && (
          <FaPencil onClick={() => setEditingName(true)} className="float-end fs-5 mt-2 wd-edit" />
        )}
        {editingName && (
          <>
            <FaCheck onClick={saveName} className="float-end fs-5 mt-2 me-2 wd-save" />
            <IoCloseSharp onClick={cancelNameEdit} className="float-end fs-5 mt-2 me-2 wd-cancel-edit" />
          </>
        )}
        {!editingName && (
          <div className="wd-name" onClick={() => setEditingName(true)}>
            {user.firstName} {user.lastName}
          </div>
        )}
        {editingName && (
          <FormControl
            className="w-75 wd-edit-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") saveName();
              if (e.key === "Escape") cancelNameEdit();
            }}
          />
        )}
      </div>

      <div className="mb-2">
        <b>Email:</b>{" "}
        {!editingEmail && (
          <>
            <span className="wd-email">{user.email}</span>
            <FaPencil onClick={() => setEditingEmail(true)} className="ms-2 wd-edit" style={{ cursor: "pointer" }} />
          </>
        )}
        {editingEmail && (
          <div className="d-flex align-items-center">
            <FormControl
              type="email"
              className="w-75 wd-edit-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") saveEmail();
                if (e.key === "Escape") cancelEmailEdit();
              }}
            />
            <FaCheck onClick={saveEmail} className="ms-2 wd-save" style={{ cursor: "pointer" }} />
            <IoCloseSharp onClick={cancelEmailEdit} className="ms-2 wd-cancel-edit" style={{ cursor: "pointer" }} />
          </div>
        )}
      </div>

      <div className="mb-2">
        <b>Role:</b>{" "}
        {!editingRole && (
          <>
            <span className="wd-roles">{user.role}</span>
            <FaPencil onClick={() => setEditingRole(true)} className="ms-2 wd-edit" style={{ cursor: "pointer" }} />
          </>
        )}
        {editingRole && (
          <div className="d-flex align-items-center">
            <FormSelect
              className="w-75 wd-edit-role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="STUDENT">Student</option>
              <option value="TA">Assistant</option>
              <option value="FACULTY">Faculty</option>
              <option value="ADMIN">Administrator</option>
            </FormSelect>
            <FaCheck onClick={saveRole} className="ms-2 wd-save" style={{ cursor: "pointer" }} />
            <IoCloseSharp onClick={cancelRoleEdit} className="ms-2 wd-cancel-edit" style={{ cursor: "pointer" }} />
          </div>
        )}
      </div>

      <b>Login ID:</b> <span className="wd-login-id">{user.loginId}</span> <br />
      <b>Section:</b> <span className="wd-section">{user.section}</span> <br />
      <b>Total Activity:</b> <span className="wd-total-activity">{user.totalActivity}</span>
      <hr />
      <button onClick={() => deleteUser(uid)} className="btn btn-danger float-end wd-delete">
        Delete
      </button>
      <button onClick={onClose} className="btn btn-secondary float-end me-2 wd-cancel">
        Cancel
      </button>
    </div>
  );
}
