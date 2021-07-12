let htmlBody = document.querySelector("body");

htmlBody.addEventListener("mouseup", (event) => {
  let deleteModal = document.querySelector(".ce-modal");
  if (deleteModal) {
    deleteModal.parentElement.removeChild(deleteModal);
  }
  let selectedText = window.getSelection().toString();
  if (selectedText) {
    let words = selectedText.trim().split(" ");
    if (words.length === 1) {
      let loader = getLoader();

      loader.style.position = "fixed";
      loader.style.top = `${event.clientY}px`;
      loader.style.left = `${event.clientX}px`;

      document.querySelector("body").appendChild(loader);
      chrome.runtime.sendMessage(
        { message: "sendMeaning", word: words[0] },
        (response) => {
          console.log(response.data);
          loader.parentElement.removeChild(loader);
          populateModal(response.data, event);
          ceModal.style.display = "block";
          carouselFunctionality(response.data);
        }
      );
    } else console.log("That's a sentence create a highlight");
  }
});

const carouselFunctionality = (data) => {
  let word, wordPronunciation, audioLink, meanings;
  if (data[0]) {
    word = data[0].word;
    if (data[0].phonetics[0]) {
      wordPronunciation = data[0].phonetics[0].text;
      audioLink = data[0].phonetics[0].audio;
    }
    meanings = data[0].meanings;
  }

  let translateValue = 100 / meanings.length;

  const left = document.querySelector(".ce-left");
  const right = document.querySelector(".ce-right");

  const slider = document.querySelector(".ce-slider");

  const indicatorParent = document.querySelector(".ce-control ul");
  const indicators = document.querySelectorAll(".ce-control li");
  index = 0;

  indicators.forEach((indicator, i) => {
    indicator.addEventListener("click", () => {
      document
        .querySelector(".ce-control .ce-selected")
        .classList.remove("ce-selected");
      indicator.classList.add("ce-selected");
      slider.style.transform = "translateX(" + i * -translateValue + "%)";
      index = i;
    });
  });

  left.addEventListener("click", function () {
    index = index > 0 ? index - 1 : 0;
    document
      .querySelector(".ce-control .ce-selected")
      .classList.remove("ce-selected");
    indicatorParent.children[index].classList.add("ce-selected");
    slider.style.transform = "translateX(" + index * -translateValue + "%)";
  });

  right.addEventListener("click", function () {
    index = index < meanings.length - 1 ? index + 1 : meanings.length - 1;
    document
      .querySelector(".ce-control .ce-selected")
      .classList.remove("ce-selected");
    indicatorParent.children[index].classList.add("ce-selected");
    slider.style.transform = "translateX(" + index * -translateValue + "%)";
  });
};

