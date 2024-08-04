export function popupMessage(is_error: boolean, text: string): void {
  const popupMessageElement =
    document.querySelector<HTMLDivElement>(".popup-message");
  if (popupMessageElement) {
    popupMessageElement.remove();
  }

  const popup_message = document.createElement("div");
  popup_message.classList.add("popup-message");

  if (is_error) {
    popup_message.classList.add("popup-message-error");
  } else {
    popup_message.classList.add("popup-message-success");
  }

  popup_message.textContent = text;
  document.body.appendChild(popup_message);

  setTimeout(() => {
    popup_message.style.opacity = "1";
  }, 10);

  setTimeout(() => {
    if (document.body.contains(popup_message)) {
      popup_message.style.opacity = "0";
      setTimeout(() => {
        if (document.body.contains(popup_message)) {
          document.body.removeChild(popup_message);
        }
      }, 500);
    }
  }, 1500);
}
