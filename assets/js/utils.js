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
    { code: "PIERLUIGI", txt: "Ciao pier" },
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
      "Content-Type": "application/json; charset=utf-8", //fetch imposta di default application/json ????
    },
    body,
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
