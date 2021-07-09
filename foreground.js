const modal = document.createElement("div");
const meaningHolder = document.createElement("p");
modal.appendChild(meaningHolder);

meaningHolder.innerText = "yaha pe matlab ki batein hongi!";
modal.classList.add("ce-modal");
meaningHolder.classList.add("ce-meaning-holder");

document.addEventListener("mouseup", (event) => {
  let deleteModal = document.querySelector(".ce-modal");
  if (deleteModal) {
    deleteModal.parentElement.removeChild(deleteModal);
  }
  let selectedText = window.getSelection().toString();
  if (selectedText) {
    let words = selectedText.trim().split(" ");
    if (words.length === 1) {
      console.log(event.clientX, event.clientY);
      modal.style.left = `${event.clientX}px`;
      modal.style.top = `${event.clientY}px`;
      document.querySelector("body").appendChild(modal);
      chrome.runtime.sendMessage(
        { message: "sendMeaning", word: words[0] },
        (response) => {
          console.log(response.data);
        }
      );
    } else console.log("That's a sentence create a highlight");
  }
});
