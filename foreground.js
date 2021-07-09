const ceModal = document.createElement("div");
const ceHeader = document.createElement("div");
const ceWord = document.createElement("p");
const ceSpeaker = document.createElement("span");
const ceModalBody = document.createElement("div");
const ceMeaning = document.createElement("p");
const ceExample = document.createElement("p");

ceHeader.appendChild(ceWord);
ceHeader.appendChild(ceSpeaker);
ceModalBody.appendChild(ceMeaning);
ceModalBody.appendChild(ceExample);
ceModalBody.appendChild(ceHeader);
ceModalBody.appendChild(ceExample);
ceModal.appendChild(ceHeader);
ceModal.appendChild(ceModalBody);

ceModal.classList.add("ce-modal");
ceHeader.classList.add("ce-modal-header");
ceWord.classList.add("ce-word-pronunciation");
ceSpeaker.classList.add("speaker");
ceSpeaker.classList.add("-on");
ceModalBody.classList.add("ce-modal-body");
ceMeaning.classList.add("ce-word-meaning");
ceExample.classList.add("ce-word-example");

document.addEventListener("mouseup", (event) => {
  let deleteModal = document.querySelector(".ce-modal");
  if (deleteModal) {
    deleteModal.parentElement.removeChild(deleteModal);
  }
  let selectedText = window.getSelection().toString();
  if (selectedText) {
    let words = selectedText.trim().split(" ");
    if (words.length === 1) {
      ceModal.style.left = `${event.clientX}px`;
      ceModal.style.top = `${event.clientY}px`;
      document.querySelector("body").appendChild(ceModal);
      chrome.runtime.sendMessage(
        { message: "sendMeaning", word: words[0] },
        (response) => {
          console.log(response.data);
          let word = response.data[0];
          let meaning, example, pronunciationText;
          if (word.phonetics[0]) pronunciationText = word.phonetics[0].text;
          if (word.meanings[0]) {
            meaning = word.meanings[0].definitions[0].definition;
            example = word.meanings[0].definitions[0].example;
          }
          ceWord.innerText = pronunciationText;
          ceMeaning.innerText = meaning;
          ceExample.innerText = example;
        }
      );
    } else console.log("That's a sentence create a highlight");
  }
});
