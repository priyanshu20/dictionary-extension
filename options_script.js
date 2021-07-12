let savedWords = document.querySelector(".saved-words");

chrome.storage.local.get("wordList", (result) => {
  for (word of result.wordList) {
    console.log(result.wordList);
    let addWord = document.createElement("li");
    addWord.innerText = word;
    savedWords.appendChild(addWord);
  }
});
