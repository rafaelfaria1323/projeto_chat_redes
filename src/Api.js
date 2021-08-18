import firebase from "./firebase";
import "firebase/firestore";
import "firebase/storage";
import moment from "moment";
import { ShowNotification } from "./notification";
import { SendEmail } from "./sendemail";

const db = firebase.firestore();
const storage = firebase.storage();

export default {
  getGroups: (setGroupsList) => {
    return db
      .collection("groups")
      .orderBy("date", "desc")
      .onSnapshot((snapshot) =>
        setGroupsList(snapshot.docs.map((doc) => doc.data()))
      );
  },
  getMessages: (selectedGroupId, setMessagesList) => {
    return db
      .collection("groups")
      .doc(selectedGroupId)
      .collection("mensagens")
      .orderBy("date")
      .onSnapshot((snapshot) =>
        setMessagesList(snapshot.docs.map((doc) => doc.data()))
      );
  },
  sendMessage: (selectedgroup, user, text) => {
    db.collection("groups")
      .doc(selectedgroup.id)
      .get()
      .then(function (doc) {
        if (doc.exists) {
          db.collection("groups")
            .doc(selectedgroup.id)
            .collection("banned")
            .where("email", "==", user.email)
            .get()
            .then((snapshot) => {
              if (snapshot.size !== 1) {
                const newDocRef = db
                  .collection("groups")
                  .doc(selectedgroup.id)
                  .collection("mensagens")
                  .doc();
                newDocRef
                  .set({
                    text: text,
                    date: new Date().toLocaleString(),
                    dateFormated: moment().format("HH:mm"),
                    author: user.email,
                    from: user.displayName,
                    Type: "text",
                    id: newDocRef.id,
                  })
                  .then(() => {
                    db.collection("groups")
                      .doc(selectedgroup.id)
                      .collection("participantes")
                      .where("email", "==", user.email)
                      .get()
                      .then((snapshot) => {
                        if (snapshot.size !== 1) {
                          const newDocRef = db
                            .collection("groups")
                            .doc(selectedgroup.id)
                            .collection("participantes")
                            .doc();
                          newDocRef.set({
                            email: user.email,
                            name: user.displayName,
                            avatar: user.photoURL,
                            id: newDocRef.id,
                          });
                        }
                        db.collection("groups")
                          .doc(selectedgroup.id)
                          .update({
                            lastFrom: user.email,
                            lastFromName: user.displayName,
                            lastMessage: text,
                            date: new Date().toLocaleString(),
                            dateFormated: moment().format("HH:mm"),
                          });
                      });
                  })
                  .catch((e) => {
                    console.log(e);
                  });
              } else {
                ShowNotification(
                  "Você foi banido deste grupo não poderá enviar mais mensagens para o mesmo",
                  "danger",
                  "Erro!"
                );
              }
            });
        } else {
          ShowNotification(
            "Deve selecionar outro grupo pois o que está a tentar enviar uma mensagem já não existe",
            "danger",
            "Erro!"
          );
        }
      });
  },
  createGroupWithImg: (
    groupImage,
    groupName,
    groupDescri,
    user,
    selectValue
  ) => {
    const file = groupImage.files[0];

    const fileRef = storage.ref(`./groups/${file.name}`);
    fileRef.put(file);

    storage
      .ref()
      .child("groups")
      .child(file.name)
      .getDownloadURL()
      .then(function (url) {
        const newDocRef = db.collection("groups").doc();
        newDocRef
          .set({
            name: groupName,
            descri: groupDescri,
            img: url,
            imgName: file.name,
            date: new Date().toLocaleString(),
            dateFormated: moment().format("HH:mm"),
            by: user.email,
            byName: user.displayName,
            byAt: new Date().toLocaleDateString(),
            lastFrom: "",
            lastFromName: "",
            lastMessage: "",
            restri: selectValue,
            id: newDocRef.id,
          })
          .then(() => {
            const putParci = db
              .collection("groups")
              .doc(newDocRef.id)
              .collection("participantes")
              .doc();
            putParci
              .set({
                email: user.email,
                name: user.displayName,
                avatar: user.photoURL,
                id: newDocRef.id,
              })
              .then(() => {
                ShowNotification(
                  "O grupo " + groupName + " foi criado com sucesso",
                  "success",
                  "Sucesso"
                );
              });
          })
          .catch((e) => {
            console.log(e);
          });
      })
      .catch((e) => {
        console.log(e);
      });
  },
  createGroupWithDefaultImg: (groupName, groupDescri, user, selectValue) => {
    const firestLetter = groupName.charAt(0).toLowerCase();
    storage
      .ref()
      .child("letters")
      .child(firestLetter + ".png")
      .getDownloadURL()
      .then(function (url) {
        const newDocRef = db.collection("groups").doc();
        newDocRef
          .set({
            name: groupName,
            descri: groupDescri,
            img: url,
            imgName: firestLetter + ".png",
            date: new Date().toLocaleString(),
            dateFormated: moment().format("HH:mm"),
            by: user.email,
            byName: user.displayName,
            byAt: new Date().toLocaleDateString(),
            lastFrom: "",
            lastFromName: "",
            lastMessage: "",
            restri: selectValue,
            id: newDocRef.id,
          })
          .then(() => {
            const putParci = db
              .collection("groups")
              .doc(newDocRef.id)
              .collection("participantes")
              .doc();
            putParci
              .set({
                email: user.email,
                name: user.displayName,
                avatar: user.photoURL,
                id: newDocRef.id,
              })
              .then(() => {
                ShowNotification(
                  "O grupo " + groupName + " foi criado com sucesso",
                  "success",
                  "Sucesso"
                );
              });
          })
          .catch((e) => {
            console.log(e);
          });
      });
  },
  getParci: (selectedGroupId, setParciList) => {
    return db
      .collection("groups")
      .doc(selectedGroupId)
      .collection("participantes")
      .orderBy("name")
      .onSnapshot((snapshot) =>
        setParciList(snapshot.docs.map((doc) => doc.data()))
      );
  },
  getBanned: (selectedGroupId, setBanList) => {
    return db
      .collection("groups")
      .doc(selectedGroupId)
      .collection("banned")
      .orderBy("name")
      .onSnapshot((snapshot) =>
        setBanList(snapshot.docs.map((doc) => doc.data()))
      );
  },
  updateDescriGroup: (selectedGroupId, text) => {
    db.collection("groups").doc(selectedGroupId).update({
      descri: text,
    });
  },
  updateNameGroup: (selectedGroupId, text) => {
    console.log(selectedGroupId);
    db.collection("groups").doc(selectedGroupId).update({
      name: text,
    });
  },
  deleteGroup: (groupId) => {
    db.collection("groups").doc(groupId).delete();
  },
  sendFileMessage: (e, selectedGroup, user) => {
    db.collection("groups")
      .doc(selectedGroup.id)
      .get()
      .then(function (doc) {
        if (doc.exists) {
          db.collection("groups")
            .doc(selectedGroup.id)
            .collection("banned")
            .where("email", "==", user.email)
            .get()
            .then((snapshot) => {
              if (snapshot.size !== 1) {
                const file = e.target.files[0];
                const fileSize = e.target.files[0].size;
                const lastDot = file.name.lastIndexOf(".");
                const ext = file.name.substring(lastDot + 1);

                if (fileSize <= 64000000) {
                  storage
                    .ref()
                    .child(`messages/${selectedGroup.id}/${file.name}`)
                    .put(file)
                    .then((s) => {
                      storage
                        .ref()
                        .child(`messages/${selectedGroup.id}/${file.name}`)
                        .getDownloadURL()
                        .then((url) => {
                          const newDocRef = db
                            .collection("groups")
                            .doc(selectedGroup.id)
                            .collection("mensagens")
                            .doc();
                          newDocRef
                            .set({
                              text: "",
                              date: new Date().toLocaleString(),
                              dateFormated: moment().format("HH:mm"),
                              author: user.email,
                              from: user.displayName,
                              Type: ext,
                              fileUrl: url,
                              id: newDocRef.id,
                            })
                            .then(() => {
                              db.collection("groups")
                                .doc(selectedGroup.id)
                                .collection("participantes")
                                .where("email", "==", user.email)
                                .get()
                                .then((snapshot) => {
                                  if (snapshot.size !== 1) {
                                    const newDocRef = db
                                      .collection("groups")
                                      .doc(selectedGroup.id)
                                      .collection("participantes")
                                      .doc();
                                    newDocRef.set({
                                      email: user.email,
                                      name: user.displayName,
                                      avatar: user.photoURL,
                                      id: newDocRef.id,
                                    });
                                  }
                                  db.collection("groups")
                                    .doc(selectedGroup.id)
                                    .update({
                                      lastFrom: user.email,
                                      lastFromName: user.displayName,
                                      lastMessage: "🗂️ Ficheiro",
                                      date: new Date().toLocaleString(),
                                      dateFormated: moment().format("HH:mm"),
                                    });
                                });
                            })
                            .catch((e) => {
                              console.log(e);
                            });
                        });
                    });
                } else {
                  ShowNotification(
                    "O ficheiro que está a tentar colocar é demasiado grande!",
                    "danger",
                    "Erro!"
                  );
                }
              } else {
                ShowNotification(
                  "Você foi banido deste grupo não poderá enviar mais mensagens para o mesmo",
                  "danger",
                  "Erro!"
                );
              }
            });
        } else {
          ShowNotification(
            "Deve selecionar outro grupo pois o que está a tentar enviar uma mensagem já não existe",
            "danger",
            "Erro!"
          );
        }
      });
  },
  getGroupInfo: (gId, setGroup) => {
    return db
      .collection("groups")
      .doc(gId)
      .onSnapshot(function (doc) {
        setGroup(doc.data());
      });
  },
  addReport: (userEmail, gId, gByName, gBy, gName, gPhotoName) => {
    db.collection("groups")
      .doc(gId)
      .collection("banned")
      .where("email", "==", userEmail)
      .get()
      .then((snapshot) => {
        if (snapshot.size !== 1) {
          db.collection("groups")
            .doc(gId)
            .collection("reports")
            .where("email", "==", userEmail)
            .get()
            .then((snapshot) => {
              if (snapshot.size === 0) {
                db.collection("groups")
                  .doc(gId)
                  .collection("reports")
                  .add({
                    email: userEmail,
                    date: new Date().toLocaleDateString(),
                  })
                  .then(() => {
                    ShowNotification(
                      "O seu report foi efetuado com sucesso, agradecemos a sua ajuda",
                      "success",
                      "Sucesso"
                    );
                    SendEmail(
                      "O seu grupo " +
                        gName +
                        " recebeu um report agradecemos que apele ao bom senso dos seus participantes para cumprir as regras",
                      gBy,
                      gByName
                    );

                    db.collection("groups")
                      .doc(gId)
                      .collection("reports")
                      .get()
                      .then((snapshot) => {
                        if (snapshot.size === 1) {
                          db.collection("groups")
                            .doc(gId)
                            .delete()
                            .then(() => {
                              SendEmail(
                                "O seu grupo " +
                                  gName +
                                  " foi eliminado tente ter mais cuidado em grupos futuros",
                                gBy,
                                gByName
                              );
                              storage
                                .ref()
                                .child("groups")
                                .child(gPhotoName)
                                .delete();
                            });
                        }
                      });
                  }); 
              } else {
                ShowNotification(
                  "Você não pode dar mais report neste grupo",
                  "danger",
                  "Erro!"
                );
              }
            });
        } else {
          ShowNotification(
            "Você foi banido deste grupo não poderá enviar mais reports para o mesmo",
            "danger",
            "Erro!"
          );
        }
      });
  },
  deleteMessage: (messageID, gID, user) => {
    db.collection("groups")
      .doc(gID)
      .collection("mensagens")
      .doc(messageID)
      .delete()
      .then(() => {
        db.collection("groups")
          .doc(gID)
          .update({
            lastFrom: user.email,
            lastFromName: user.displayName,
            lastMessage: "Mensagem eliminada!",
            date: new Date().toLocaleString(),
            dateFormated: moment().format("HH:mm"),
          })
          .then(() => {
            ShowNotification(
              "Mensagem eliminada com sucesso",
              "success",
              "Sucesso"
            );
          });
      });
  },
  banUser: (data, gID) => {
    db.collection("groups")
      .doc(gID)
      .collection("participantes")
      .doc(data.id)
      .delete()
      .then(() => {
        const newDocRef = db
          .collection("groups")
          .doc(gID)
          .collection("banned")
          .doc();
        newDocRef
          .set({
            email: data.email,
            avatar: data.avatar,
            name: data.name,
            id: newDocRef.id,
          })
          .then(() => {
            ShowNotification(
              "Participante banido com sucesso",
              "success",
              "Sucesso"
            );
          })
          .catch((e) => {
            console.log(e);
          });
      })
      .catch((e) => {
        console.log(e);
      });
  },
  unbanUser: (gID, data) => {
    db.collection("groups")
      .doc(gID)
      .collection("banned")
      .doc(data.id)
      .delete()
      .then(() => {
        const newDocRef = db
          .collection("groups")
          .doc(gID)
          .collection("participantes")
          .doc();
        newDocRef
          .set({
            avatar: data.avatar,
            email: data.email,
            name: data.name,
            id: newDocRef.id,
          })
          .then(() => {
            ShowNotification(
              "Participante desbanido com sucesso",
              "success",
              "Sucesso"
            );
          })
          .catch((e) => {
            console.log(e);
          });
      });
  },
};
