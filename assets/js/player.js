class AudioControls {
  constructor(audioEl) {
    this.btnForward = document.getElementById("forward");
    this.btnBackward = document.getElementById("backward");
    this.btnShuffle = document.getElementById("shuffle");
    this.btnRepeat = document.getElementById("repeat");
    this.btnPlays = document.querySelectorAll(".btn_play");
    this.track = document.getElementById(audioEl);
    this.btnForward.addEventListener("click", (e) => this.forward());
    this.btnBackward.addEventListener("click", (e) => this.backward());
    this.btnRepeat.addEventListener("click", (e) => this.repeat());
    this.btnShuffle.addEventListener("click", (e) => this.shuffle());
    for (const btn of this.btnPlays) {
      btn.addEventListener("click", (e) => this.play(e));
    }
  }
  play(e) {
    //? console.log("play") : console.log("stop");

    if (!this.track.paused) {
      e.target.querySelector('[role="play"]').classList.add("d-none");
      e.target.querySelector('[role="play"]').classList.remove("d-block");
      e.target.querySelector('[role="pause"]').classList.add("d-block");
      e.target.querySelector('[role="pause"]').classList.remove("d-none");
      //icon.remove();

      this.track.pause();
    } else {
      e.target.querySelector('[role="pause"]').classList.add("d-none");
      e.target.querySelector('[role="pause"]').classList.remove("d-block");
      e.target.querySelector('[role="play"]').classList.add("d-block");
      e.target.querySelector('[role="play"]').classList.remove("d-none");

      /*
      e.target.querySelector('[role="img"]').remove();
      
      */
      this.track.play();
    }
  }
  backward() {
    console.log("avanti");
  }
  forward() {
    console.log("indietro");
  }
  shuffle() {
    console.log("a caso");
  }
  repeat() {
    console.log("ripeti");
  }
}
