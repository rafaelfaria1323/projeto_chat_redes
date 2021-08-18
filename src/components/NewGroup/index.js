import React, { useState } from "react";
import "./style.css";
import Logo from "./NewGroup.png";
import Api from "../../Api";
import { ShowNotification } from "../../notification";

import { ArrowBack } from "@material-ui/icons";
import { MenuItem, TextField } from "@material-ui/core";

const NewGroup = (props) => {
  const [selectValue, setSelectValue] = useState(true);
  const [photo, setPhoto] = useState(Logo);

  const handleClose = () => {
    props.setShow(false);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const group_name = e.target.groupName.value;
    const group_descri = e.target.groupDescri.value;
    const group_img = e.target.groupImage;

    if (group_img.value.length === 0) {
      Api.createGroupWithDefaultImg(
        group_name,
        group_descri,
        props.user,
        selectValue
      );
    } else {
      Api.createGroupWithImg(
        group_img,
        group_name,
        group_descri,
        props.user,
        selectValue
      );
    }

    e.target.groupImage.value = "";
    e.target.groupName.value = "";
    e.target.groupDescri.value = "";
    
    setSelectValue(true);
    setPhoto(Logo);
    handleClose();
  };

  return (
    <div className="newGroup" style={{ left: props.show ? 0 : -415 }}>
      <div className="newGroup-header">
        <div onClick={handleClose} className="newGroup-back-button">
          <ArrowBack style={{ color: "#ffffff" }} />
        </div>
        <div className="newGroup-header-title" style={{ color: "#ffffff" }}>
          Criar novo Grupo
        </div>
      </div>
      <div className="newGroup-info">
        <form onSubmit={onSubmit}>
          <input
            style={{
              display: "none",
            }}
            type="file"
            name="groupImage"
            id="file"
            accept="image/*"
            onChange={(e) => setPhoto(URL.createObjectURL(e.target.files[0]))}
          />
          <label htmlFor="file">
            <img className="newGroup-avatar" src={photo} alt="" />
          </label>
          <p />
          <input
            className="newGroup-input"
            type="text"
            placeholder="Nome do Grupo"
            name="groupName"
            maxLength="25"
            required
          />
          <p />
          <input
            className="newGroup-input"
            type="text"
            placeholder="Descrição do Grupo"
            name="groupDescri"
            required
          />
          <p />
          <TextField
            style={{
              display: "block",
              margin: "auto",
              marginLeft: "40px",
            }}
            id="select"
            label="Restrição de palavras"
            value={selectValue}
            select
            onChange={(e) => setSelectValue(e.target.value)}
          >
            <MenuItem value={true}>Sim</MenuItem>
            <MenuItem value={false}>Não</MenuItem>
          </TextField>
          <p />
          <button className="newGroup-submit">Criar Grupo</button>
        </form>
      </div>
    </div>
  );
};

export default NewGroup;
