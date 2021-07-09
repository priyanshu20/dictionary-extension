console.log("thi si s the popup");

chrome.runtime.sendMessage(
  {
    message: "get_name",
  },
  (response) => {
    console.log(response);
  }
);
