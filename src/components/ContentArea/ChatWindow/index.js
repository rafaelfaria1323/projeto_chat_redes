import React, { useState, useEffect } from "react";
import Api from "../../../Api";
import Filter from "bad-words";
import EmojiPicker from "emoji-picker-react";
import "./style.css";
import { ShowNotification } from "../../../notification";

/* Componentes */
import MessageItem from "./MessagesItem/index";
import GroupInfo from "./GroupInfo/index";
import ChatIntro from "../ChatIntro/index";

import {
  AttachFile,
  InsertEmoticonOutlined,
  Send,
  Mic,
  Info,
  Room,
} from "@material-ui/icons";

const ChatWindow = (props) => {
  let recognition = null;
  let SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  if (SpeechRecognition !== undefined) {
    recognition = new SpeechRecognition();
  }

  const [emojiOpen, setEmojiOpen] = useState(false);
  const [text, setText] = useState("");
  const [listening, setListening] = useState(false);
  const [messagesList, setMessagesList] = useState([]);
  const [showGroupInfo, setShowGroupInfo] = useState(false);
  const [group, setGroup] = useState({});

  useEffect(() => {
    return Api.getMessages(props.selectedgroup.id, setMessagesList);
  }, [props.selectedgroup.id]);

  useEffect(() => {
    return Api.getGroupInfo(props.selectedgroup.id, setGroup);
  }, [props.selectedgroup.id]);

  const handleEmojiClick = (e, emojiObject) => {
    setText(text + emojiObject.emoji);
  };
  const handleOpenEmoji = () => {
    setEmojiOpen(!emojiOpen);
  };

  const handleGroupInfo = () => {
    setShowGroupInfo(!showGroupInfo);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSendClick();
    }
  };

  const handleSendClick = () => {
    if (text.length !== 0) {
      if (props.selectedgroup.restri === true) {
        const filter = new Filter();

        filter.addWords(
          "caralho",
          "merda",
          "puta",
          "cabrao",
          "cabrão",
          "fds",
          "pqp",
          "paneleiro",
          "foda-se",
          "fodasse",
          "cabra",
          "crlh",
          "fudido",
          "fdp"
        );

        if (filter.clean(text).toLowerCase().includes("*")) {
          ShowNotification(
            "Relembramos que este grupo possui restrição de palavras tente ter mais atenção a isso",
            "danger",
            "Erro!"
          );
        } else {
          Api.sendMessage(props.selectedgroup, props.user, text);
        }
      } else {
        Api.sendMessage(props.selectedgroup, props.user, text);
      }

      setText("");
      setEmojiOpen(false);
    } else {
      ShowNotification("Não pode enviar mensagens vázias.", "danger", "Erro!");
    }
  };

  const handleMicClick = () => {
    if (recognition !== null) {
      recognition.onstart = () => {
        setListening(true);
      };
      recognition.onend = () => {
        setListening(false);
      };
      recognition.onresult = (e) => {
        setText(e.results[0][0].transcript);
      };
      recognition.start();
    }
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        getCoordinates,
        handleErrorsLocation
      );
    } else {
      ShowNotification(
        "A Geolocalização não é compatível com este navegador.",
        "danger",
        "Erro!"
      );
    }
  };

  const getCoordinates = (position) => {
    Api.sendMessage(
      props.selectedgroup,
      props.user,
      "🌍📌 lat: " +
        position.coords.latitude +
        " long: " +
        position.coords.longitude
    );
  };

  const handleErrorsLocation = (error) => {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        ShowNotification(
          "Você recusou o acesso há Geolocation. Deve ir nas definições do seu navegador para alterar!",
          "danger",
          "Erro!"
        );
        break;
      case error.POSITION_UNAVAILABLE:
        ShowNotification(
          "As informações de localização não estão disponíveis.",
          "danger",
          "Erro!"
        );
        break;
      case error.TIMEOUT:
        ShowNotification(
          "A solicitação para obter a localização do usuário expirou.",
          "danger",
          "Erro!"
        );
        break;
      case error.UNKNOWN_ERROR:
        ShowNotification("Ocorreu um erro desconhecido.", "danger", "Erro!");
        break;
      default:
        ShowNotification("Ocorreu um erro desconhecido.", "danger", "Erro!");
        break;
    }
  };

  const FileMessage = (e) => {
    Api.sendFileMessage(e, props.selectedgroup, props.user);
  };

  return (
    <>
      {group ? (
        <div className="chatWindow">
          <GroupInfo
            show={showGroupInfo}
            setShow={setShowGroupInfo}
            selectedgroup={group}
            setG={setGroup}
            user={props.user}
          />
          <div className="chatWindow-header">
            <div className="chatWindow-header-info">
              <img className="chatWindow-avatar" src={group.img} alt="" />
              <div className="chatWindow-name" onClick={handleGroupInfo}>
                {group.name}
              </div>
            </div>
            <div className="chatWindow-header-buttons">
              <div className="chatWindow-btn">
                <input
                  style={{
                    display: "none",
                  }}
                  type="file"
                  onChange={(e) => FileMessage(e)}
                  id="fileMessage"
                  accept="audio/*,image/*,video/*"
                />
                <label htmlFor="fileMessage">
                  <AttachFile
                    style={{
                      color: "#919191",
                      marginTop: "5px",
                      cursor: "pointer",
                    }}
                  />
                </label>
              </div>
              <div className="chatWindow-btn" onClick={() => getLocation()}>
                <Room style={{ color: "#919191" }} />
              </div>
              <div onClick={handleGroupInfo} className="chatWindow-btn">
                <Info style={{ color: "#919191" }} />
              </div>
            </div>
          </div>
          <div className="chatWindow-body">
            {messagesList.map((item, key) => (
              <MessageItem
                key={key}
                data={item}
                user={props.user}
                selectedgroup={group}
              />
            ))}
          </div>
          <div
            className="chatWindow-emojiarea"
            style={{ height: emojiOpen ? "200px" : "0px" }}
          >
            <EmojiPicker
              onEmojiClick={handleEmojiClick}
              disableSearchBar
              disableSkinTonePicker
            />
          </div>
          <div className="chatWindow-footer">
            <div className="chatWindow-footer-left">
              <div className="chatWindow-btn" onClick={handleOpenEmoji}>
                <InsertEmoticonOutlined
                  style={{ color: emojiOpen ? "#009688" : "#919191" }}
                />
              </div>
            </div>
            <div className="chatWindow-footer-inputarea">
              <input
                className="chatWindow-footer-inputarea-input"
                type="text"
                placeholder="Escreve uma mensagem"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
            <div className="chatWindow-footer-right">
              <div className="chatWindow-btn">
                {text.length !== 0 ? (
                  <Send
                    onClick={handleSendClick}
                    style={{ color: "#919191" }}
                  />
                ) : (
                  <Mic
                    onClick={handleMicClick}
                    style={{ color: listening ? "#126ECE" : "#919191" }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <ChatIntro />
      )}
    </>
  );
};

export default ChatWindow;
