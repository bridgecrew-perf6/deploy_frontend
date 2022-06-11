import React, { useEffect, useState } from "react";
import {
  ProfilePageContainer,
  ProfileAvatar,
  ListNavigationButton,
} from "./profileComponents";
import { NavLink, Outlet } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useDispatch, useSelector } from "react-redux";
import { authenticationSuccess } from "../../../redux/actions/user";

function Profile() {
  const { currentUser } = useSelector((state) => state.userReducer);
  const [user, setUser] = useState(null);

  const dispatch = useDispatch();
  useEffect(() => {
    setUser(currentUser);
  }, [currentUser]);

  const NavStyles = ({ isActive }) => {
    return {
      borderBottom: isActive ? "solid 2px rgb(99, 98, 98)" : "",
    };
  };
  const [allowChanges, setAllowChanges] = useState(false);

  const updateInfo = async () => {
    try {
      setAllowChanges(false);

      const res = await axios.post(`https://topnotch-backend.herokuapp.com/api/customer/updateInfo`, {user, profileImg}, {
        headers: {
          userinfo: Cookies.get("userToken"),
        },
      });

      const { success, msg, reset } = res.data;

      if (success && reset) {
        return window.location.reload();
      }

      if(success && !reset) {
        return toast(msg, { type: "success" });
      }
      return toast(msg, { type: "error" });
    } catch (error) {
      console.log(error.message);
    }
  };
  const [profileImg, setProfileImg] = useState(null);

  useEffect(() => {
    if (profileImg) {
      try {
        const reader = new FileReader();

        reader.readAsDataURL(profileImg);

        reader.onloadend = async () => {
          console.log(reader.result);
          setProfileImg(reader.result);
        };
      } catch (error) {
        console.log(error.message);
      }
    }
  }, [profileImg]);
  return (
    <ProfilePageContainer>
      <ToastContainer autoClose={1500} />
      {allowChanges && (
        <i className="fa-solid fa-floppy-disk" onClick={updateInfo}></i>
      )}
      {!allowChanges && (
        <i
          className="fa-solid fa-pencil allowChangesBtn"
          onClick={() => setAllowChanges(true)}
        ></i>
      )}

      <ProfileAvatar>
        <div>
          {profileImg ? (
            <img src={profileImg} alt="" />
          ) : (
            <img src={user?.profile_image_url} alt="" />
          )}


          {allowChanges && (
            <input
              type={"file"}
              accept="*/image"
              onChange={(e) => setProfileImg(e.target.files[0])}
            />
          )}
        </div>
        <span>
          {user?.firstname} {user?.lastname}
        </span>
      </ProfileAvatar>

      <ListNavigationButton>
        <NavLink to="personal" style={NavStyles}>
          Personal Info
        </NavLink>
        <NavLink to="activities" style={NavStyles}>
          Activities
        </NavLink>
      </ListNavigationButton>

      <Outlet context={{ allowChanges, setUser, user }} />
    </ProfilePageContainer>
  );
}

export default Profile;
