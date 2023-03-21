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

    console.dir(this.volMax);
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

document.addEventListener("DOMContentLoaded", () => {
  let rangeElement = document.querySelector('.current-track__options__vol input[type="range"]');

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
});
