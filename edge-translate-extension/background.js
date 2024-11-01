// background.js
importScripts("libs/crypto-js.js");
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "TRANSLATE") {
    const selectedText = message.text;
    console.log("Received message in background.js:", selectedText);

    fetchTranslation(selectedText).then((translatedText) => {
      console.log("Translated text:", translatedText);
      chrome.tabs.sendMessage(sender.tab.id, {
        type: "TRANSLATION_RESULT",
        translation: translatedText,
      });
    });
  }
});

function fetchTranslation(selectedText) {
  const appId = "20241016002177407";
  const secretKey = "UVlH6mcdFKWpmonu8Vuz";
  const salt = Date.now();
  const query = selectedText;
  const sign = md5(appId + query + salt + secretKey);

  const url = `https://fanyi-api.baidu.com/api/trans/vip/translate?q=${encodeURIComponent(
    query
  )}&from=en&to=zh&appid=${appId}&salt=${salt}&sign=${sign}`;

  console.log("Sending request to Baidu API:", url);

  return fetch(url)
    .then((response) => response.json())
    .then((data) => {
      console.log("Received response from Baidu API:", data);
      return data.trans_result
        ? data.trans_result[0].dst
        : "No translation found";
    })
    .catch((error) => {
      console.error("Error during translation request:", error);
      return "Error during translation";
    });
}

function md5(string) {
  return CryptoJS.MD5(string).toString();
}
