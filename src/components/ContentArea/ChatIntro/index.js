import React from "react";
import "./style.css";
import Logo from "./logo.png";

const ChatIntro = () => {
  return (
    <div className="chatIntro">
      <img src={Logo} alt="" />
      <h1>Crie ou junte-se a um grupo</h1>
      <h2>Lembre-se de manter o respeito nos grupos que frequentar</h2>
    </div>
  );
};

export default ChatIntro;
