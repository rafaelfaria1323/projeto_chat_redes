import React from "react";
import "./style.css";

const ListGroups = (props) => {
  return (
    <>
      <div
        className={`groupListItem ${props.active ? "active" : ""}`}
        onClick={props.onClick}
      >
        <img className="groupListItem-avatar" src={props.data.img} alt="" />
        <div className="groupListItem-lines">
          <div className="groupListItem-line">
            <div className="groupListItem-name">{props.data.name}</div>
            <div className="groupListItem-date">{props.data.dateFormated}</div>
          </div>
          <div className="groupListItem-line">
            <div className="groupListItem-descrition">
              <p>
                {props.data.lastMessage.length !== 0
                  ? props.user.email === props.data.lastFrom
                    ? "Eu: " + props.data.lastMessage
                    : props.data.lastFromName + ": " + props.data.lastMessage
                  : ""}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ListGroups;
