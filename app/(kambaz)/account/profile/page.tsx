"use client";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { setCurrentUser } from "../reducer";
import { RootState } from "../../store";
import { Button, FormControl } from "react-bootstrap";
import * as client from "../client";

export default function Profile() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);
  const [profile, setProfile] = useState<any>(currentUser);

  useEffect(() => {
    if (!currentUser) {
      router.push("/account/signin");
    }
  }, [currentUser]);

  const signout = async () => {
    await client.signout();
    dispatch(setCurrentUser(null));
    router.push("/account/signin");
  };
  const updateProfile = async () => {
    const updatedProfile = await client.updateUser(profile);
    dispatch(setCurrentUser(updatedProfile));
  };

  if (!currentUser) return null;

  return (
    <div className="wd-profile-screen">
      <h3>Profile</h3>
      <FormControl id="wd-username" className="mb-2" defaultValue={profile.username}
        onChange={(e) => setProfile({ ...profile, username: e.target.value })} />
      <FormControl id="wd-password" className="mb-2" defaultValue={profile.password}
        onChange={(e) => setProfile({ ...profile, password: e.target.value })} />
      <FormControl id="wd-firstname" className="mb-2" defaultValue={profile.firstName}
        onChange={(e) => setProfile({ ...profile, firstName: e.target.value })} />
      <FormControl id="wd-lastname" className="mb-2" defaultValue={profile.lastName}
        onChange={(e) => setProfile({ ...profile, lastName: e.target.value })} />
      <FormControl id="wd-dob" className="mb-2" type="date" defaultValue={profile.dob}
        onChange={(e) => setProfile({ ...profile, dob: e.target.value })} />
      <FormControl id="wd-email" className="mb-2" defaultValue={profile.email}
        onChange={(e) => setProfile({ ...profile, email: e.target.value })} />
      <select className="form-control mb-2" id="wd-role"
        onChange={(e) => setProfile({ ...profile, role: e.target.value })}>
        <option value="USER">User</option>
        <option value="ADMIN">Admin</option>
        <option value="FACULTY">Faculty</option>
        <option value="STUDENT">Student</option>
      </select>
      <Button onClick={updateProfile} className="w-100 mb-2">Update</Button>
      <Button onClick={signout} className="w-100 mb-2 btn-danger" id="wd-signout-btn">Sign out</Button>
    </div>
  );
}
