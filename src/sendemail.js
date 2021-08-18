import emailjs from "emailjs-com";

export function SendEmail(text, by, byName) {
  emailjs.send(
    "service_b7g2cv7",
    "template_kzqnvef",
    {
      to_name: byName,
      from_name: "PeoPleChat",
      message: text,
      email_user: by,
    },
    "user_OdHjcnJ7FZBroiGFE9eZ4"
  );
}
