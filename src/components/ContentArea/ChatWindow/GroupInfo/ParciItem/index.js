import React from "react";
import "./style.css";
import Api from "../../../../../Api";
import { ShowNotification } from "../../../../../notification";

const ParciItem = (props) => {
  const handleBanUser = () => {
    if (props.user.email !== props.creator) {
      ShowNotification(
        "Não pode tentar banir outros utilizadores",
        "danger",
        "Erro!"
      );
    } else {
      if (props.data.email === props.user.email) {
        ShowNotification("Não pode se banir a si mesmo", "danger", "Erro!");
      } else {
        if (window.confirm("Deseja mesmo Banir este participante?")) {
          Api.banUser(props.data, props.groupId);
        }
      }
    }
  };
  return (
    <>
      <div className="parciListItem" onClick={() => handleBanUser()}>
        <img className="parciListItem-avatar" src={props.data.avatar} alt="" />
        <div className="parciListItem-name">
          {props.data.email !== props.user.email ? props.data.name : "Eu"}
        </div>
        {props.data.email === props.creator ? (
          <div className="parciListItem-admin">Administrador</div>
        ) : (
          ""
        )}
      </div>
    </>
  );
};

export default ParciItem;
