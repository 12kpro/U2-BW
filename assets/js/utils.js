const BASE_URL = "https://striveschool-api.herokuapp.com/api/deezer/";
//const AUHT_KEY =  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NDEzYjZhZGM1NmIzNjAwMTMzZmU1NzAiLCJpYXQiOjE2NzkwMTM1NDksImV4cCI6MTY4MDIyMzE0OX0.gh0JCLPZVXRqvfKOawV7S1-YNSH44zJ48CyW3Vv0mkc";

// classe per gestione messaggi custom
class CustomMsg {
  static messages = [
    { code: "GET", txt: "retrived" },
    { code: "POST", txt: "created" },
    { code: "PUT", txt: "updated" },
    { code: "DELETE", txt: "deleted" },
    { code: "EMPTY", txt: "no data retrived" },
    { code: "PIERLUIGI", txt: "Ciao pier" }
  ];
  static getTxt(code) {
    const msg = this.messages.find((item) => item.code === code);
    return msg.txt;
  }
}

// Estensione classe error per gestione messaggi alternativa
class ServerError extends Error {
  constructor(id, status, statusMsg) {
    super();
    this.id = id;
    this.status = status;
    this.statusMsg = statusMsg;
  }
}

// gestisco aggiunta informazini alert in sessionstorage
const storageAddMsg = (id, apearence, title, txt) => {
  const storedMsgs = sessionStorage.getItem("msgs");
  const msgArray = storedMsgs ? JSON.parse(storedMsgs) : [];
  const msg = { id, apearence, title, txt };
  msgArray.push(msg);
  sessionStorage.setItem("msgs", JSON.stringify(msgArray));
};
// gestisco la rimozione informazini alert in sessionstorage
const storageRemoveMsg = (id) => {
  const msgArray = JSON.parse(sessionStorage.getItem("msgs"));
  const result = msgArray.filter((msg) => msg.id != id); //  != msg.id è un numero, id una stringa (html dataset)
  sessionStorage.setItem("msgs", JSON.stringify(result));
};

//gestisco fetch verso server
const resp = async (url, method, body) => {
  const fetchId = Date.now();
  const params = {
    method,
    headers: {
      //      Authorization: AUHT_KEY,
      "Content-Type": "application/json; charset=utf-8" //fetch imposta di default application/json ????
    },
    body
  };
  try {
    const response = await fetch(url, params);

    if (response.ok) {
      //se la risposta è ok restituisco i dati
      const data = await response.json();
      if (!data) throw new ServerError(fetchId, "200", `Warning ${CustomMsg.getTxt("PIERLUIGI")}`); //api ritorna un array vuoto(null) con status 200
      return data;
    }
    throw new ServerError(fetchId, response.status, response.statusText); // altrimenti genero un errore
  } catch (error) {
    console.log(error.id, error.status, error.statusMsg);
    return [];
  } finally {
    const loaders = document.querySelectorAll(".loader");
    for (const loader of loaders) {
      loader.classList.add("d-none");
    }
  }
};

