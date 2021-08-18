import React, { useState, useEffect } from "react";
import "./App.css";
import firebase from "./firebase";
import "firebase/firestore";
import Api from "./Api";

import { Cancel, AddCircle, Search } from "@material-ui/icons";

/* Componentes */
import GroupListItem from "./components/SideBar/ListGroups/index";
import ChatIntro from "./components/ContentArea/ChatIntro/index";
import ChatWindow from "./components/ContentArea/ChatWindow/index";
import NewGroup from "./components/NewGroup/index";
import Login from "./components/Login/index";

import { useAuthState } from "react-firebase-hooks/auth";
const auth = firebase.auth();

const App = () => {
  const [groupslist, setGroupsList] = useState([]);
  const [selectedgroup, setSelectedGroup] = useState({});
  const [user] = useAuthState(auth);
  const [showNewGroup, setShowNewGroup] = useState(false);
  const [search, setSearch] = useState("");
  const [filteredGroups, setFilteredGroups] = useState([]);

  useEffect(() => {
    setFilteredGroups(
      groupslist.filter((group) => {
        return group.name.toLowerCase().includes(search.toLowerCase());
      })
    );
  }, [search, groupslist]);

  useEffect(() => {
    if (user !== null) {
      return Api.getGroups(setGroupsList);
    }
  }, [user]);

  const handleNewGroup = () => {
    setShowNewGroup(true);
  };

  return (
    <>
      {user ? (
        <div className="app-window">
          <div className="sidebar">
            <NewGroup
              show={showNewGroup}
              setShow={setShowNewGroup}
              user={user}
            />
            <header>
              <img
                className="header-avatar"
                src={user.photoURL}
                alt={user.displayName}
              />
              <div className="header-buttons">
                <div onClick={handleNewGroup} className="header-btn">
                  <AddCircle style={{ color: "#919191" }} />
                </div>
                <div className="header-btn">
                  <Cancel
                    onClick={() => {
                      setSelectedGroup({});
                      auth.signOut();
                    }}
                    style={{ color: "#919191" }}
                  />
                </div>
              </div>
            </header>
            <div className="search">
              <div className="search-input">
                <Search fontSize="small" style={{ color: "#919191" }} />
                <input
                  type="search"
                  placeholder="Procurar Grupo"
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="grouplist">
              {filteredGroups.map((item, key) => (
                <GroupListItem
                  key={key}
                  data={item}
                  user={user}
                  active={selectedgroup.id === filteredGroups[key].id}
                  onClick={() => setSelectedGroup(filteredGroups[key])}
                />
              ))}
            </div>
          </div>
          <div className="contentarea">
            {selectedgroup.id !== undefined ? (
              <ChatWindow user={user} selectedgroup={selectedgroup} />
            ) : (
              <ChatIntro />
            )}
          </div>
        </div>
      ) : (
        <Login />
      )}
    </>
  );
};

export default App;
