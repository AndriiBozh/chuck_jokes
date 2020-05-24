let toDeleteOrNot = 1;

function setToDeleteOrNot() {
  toDeleteOrNot = 1;
}

function resetToDeleteOrNot() {
  toDeleteOrNot = 0;
}

function getValue() {
  let search_word = event.srcElement.value;
  let url = "https://api.chucknorris.io/jokes/random";
  if (search_word !== "random") {
    url = `https://api.chucknorris.io/jokes/random?category=${search_word}`;
  }

  fetch(url)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      let hours = getHours(data.updated_at);
      let cont = document.getElementById("main_content");
      cont.innerHTML = displayJoke(data, hours, search_word);
    });
}

function handleSubmit(e) {
  e.preventDefault();
  search_word = document.getElementById("input_word").value;
  url = `https://api.chucknorris.io/jokes/search?query=${search_word}`;

  fetch(url)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      let random_num = Math.floor(Math.random() * data.result.length);
      let random_elem = data.result[random_num];
      let cont = document.getElementById("main_content");
      if (random_elem === undefined) {
        let notFoundContainer = document.getElementById("word_not_found");
        notFoundContainer.innerHTML = `<div><h2>Sorry, "${search_word}" not found!</h2><div id="close_mark" onclick="removeNotFoundContainer()">X</div></div>`;
        showNotFoundCountainer();
      }
      if (random_elem !== undefined) {
        let hours = getHours(random_elem.updated_at);
        cont.innerHTML = displayJoke(random_elem, hours, search_word);
        showJokesContainer();
      }
    });

  document.getElementById("input_word").value = ""; //clear input field
}

function displayJoke(el, updated, searchWord) {
  return `<div class="description">
  <p class="link" id="${el.url}"><span>ID:</span> <a href=${
    el.url
  } target="_blank">${el.id}</a> <i class="fas fa-external-link-alt"></i></p>
  <p class="joke">${el.value}</p>
  <div class="details">
  <p class="last_update">last update: ${updated} hours ago</p>
  <p class="category">${searchWord.toUpperCase()}</p>
  </div>
</div>`;
}

function getHours(time) {
  let sec = Date.parse(time);
  let sec_now = Date.now();
  let sec_elapsed = sec_now - sec;
  let hours = Math.floor(sec_elapsed / 3600000);
  return hours;
}

document.getElementById("heart").addEventListener("click", () => {
  toggleHeartColor();

  let id = getId();

  if (toDeleteOrNot === 1) {
    removeNotFoundContainer();
    addFavorites(id);
    resetToDeleteOrNot();
  }

  if (heart.classList.contains("far")) {
    removeFromFavorites(id);
    setToDeleteOrNot();
  }
});

document.getElementById("submit_form").addEventListener("submit", (e) => {
  decolorHeart();
  setToDeleteOrNot();
  handleSubmit(e);
  removeNotFoundContainer();
});

function showJokesContainer() {
  let cont = document.getElementById("original");
  cont.classList.add("show_jokes_container");
}

function hideJokesContainer() {
  let cont = document.getElementById("original");
  cont.classList.remove("show_jokes_container");
}

function toggleHeartColor() {
  let heart = document.getElementById("heart");
  if (heart.classList.contains("far")) {
    heart.classList.remove("far");
    heart.classList.add("fas");
  } else if (heart.classList.contains("fas")) {
    heart.classList.remove("fas");
    heart.classList.add("far");
  }
}

function decolorHeart() {
  let heart = document.getElementById("heart");
  heart.classList.remove("fas");
  heart.classList.add("far");
}

//event delegation
document
  .getElementById("favorite_jokes")
  .addEventListener("click", function (e) {
    //e.target is the element which is clicked on
    if (e.target && e.target.id === "heart") {
      let elToRemove = document.getElementById(
        `${e.target.parentNode.parentNode.id}`
      );
      elToRemove.parentNode.removeChild(elToRemove);
      decolorHeart();
      setToDeleteOrNot();
    }
  });

let buttons = document.getElementsByClassName("select_category_button");
for (let el of buttons) {
  el.addEventListener("click", () => {
    decolorHeart();
    setToDeleteOrNot();
    showJokesContainer();
    removeNotFoundContainer();
  });
}

function getId() {
  let el = document.getElementById("original");
  let spl = el.innerText.split(" ");
  let id = spl[1];
  return id;
}

function addFavorites(id) {
  let el = document.getElementById("original");
  let favoriteJokesContainer = document.getElementById("favorite_jokes");
  let favJoke = el.cloneNode(true);
  favJoke.id = id;
  favoriteJokesContainer.appendChild(favJoke);
}

function removeFromFavorites(elemId) {
  let elem = document.getElementById(elemId);
  elem.parentNode.removeChild(elem);
}

function showNotFoundCountainer() {
  let notFoundContainer = document.getElementById("not_found");
  notFoundContainer.classList.add("show_not_found_container");
}

function removeNotFoundContainer() {
  let notFoundContainer = document.getElementById("not_found");
  notFoundContainer.classList.remove("show_not_found_container");
}

function addQuoteAndHeartIcons() {
  let quoteAndHeartContainer = document.getElementById("icons_container");
  quoteAndHeartContainer.classList.add("show_quote_and_heart_container");
}