class Slider {
  constructor(rangeElement, options) {
    this.rangeElement = rangeElement;
    this.options = options;
    this.btn = this.rangeElement.previousElementSibling;
    this.volMuted =
      '<svg role="presentation" height="16" width="16" aria-hidden="true" aria-label="Volume disattivato" id="volume-icon" viewBox="0 0 16 16" data-encore-id="icon" class="Svg-sc-ytk21e-0 uPxdw"><path d="M13.86 5.47a.75.75 0 0 0-1.061 0l-1.47 1.47-1.47-1.47A.75.75 0 0 0 8.8 6.53L10.269 8l-1.47 1.47a.75.75 0 1 0 1.06 1.06l1.47-1.47 1.47 1.47a.75.75 0 0 0 1.06-1.06L12.39 8l1.47-1.47a.75.75 0 0 0 0-1.06z"></path><path d="M10.116 1.5A.75.75 0 0 0 8.991.85l-6.925 4a3.642 3.642 0 0 0-1.33 4.967 3.639 3.639 0 0 0 1.33 1.332l6.925 4a.75.75 0 0 0 1.125-.649v-1.906a4.73 4.73 0 0 1-1.5-.694v1.3L2.817 9.852a2.141 2.141 0 0 1-.781-2.92c.187-.324.456-.594.78-.782l5.8-3.35v1.3c.45-.313.956-.55 1.5-.694V1.5z"></path></svg>';
    this.volLow =
      '<svg role="presentation" height="16" width="16" aria-hidden="true" aria-label="Volume basso" id="volume-icon" viewBox="0 0 16 16" data-encore-id="icon" class="Svg-sc-ytk21e-0 uPxdw"><path d="M9.741.85a.75.75 0 0 1 .375.65v13a.75.75 0 0 1-1.125.65l-6.925-4a3.642 3.642 0 0 1-1.33-4.967 3.639 3.639 0 0 1 1.33-1.332l6.925-4a.75.75 0 0 1 .75 0zm-6.924 5.3a2.139 2.139 0 0 0 0 3.7l5.8 3.35V2.8l-5.8 3.35zm8.683 4.29V5.56a2.75 2.75 0 0 1 0 4.88z"></path></svg>';
    this.volMid =
      '<svg role="presentation" height="16" width="16" aria-hidden="true" aria-label="Volume medio" id="volume-icon" viewBox="0 0 16 16" data-encore-id="icon" class="Svg-sc-ytk21e-0 uPxdw"><path d="M9.741.85a.75.75 0 0 1 .375.65v13a.75.75 0 0 1-1.125.65l-6.925-4a3.642 3.642 0 0 1-1.33-4.967 3.639 3.639 0 0 1 1.33-1.332l6.925-4a.75.75 0 0 1 .75 0zm-6.924 5.3a2.139 2.139 0 0 0 0 3.7l5.8 3.35V2.8l-5.8 3.35zm8.683 6.087a4.502 4.502 0 0 0 0-8.474v1.65a2.999 2.999 0 0 1 0 5.175v1.649z"></path></svg>';
    this.volMax =
      '<svg role="presentation" height="16" width="16" aria-hidden="true" aria-label="Volume alto" id="volume-icon" viewBox="0 0 16 16" data-encore-id="icon" class="Svg-sc-ytk21e-0 uPxdw"><path d="M9.741.85a.75.75 0 0 1 .375.65v13a.75.75 0 0 1-1.125.65l-6.925-4a3.642 3.642 0 0 1-1.33-4.967 3.639 3.639 0 0 1 1.33-1.332l6.925-4a.75.75 0 0 1 .75 0zm-6.924 5.3a2.139 2.139 0 0 0 0 3.7l5.8 3.35V2.8l-5.8 3.35zm8.683 4.29V5.56a2.75 2.75 0 0 1 0 4.88z"></path><path d="M11.5 13.614a5.752 5.752 0 0 0 0-11.228v1.55a4.252 4.252 0 0 1 0 8.127v1.55z"></path></svg>';
    // Attach a listener to "change" event
    this.rangeElement.addEventListener("input", (e) => this.updateSlider(e));
    this.rangeElement.addEventListener("wheel", (e) => this.mouseWheel(e));
    this.btn.addEventListener("click", (e) => this.mute());
    this.init();
  }

  // Initialize the slider
  init() {
    this.rangeElement.setAttribute("min", this.options.min);
    this.rangeElement.setAttribute("max", this.options.max);
    this.rangeElement.value = this.options.cur;

    this.updateSlider();
  }

