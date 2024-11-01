// content.js

document.addEventListener("mouseup", function () {
  const selectedText = window.getSelection().toString().trim();

  if (selectedText) {
    console.log("Selected text:", selectedText);

    const rect = window.getSelection().getRangeAt(0).getBoundingClientRect();
    const button = createTranslateButton(rect);

    button.addEventListener("click", () => {
      console.log("Translate button clicked");
      chrome.runtime.sendMessage({ type: "TRANSLATE", text: selectedText });
      document.body.removeChild(button);
    });

    document.body.appendChild(button);
    setTimeout(() => {
      document.body.removeChild(button);
    }, 2000);
  }
});

function createTranslateButton(rect) {
  const button = document.createElement("button");
  button.textContent = "Translate";
  button.style.position = "absolute";
  button.style.top = `${rect.bottom + window.scrollY}px`;
  button.style.left = `${rect.left + window.scrollX}px`;
  button.style.zIndex = "9999";
  button.style.padding = "5px 10px";
  button.style.backgroundColor = "#4CAF50";
  button.style.color = "white";
  button.style.border = "none";
  button.style.cursor = "pointer";
  return button;
}

chrome.runtime.onMessage.addListener((message) => {
  if (message.type === "TRANSLATION_RESULT") {
    console.log("Received translation result:", message.translation);

    const translationPopup = createTranslationPopup(message.translation);
    document.body.appendChild(translationPopup);

    setTimeout(() => {
      document.body.removeChild(translationPopup);
    }, 2000);
  }
});

function createTranslationPopup(translation) {
  const popup = document.createElement("div");
  popup.textContent = translation;
  popup.style.position = "absolute";
  popup.style.top = `${
    window.getSelection().getRangeAt(0).getBoundingClientRect().bottom +
    window.scrollY
  }px`;
  popup.style.left = `${
    window.getSelection().getRangeAt(0).getBoundingClientRect().left +
    window.scrollX
  }px`;
  popup.style.maxWidth = "300px";
  popup.style.maxHeight = "500px";
  popup.style.overflowY = "auto";
  popup.style.backgroundColor = "#f1f1f1";
  popup.style.padding = "10px";
  popup.style.border = "1px solid #ccc";
  popup.style.zIndex = "9999";
  return popup;
}
