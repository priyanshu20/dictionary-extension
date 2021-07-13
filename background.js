chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && /^http/.test(tab.url)) {
    chrome.scripting
      .insertCSS({
        target: { tabId: tabId },
        files: ["./foreground_styles.css"],
      })
      .then(() => {
        console.log("foreground STYLES injected!");

        chrome.scripting
          .executeScript({
            target: { tabId: tabId },
            files: ["./foreground.js"],
          })
          .then(() => {
            console.log("foreground SCript injected!");
            chrome.tabs.sendMessage(tabId, {
              message: "hello_frontend",
              payload: { text: "Here is some text for u" },
            });
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  }
});

/*
Message handler that send's back word's meaning
*/
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === "sendMeaning") {
    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en_US/${request.word}`)
      .then((response) => response.json())
      .then((data) => {
        sendResponse({ message: "success", data: data });
      })
      .catch((err) => {
        console.log(err);
        sendResponse({ message: "fail" });
      });
    return true;
  }
  return true;
});
