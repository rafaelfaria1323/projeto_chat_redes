import React from "react";
import "./style.css";
import ReactPlayer from "react-player";
import { ShowNotification } from "../../../../notification";
import Api from "../../../../Api";

const MessagesItem = (props) => {
  const handleDelete = () => {
    if (
      props.user.email !== props.data.author &&
      props.user.email !== props.selectedgroup.by
    ) {
      ShowNotification(
        "Não pode tentar apagar mensagens de outros utilizadores",
        "danger",
        "Erro!"
      );
    } else {
      if (window.confirm("Deseja mesmo eliminar a sua mensagem?")) {
        Api.deleteMessage(props.data.id, props.selectedgroup.id, props.user);
      }
    }
  };

  return (
    <div
      className="messageLine"
      style={{
        justifyContent:
          props.user.email !== props.data.author ? "flex-start" : "flex-end",
      }}
    >
      <div
        className="messageItem"
        style={{
          backgroundColor:
            props.user.email !== props.data.author ? "#fff" : "#00F5FF",
        }}
        onClick={() => handleDelete()}
      >
        <div className="messageText">
          {props.user.email !== props.data.author ? (
            <h5 style={{ height: "0", marginTop: "-5px", color: "#0084ff" }}>
              {props.data.from}
            </h5>
          ) : null}
          {props.data.Type !== "text" ? (
            props.data.Type === "mp3" ? (
              <audio controls>
                <source src={props.data.fileUrl} type="audio/mp3" />
              </audio>
            ) : props.data.Type === "mp4" ? (
              <ReactPlayer
                url={props.data.fileUrl}
                width="100%"
                height="100%"
                controls={true}
              />
            ) : (
              <img src={props.data.fileUrl} alt={props.data.fileUrl} />
            )
          ) : (
            props.data.text
          )}
        </div>
        <div className="messageDate">{props.data.dateFormated}</div>
      </div>
    </div>
  );
};

export default MessagesItem;
