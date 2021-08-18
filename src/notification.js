import { store } from "react-notifications-component";

export function ShowNotification(text, type, title) {
  store.addNotification({
    title: title,
    message: text,
    type: type,
    insert: "top",
    container: "top-right",
    animationIn: ["animate__animated", "animate__fadeIn"],
    animationOut: ["animate__animated", "animate__fadeOut"],
    dismiss: {
      duration: 5000,
      onScreen: true,
    },
    width: 400,
  });
}
