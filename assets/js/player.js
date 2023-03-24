class AudioControls {
  constructor(audioEl) {
    this.btnForward = document.getElementById("forward");
    this.btnBackward = document.getElementById("backward");
    this.btnShuffle = document.getElementById("shuffle");
    this.btnRepeat = document.getElementById("repeat");
    this.btnPlay = document.getElementById("play");
    this.track = document.getElementById(audioEl);

    this.btnForward.addEventListener("click", (e) => this.forward());
    this.btnBackward.addEventListener("click", (e) => this.backward());
    this.btnPlay.addEventListener("click", (e) => this.play());
    this.btnRepeat.addEventListener("click", (e) => this.repeat());
    this.btnShuffle.addEventListener("click", (e) => this.shuffle());
  }
  play() {
    //? console.log("play") : console.log("stop");
    if (!this.track.paused || this.track.currentTime) {
      console.log("pause");
      this.track.pause();
    } else {
      console.log("resume");
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
