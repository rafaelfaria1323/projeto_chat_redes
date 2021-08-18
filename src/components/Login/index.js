import React from "react";
import "./style.css";
import Logo from "../ContentArea/ChatIntro/logo.png";
import GoogleButton from "react-google-button";
import firebase from "../../firebase";
require("firebase/auth");

const auth = firebase.auth();

const Login = () => {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().languageCode = "pt";
    auth.signInWithPopup(provider);
  };

  return (
    <div className="login">
      <div className="login-container">
        <img src={Logo} alt="" />
        <div className="login-text">
          <h2
            style={{
              fontFamily: "Segoe UI",
              fontWeight: "normal",
              fontSize: "32px",
              color: "#0084ff",
            }}
          >
            Bem-vindo ao PeopleChat
          </h2>
        </div>
        <GoogleButton
          className="button"
          type="light"
          onClick={signInWithGoogle}
          label="Entrar com o Google"
          style={{
            width: "100%",
            marginLeft: "3px",
          }}
        />
      </div>
    </div>
  );
};

export default Login;