  generateBackground() {
    if (this.rangeElement.value === this.options.min) {
      return;
    }

    return ((this.rangeElement.value - this.options.min) / (this.options.max - this.options.min)) * 100;
  }
  mute() {
    this.rangeElement.value = 0;
    this.updateSlider();
    //funzione per ripristinare volume
  }
  mouseWheel(e) {
    let rangeValue = parseInt(this.rangeElement.value);
    if (e.deltaY < 0) {
      rangeValue += 1;
    } else {
      rangeValue -= 1;
    }
    this.rangeElement.value = rangeValue;
    this.updateSlider();
  }
  updateSlider(e) {
    let percentage = this.generateBackground(this.rangeElement.value);
    let btn = this.rangeElement.previousElementSibling;
    this.rangeElement.style.setProperty(
      "--bg-range",
      `linear-gradient(to right, var(--bs-light), var(--bs-light) ${percentage}%, var(--bs-progress) ${percentage}%, var(--bs-progress) 100%)`
    );
    this.rangeElement.style.setProperty(
      "--bg-range-hover",
      `linear-gradient(to right, var(--bs-success), var(--bs-success) ${percentage}%, var(--bs-progress) ${percentage}%, var(--bs-progress) 100%)`
    );
    //

    //console.dir(this.volMax);
    if (percentage >= 60 && btn.dataset.vol !== "max") {
      btn.innerHtml = " ciao "; //this.volMax;
      btn.dataset.vol = "max";
    } else if (percentage < 60 && percentage >= 30 && btn.dataset.vol !== "mid") {
      btn.innerHtml = this.volMid;
      btn.dataset.vol = "mid";
    } else if (percentage < 30 && percentage >= 10 && btn.dataset.vol !== "low") {
      btn.innerHtml = this.volLow;
      btn.dataset.vol = "low";
    } else if (percentage < 10 && btn.dataset.vol !== "muted") {
      btn.innerHtml = this.volMuted;
      btn.dataset.vol = "muted";
    }
  }
}

const volumeBarInit = (el) => {
  let rangeElement = document.querySelector(el);

  let options = {
    min: 1,
    max: 100,
    cur: 50 //prelevare da localstorage???
  };

  if (rangeElement) {
    let slider = new Slider(rangeElement, options);

    //slider.init();
  }

  document.getElementById("shuffle").addEventListener("click", (e) => {
    e.target.classList.toggle("active");
    e.target.classList.toggle("text-success");
  });
  document.getElementById("repeat").addEventListener("click", (e) => {
    e.target.classList.toggle("active");
    e.target.classList.toggle("text-success");
  });
};

const randomImg = (imgs) => {
  const rand = Math.floor(Math.random() * imgs.length);
  return imgs[rand];
};

const randomContent = async (artists, type, qty) => {
  let list = [];
  for (const artist of artists) {
    const url = `${BASE_URL}search?q=${artist}`;
    let results = await resp(url);
    list = list.concat(results.data);
  }

  let album = [];
  let artist = [];

  for (const item of list) {
    album.push(item.album);
    artist.push(item.artist);
  }

  //rimuove duplicati
  album = [...new Map(album.map((v) => [v.id, v])).values()];
  artist = [...new Map(artist.map((v) => [v.id, v])).values()];

  let content = [];
  for (let i = 0; i < qty; i++) {
    if (type === "album") {
      const rand = Math.floor(Math.random() * album.length);
      content.push(album[rand]);
    } else if (type === "artists") {
      const rand = Math.floor(Math.random() * artist.length);
      content.push(artist[rand]);
    }
  }
  return content;
};

const toHHMMSS = (duration) => {
  var seconds = parseInt(duration, 10);
  var hours = Math.floor(seconds / 3600);
  var minutes = Math.floor((seconds - hours * 3600) / 60);
  seconds = seconds - hours * 3600 - minutes * 60;

  if (hours > 0) {
    hours = hours < 10 ? hours.toString().padStart(2, "0") : hour;
    hours = `${hours} hour, `;
  }
  if (minutes > 0) {
    minutes = minutes < 10 ? minutes.toString().padStart(2, "0") : minutes;
    minutes = `${minutes} min, `;
  }
  if (seconds > 0) {
    seconds = seconds < 10 ? seconds.toString().padStart(2, "0") : seconds;
    seconds = `${seconds} sec,`;
  }
  return `${hours}${minutes}${seconds}`;
};

