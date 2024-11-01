chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  document.getElementById('translation').textContent = message.translation;
});
