import React, { useState, useEffect } from "react";
import "./style.css";
import Api from "../../../../Api";

import {
  ArrowForward,
  Edit,
  ThumbDown,
  Done,
  Close,
  Delete,
  Search,
} from "@material-ui/icons";
import Button from "@material-ui/core/Button";

/* Componentes */
import ParciItem from "./ParciItem/index";
import BanItem from "./BanItem/index";

const GroupInfo = (props) => {
  const [editName, setEditName] = useState(false);
  const [editDescri, setEditDescri] = useState(false);
  const [parciList, setParciList] = useState([]);
  const [banlist, setBanList] = useState([]);
  const [showIconsName, setShowIconsName] = useState(false);
  const [showIconsDescri, setShowIconsDescri] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupDescri, setGroupDescri] = useState("");
  const [searchParci, setSearchParci] = useState("");
  const [searchBan, setSearchBan] = useState("");
  const [filteredParci, setFilteredParci] = useState([]);
  const [filteredBanned, setFilteredBanned] = useState([]);

  useEffect(() => {
    setFilteredParci(
      parciList.filter((parci) => {
        return parci.name.toLowerCase().includes(searchParci.toLowerCase());
      })
    );
  }, [searchParci, parciList]);

  useEffect(() => {
    setFilteredBanned(
      banlist.filter((ban) => {
        return ban.name.toLowerCase().includes(searchBan.toLowerCase());
      })
    );
  }, [searchBan, banlist]);

  useEffect(() => {
    const fetchdata = () => {
      setGroupName(props.selectedgroup.name);
      setGroupDescri(props.selectedgroup.descri);
    };
    fetchdata();
  }, [
    props.selectedgroup.id,
    props.selectedgroup.name,
    props.selectedgroup.descri,
  ]);

  useEffect(() => {
    return Api.getParci(props.selectedgroup.id, setParciList);
  }, [props.selectedgroup.id]);

  useEffect(() => {
    return Api.getBanned(props.selectedgroup.id, setBanList);
  }, [props.selectedgroup.id]);

  const handleClose = () => {
    props.setShow(false);
  };

  const ToogleEditIconsName = () => {
    setGroupName(props.selectedgroup.name);
    setShowIconsName(!showIconsName);
    EditName();
  };

  const ToogleEditIconsDescri = () => {
    setGroupDescri(props.selectedgroup.descri);
    setShowIconsDescri(!showIconsDescri);
    EditDescri();
  };

  const EditName = () => {
    setEditName(!editName);
  };

  const EditDescri = () => {
    setEditDescri(!editDescri);
  };

  const UpdateName = () => {
    Api.updateNameGroup(props.selectedgroup.id, groupName);
    setShowIconsName(!showIconsName);
    EditName();
  };

  const UpdateDescri = () => {
    Api.updateDescriGroup(props.selectedgroup.id, groupDescri);
    setShowIconsDescri(!showIconsDescri);
    EditDescri();
  };

  const handleDeleteClick = () => {
    if (window.confirm("Deseja mesmo apagar este grupo?")) {
      Api.deleteGroup(props.selectedgroup.id);
      props.setG([]);
      handleClose();
    }
  };

  const handleReportClick = () => {
    if (window.confirm("Deseja mesmo dar report neste grupo?")) {
      Api.addReport(
        props.user.email,
        props.selectedgroup.id,
        props.selectedgroup.byName,
        props.selectedgroup.by,
        props.selectedgroup.name,
        props.selectedgroup.imgName
      );
      handleClose();
    }
  };

  return (
    <div className="groupInfo" style={{ right: props.show ? 0 : -415 }}>
      <div className="groupInfo-header">
        <div className="groupInfo-header-title" style={{ color: "#ffffff" }}>
          Detalhes do grupo
        </div>
        <div onClick={handleClose} className="groupInfo-back-button">
          <ArrowForward style={{ color: "#ffffff" }} />
        </div>
      </div>
      <div className="groupInfo-info">
        <div className="groupInfo-info-header">
          <div className="groupInfo-info-header-avatar">
            <img
              className="groupInfo-avatar"
              src={props.selectedgroup.img}
              alt=""
            />
          </div>
          <div className="groupInfo-info-header-info">
            <div className="groupInfo-info-header-info-name">
              <input
                type="text"
                maxLength="25"
                value={groupName}
                style={{
                  borderBottom: !editName ? "1px" || "solid" || " #0084ff" : "",
                }}
                disabled={!editName ? "disabled" : null}
                onChange={(e) => setGroupName(e.target.value)}
              />

              {props.selectedgroup.by === props.user.email ? (
                showIconsName ? (
                  <>
                    <Done
                      style={{ color: "#919191", cursor: "pointer" }}
                      onClick={UpdateName}
                    />
                    <Close
                      onClick={ToogleEditIconsName}
                      style={{ color: "#919191", cursor: "pointer" }}
                    />
                  </>
                ) : (
                  <Edit
                    style={{
                      float: "left",
                      marginLeft: "10px",
                      marginRight: "10px",
                      color: "#919191",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      EditName();
                      ToogleEditIconsName();
                    }}
                  />
                )
              ) : null}
            </div>
            <span
              style={{
                marginLeft: "10px",
                fontSize: "15px",
                color: "rgb(0 0 0 / 45%)",
              }}
            >
              Criado {props.selectedgroup.byAt}
            </span>
            <span
              style={{
                display: "block",
                marginLeft: "10px",
                marginBottom: "5px",
                fontSize: "15px",
                color: "rgb(0 0 0 / 45%)",
              }}
            >
              {" "}
              Restrição de palavras:{" "}
              {props.selectedgroup.restri ? "Sim" : "Não"}
            </span>
          </div>
        </div>
        <div className="groupInfo-info-descri">
          <span>Descrição</span>
          <p />
          <div className="groupInfo-info-descri-info">
            <textarea
              value={groupDescri}
              style={{
                borderBottom: !editDescri ? "1px" || "solid" || " #0084ff" : "",
              }}
              disabled={!editDescri ? "disabled" : null}
              onChange={(e) => setGroupDescri(e.target.value)}
            />

            {props.selectedgroup.by === props.user.email ? (
              showIconsDescri ? (
                <>
                  <Done
                    style={{ color: "#919191", cursor: "pointer" }}
                    onClick={UpdateDescri}
                  />
                  <Close
                    onClick={ToogleEditIconsDescri}
                    style={{ color: "#919191", cursor: "pointer" }}
                  />
                </>
              ) : (
                <Edit
                  style={{
                    float: "left",
                    marginLeft: "10px",
                    marginRight: "10px",
                    color: "#919191",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    EditDescri();
                    ToogleEditIconsDescri();
                  }}
                />
              )
            ) : null}
          </div>
        </div>
        <div className="groupInfo-info-participantes">
          <div className="groupInfo-info-search">
            <span>{filteredParci.length} participantes</span>
            <Search
              fontSize="small"
              style={{ color: "#919191", marginLeft: "10px" }}
            />
            <input
              type="search"
              placeholder="Procurar Participante"
              onChange={(e) => setSearchParci(e.target.value)}
            />
          </div>
          <div className="parcilist">
            {filteredParci.map((item, key) => (
              <ParciItem
                key={key}
                data={item}
                user={props.user}
                creator={props.selectedgroup.by}
                groupId={props.selectedgroup.id}
              />
            ))}
          </div>
        </div>
        {props.selectedgroup.by === props.user.email ? (
          <div className="groupInfo-info-banned">
            <div className="groupInfo-info-search">
              <span>{filteredBanned.length} banidos</span>
              <Search
                fontSize="small"
                style={{ color: "#919191", marginLeft: "30px" }}
              />
              <input
                type="search"
                placeholder="Procurar Participante Banido"
                onChange={(e) => setSearchBan(e.target.value)}
              />
            </div>
            <div className="parcilist">
              {filteredBanned.map((item, key) => (
                <BanItem
                  key={key}
                  data={item}
                  user={props.user}
                  creator={props.selectedgroup.by}
                  groupId={props.selectedgroup.id}
                />
              ))}
            </div>
          </div>
        ) : null}
        <div className="groupInfo-report">
          {props.selectedgroup.by === props.user.email ? (
            <>
              {" "}
              <Button
                variant="contained"
                style={{
                  backgroundColor: "transparent",
                  height: "100%",
                  width: "100%",
                }}
                startIcon={
                  <Delete
                    style={{
                      color: "red",
                      marginTop: "10px",
                      marginBottom: "10px",
                    }}
                  />
                }
                onClick={() => handleDeleteClick()}
              >
                Apagar Grupo
              </Button>
            </>
          ) : (
            <>
              {" "}
              <Button
                variant="contained"
                style={{
                  backgroundColor: "transparent",
                  height: "100%",
                  width: "100%",
                }}
                startIcon={
                  <ThumbDown
                    style={{
                      color: "red",
                      marginTop: "6px",
                    }}
                  />
                }
                onClick={() => handleReportClick()}
              >
                Reportar Grupo
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default GroupInfo;