const toHHMM = (duration) => {
  var seconds = parseInt(duration, 10);
  var hours = Math.floor(seconds / 3600);
  var minutes = Math.floor((seconds - hours * 3600) / 60);
  seconds = seconds - hours * 3600 - minutes * 60;

  if (minutes > 0) {
    minutes = minutes < 10 ? minutes.toString().padStart(2, "0") : minutes;
  }
  if (seconds > 0) {
    seconds = seconds < 10 ? seconds.toString().padStart(2, "0") : seconds;
  }
  return `${minutes}:${seconds}`;
};

const buildSection = async (title, artistList, cardType, qty) => {
  const mainCnt = document.getElementById("randomSection");
  const newTemplate = document.createElement("template");
  newTemplate.innerHTML = `
  <div class="row">
  <div class="col-12">
    <h2 class="section_title mb-4">${title}</h2>
  </div>
  </div>
  <div class="section_container row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 gx-4 gy-3 mb-4">
  </div>
  `;
  const newSection = newTemplate.content.querySelector(".section_container");

  if (cardType === "album") {
    for (const album of await randomContent(artistList, cardType, qty)) {
      newSection.append(cardTpl(album.id, "album", album.cover, album.title, ""));
    }
  } else if (cardType === "artists") {
    for (const artist of await randomContent(artistList, cardType, qty)) {
      newSection.append(cardTpl(artist.id, "artists", artist.picture, artist.name, ""));
    }
  }

  mainCnt.append(newTemplate.content);
};

const cardTpl = (id, page, img, title, txt, play = false) => {
  const cardTemplate = document.createElement("template");
  const cardCnt = `
        <div class="col">
          <div class="card border-0 text-light">
                <div class="p-3 pb-1 rounded-3 position-relative">
                  <img src="${img}" class="card-img img-fluid"  alt="pic">
                    <button class="${
                      play ? "d-block" : "d-none"
                    } card-play-btn position-absolute border-0 bg-success text-black rounded-circle d-flex justify-content-center align-items-center p-3" data-track="${play}">
                      <svg role="img" height="25" width="25" aria-hidden="true" viewBox="0 0 16 16" data-encore-id="icon">
                        <path d="M3 1.713a.7.7 0 0 1 1.05-.607l10.89 6.288a.7.7 0 0 1 0 1.212L4.05 14.894A.7.7 0 0 1 3 14.288V1.713z"></path>
                      </svg>
                    </button>
                </div>
                <div class="card-body px-3">
                <a href="./${page}.html?id=${id}" class="text-decoration-none stretched-link"><h5 class="card-title fs-6 text-truncate">${title}</h5></a>
                  <p class="card-text text-secondary small text-truncate">${txt}</p>
                </div>
          </div>
        </div>
        `;
  cardTemplate.innerHTML = cardCnt;
  cardTemplate.content.querySelector(".card-play-btn").addEventListener("click", (e) => {
    let audio = document.getElementById("audio_track");
    audio.src = e.target.dataset.track;
    audio.play();
  });
  return cardTemplate.content;
};

