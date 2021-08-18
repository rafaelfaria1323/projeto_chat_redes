import React from "react";
import "./style.css";
import Api from "../../../../../Api";

const BanItem = (props) => {
  const handleUnBanUser = () => {
    if (window.confirm("Deseja mesmo desbanir este participante?")) {
      Api.unbanUser(props.groupId, props.data);
    }
  };
  return (
    <>
      <div className="bannedListItem" onClick={() => handleUnBanUser()}>
        <img
          className="bannedListItem-avatar"
          src={props.data.avatar}
          alt={props.data.name}
        />
        <div className="bannedListItem-name">{props.data.name}</div>
      </div>
    </>
  );
};

export default BanItem;