const populateModal = (data, event) => {
  let word, audioLink, meanings;
  if (data[0]) {
    word = data[0].word;
    if (data[0].phonetics[0]) {
      wordPronunciation = data[0].phonetics[0].text;
      audioLink = data[0].phonetics[0].audio;
    }
    meanings = data[0].meanings;
  }

  let ceModal = document.createElement("div");
  ceModal.classList.add("ce-modal");

  let ceModalContainer = document.createElement("div");
  ceModalContainer.classList.add("ce-modal-container");

  ceModal.appendChild(ceModalContainer);

  let linkMaterialFonts = document.createElement("link");
  linkMaterialFonts.setAttribute(
    "href",
    "https://fonts.googleapis.com/icon?family=Material+Icons"
  );
  linkMaterialFonts.setAttribute("rel", "stylesheet");

  document.querySelector("head").appendChild(linkMaterialFonts);

  let ceHeader = document.createElement("div");
  ceHeader.classList.add("ce-header");

  let ceWord = document.createElement("p");
  ceWord.classList.add("ce-word");
  ceWord.innerText = word;

  let ceHeaderIcons = document.createElement("div");
  ceHeaderIcons.classList.add("ce-header-icons");

  let saveIcon = document.createElement("i");
  saveIcon.innerText = "save";
  saveIcon.classList.add("material-icons");
  saveIcon.id = "save-icon";
  saveIcon.addEventListener("click", () => {
    chrome.storage.local.get("wordList", (result) => {
      console.log(result.wordList);
      let wordList = result.wordList;
      if (!wordList.includes(word)) wordList.push(word);
      chrome.storage.local.set({ wordList: wordList });
    });
  });

  let volumeIcon = document.createElement("i");
  volumeIcon.innerText = "volume_up";
  volumeIcon.classList.add("material-icons");
  volumeIcon.id = "volume-icon";
  volumeIcon.addEventListener("click", () => {
    console.log("Played the audio");
  });

  ceHeader.appendChild(ceWord);
  ceHeaderIcons.appendChild(saveIcon);
  ceHeaderIcons.appendChild(volumeIcon);
  ceHeader.appendChild(ceHeaderIcons);

  let ceBody = document.createElement("div");
  ceBody.classList.add("ce-body");

  let ceContainer = document.createElement("div");
  ceContainer.classList.add("ce-container");

  let ceCarousel = document.createElement("div");
  ceCarousel.classList.add("ce-carousel");

  let ceSlider = document.createElement("div");
  ceSlider.classList.add("ce-slider");

  for (meaning of meanings) {
    let section = document.createElement("section");
    let partOfSpeech = document.createElement("p");
    partOfSpeech.innerText = meaning.partOfSpeech;
    partOfSpeech.classList.add("ce-part-of-speech");
    let wordMeaning = document.createElement("p");
    wordMeaning.innerText = meaning.definitions[0].definition;
    wordMeaning.classList.add("ce-word-meaning");
    let wordExample = document.createElement("p");
    wordExample.innerText = meaning.definitions[0].example;
    wordExample.classList.add("ce-word-example");
    section.appendChild(partOfSpeech);
    section.appendChild(wordMeaning);
    section.appendChild(wordExample);

    ceSlider.appendChild(section);
  }

  ceBody.appendChild(ceContainer);
  ceContainer.appendChild(ceCarousel);
  ceSlider.style.width = `${meanings.length}00%`;
  ceCarousel.appendChild(ceSlider);

  let ceControl = document.createElement("div");
  ceControl.classList.add("ce-control");

  let arrowSpan = document.createElement("span");
  arrowSpan.classList.add("ce-arrow", "ce-left");
  let leftIcon = document.createElement("i");
  leftIcon.classList.add("material-icons");
  leftIcon.innerText = "keyboard_arrow_left";
  arrowSpan.appendChild(leftIcon);

  let arrowSpanB = document.createElement("span");
  arrowSpanB.classList.add("ce-arrow", "ce-right");
  let rightIcon = document.createElement("i");
  rightIcon.classList.add("material-icons");
  rightIcon.innerText = "keyboard_arrow_right";
  arrowSpanB.appendChild(rightIcon);

  ceControl.appendChild(arrowSpan);
  ceControl.appendChild(arrowSpanB);

  let indicatorList = document.createElement("ul");
  let selectedIndicator = document.createElement("li");
  selectedIndicator.classList.add("ce-selected");
  indicatorList.appendChild(selectedIndicator);
  for (let i = 1; i < meanings.length; i++) {
    let li = document.createElement("li");
    indicatorList.appendChild(li);
  }

  ceControl.appendChild(indicatorList);

  ceCarousel.appendChild(ceControl);

  ceModalContainer.appendChild(ceHeader);
  ceModalContainer.appendChild(ceBody);

  document.querySelector("html").appendChild(ceModal);

  let windowHeight = window.screen.availHeight;
  let windowWidth = window.screen.availWidth;
  if (windowWidth - event.clientX < ceModal.offsetWidth)
    ceModal.style.left = `${event.clientX - ceModal.offsetWidth}px`;
  else ceModal.style.left = `${event.clientX}px`;
  if (windowHeight - event.clientY < ceModal.offsetHeight)
    ceModal.style.top = `${event.clientY - ceModal.offsetHeight}px`;
  else ceModal.style.top = `${event.clientY}px`;
};

const getLoader = () => {
  let loader = document.createElement("div");
  loader.classList.add("ce-loading");
  return loader;
};