const heroTpl = (id, img, artist) => `
<div class="row my-4">
<div class="col-12">
  <div class="hero d-flex justify-content-center justify-content-md-start px-4 py-3 bg-black bg-opacity-75">
    <div class="flex-shrink-0 p-4">
      <img class="img-fluid" src="${img}">
    </div>
    <div class="d-none d-md-flex flex-column ms-3 justify-content-end">
      <h6 class="card-title fw-bold text-truncate">ALBUM</h6>
      <h1 class="text-light fs-1 fw-bold  d-1 text-truncate">${artist}</h1>
      <div class="d-flex gap-2">
        <a class="btn btn-success px-4 py-2 rounded-pill fw-bold" href="./artists?id=${id}">Vedi</a>
      </div>
    </div>
  </div>
</div>
</div>
`;
const trackTpl = (num, img, title, rank, duration, filepath) => `
<div class=" track_play row my-2 riga rounded my-4 align-items-center" data-filepath="${filepath}">
<div class="col-6 d-flex flex-wrap align-items-center p-0">
        <div class=" position-relative d-none d-md-block">
          <span class="btn-custom numero position-absolute">${num}</span>
          <button class="btn-custom bg-transparent border-0">
            <svg
              role="img"
              height="16"
              width="16"
              opacity="0"
              aria-hidden="true"
              viewBox="0 0 16 16"
              data-encore-id="icon"
            >
              <path
                d="M3 1.713a.7.7 0 0 1 1.05-.607l10.89 6.288a.7.7 0 0 1 0 1.212L4.05 14.894A.7.7 0 0 1 3 14.288V1.713z"
              ></path>
            </svg>
          </button>
        </div>

  <div class="d-flex flex-row align-items-center p-0">
    <div class="me-2"><img class="imgBrano" src="${img}"/></div>
    <span class="fs-6"><a class="text-secondary link-light text-truncate fs-6">${title}</a></span>
  </div>
</div>
<div class="d-none d-md-block offset-md-1 col-2">${rank}</div>
<div class="col-4 col-md-1">
  <button class="d-none d-md-block bg-transparent border-0">
    <svg
      role="img"
      height="20"
      width="20"
      aria-hidden="true"
      viewBox="0 0 24 24"
      data-encore-id="icon"
      class="Svg-sc-ytk21e-0 uPxdw"
    >
      <path
        d="M5.21 1.57a6.757 6.757 0 0 1 6.708 1.545.124.124 0 0 0 .165 0 6.741 6.741 0 0 1 5.715-1.78l.004.001a6.802 6.802 0 0 1 5.571 5.376v.003a6.689 6.689 0 0 1-1.49 5.655l-7.954 9.48a2.518 2.518 0 0 1-3.857 0L2.12 12.37A6.683 6.683 0 0 1 .627 6.714 6.757 6.757 0 0 1 5.21 1.57zm3.12 1.803a4.757 4.757 0 0 0-5.74 3.725l-.001.002a4.684 4.684 0 0 0 1.049 3.969l.009.01 7.958 9.485a.518.518 0 0 0 .79 0l7.968-9.495a4.688 4.688 0 0 0 1.049-3.965 4.803 4.803 0 0 0-3.931-3.794 4.74 4.74 0 0 0-4.023 1.256l-.008.008a2.123 2.123 0 0 1-2.9 0l-.007-.007a4.757 4.757 0 0 0-2.214-1.194z"
      ></path>
    </svg>
  </button>
  <button class="bg-transparent border-0 d-md-none">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="currentColor"
      class="bi bi-three-dots-vertical"
      viewBox="0 0 16 16"
    >
      <path
        d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"
      />
    </svg>
  </button>
</div>
<div class="d-none d-md-block col-1">${duration}</div>
<div class="col-1">
  <button class="d-none d-md-block bg-transparent border-0">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="currentColor"
      class="bi bi-three-dots"
      viewBox="0 0 16 16"
    >
      <path
        d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"
      />
    </svg>
  </button>
</div>
</div>
`;

const trackAlbumTpl = (num, title, artist, duration, filepath) => `
<div class="track_play row d-flex align-items-center py-2 riga" data-filepath="${filepath}">
<div class="col-4 d-flex flex-row align-items-center">
  <div class="position-relative d-none d-md-block">
    <span class="btn-custom numero position-absolute">${num}</span>
    <button class="btn-custom bg-transparent border-0">
      <svg
        role="img"
        height="16"
        width="16"
        opacity="0"
        aria-hidden="true"
        viewBox="0 0 16 16"
        data-encore-id="icon"
      >
        <path
          d="M3 1.713a.7.7 0 0 1 1.05-.607l10.89 6.288a.7.7 0 0 1 0 1.212L4.05 14.894A.7.7 0 0 1 3 14.288V1.713z"
        ></path>
      </svg>
    </button>
  </div>

  <div class="px-5">
    <div>${title}</div>
    <a href="#">${artist}</a>
  </div>
</div>
<div class="d-none d-md-block col-1 offset-5">
  <button class="cuore bg-transparent border-0">
    <svg
      role="img"
      height="32"
      width="32"
      opacity="0"
      aria-hidden="true"
      viewBox="0 0 24 24"
      data-encore-id="icon"
      class="Svg-sc-ytk21e-0 uPxdw w-50"
    >
      <path
        d="M5.21 1.57a6.757 6.757 0 0 1 6.708 1.545.124.124 0 0 0 .165 0 6.741 6.741 0 0 1 5.715-1.78l.004.001a6.802 6.802 0 0 1 5.571 5.376v.003a6.689 6.689 0 0 1-1.49 5.655l-7.954 9.48a2.518 2.518 0 0 1-3.857 0L2.12 12.37A6.683 6.683 0 0 1 .627 6.714 6.757 6.757 0 0 1 5.21 1.57zm3.12 1.803a4.757 4.757 0 0 0-5.74 3.725l-.001.002a4.684 4.684 0 0 0 1.049 3.969l.009.01 7.958 9.485a.518.518 0 0 0 .79 0l7.968-9.495a4.688 4.688 0 0 0 1.049-3.965 4.803 4.803 0 0 0-3.931-3.794 4.74 4.74 0 0 0-4.023 1.256l-.008.008a2.123 2.123 0 0 1-2.9 0l-.007-.007a4.757 4.757 0 0 0-2.214-1.194z"
      ></path>
    </svg>
  </button>
</div>
<div class="d-none d-md-block col-1">${duration}</div>
<div class="col-1">
  <button class="d-none d-md-block bg-transparent border-0 d-flex align-items-center">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      opacity="0"
      fill="white"
      class="bi bi-three-dots"
      viewBox="0 0 16 16"
    >
      <path
        d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"
      />
    </svg>
  </button>
  <button
    class="d-flex justify-content-end bg-transparent border-0 d-flex align-items-center d-md-none"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="white"
      class="bi bi-three-dots-vertical"
      viewBox="0 0 16 16"
    >
      <path
        d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"
      />
    </svg>
  </button>
</div>
</div>
`;

const mainImg = [
  "main/image-11.jpg",
  "main/image-1.jpg",
  "main/image-13.jpg",
  "main/image-15.jpg",
  "main/image-17.jpg",
  "main/image-19.jpg",
  "main/image-3.jpg",
  "main/image-5.jpg ",
  "main/image-7.jpg",
  "main/image-9.jpg",
  "main/image-10.jpg",
  "main/image-12.jpg",
  "main/image-14.jpg",
  "main/image-16.jpg",
  "main/image-18.jpg",
  "main/image-2.jpg",
  "main/image-4.jpg",
  "main/image-6.jpg",
  "main/image-8.jpg"
];

const searchImg = [
  "search/image-1.jpeg",
  "search/image-13.jpeg",
  "search/image-17.jpg",
  "search/image-20.jpg",
  "search/image-24.jpg",
  "search/image-28.jpg",
  "search/image-31.jpg",
  "search/image-35.jpg",
  "search/image-39.jpg",
  "search/image-42.png",
  "search/image-46.jpeg",
  "search/image-5.jpg",
  "search/image-6.jpg",
  "search/image-10.jpg",
  "search/image-14.jpg",
  "search/image-18.jpg",
  "search/image-21.jpg",
  "search/image-25.jpeg",
  "search/image-29.jpg",
  "search/image-32.jpg",
  "search/image-36.jpg",
  "search/image-4.jpg",
  "search/image-43.png",
  "search/image-47.jpg",
  "search/image-50.jpg",
  "search/image-7.jpg",
  "search/image-11.jpg",
  "search/image-15.jpg",
  "search/image-19.jpg",
  "search/image-22.jpg",
  "search/image-26.jpg",
  "search/image-3.jpg",
  "search/image-33.jpg",
  "search/image-37.jpeg",
  "search/image-40.jpg",
  "search/image-44.png",
  "search/image-48.jpeg",
  "search/image-51.jpg",
  "search/image-8.jpg",
  "search/image-12.jpg",
  "search/image-16.jpg",
  "search/image-2.jpg",
  "search/image-23.jpg",
  "search/image-27.jpg",
  "search/image-30.jpg",
  "search/image-34.jpg",
  "search/image-38.jpg",
  "search/image-41.jpg",
  "search/image-45.png",
  "search/image-49.jpg",
  "search/image-52.jpg",
  "search/image-9.jpg"
];
