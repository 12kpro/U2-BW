class AudioControls {
  constructor(audioEl) {
    this.volumeSettings = {
      defaut: 20,
      min: 1,
      max: 100,
      mute: {
        set: false,
        value: 0
      }
    };
    this.progressSettings = {
      defaut: 0,
      min: 0,
      max: 100
    };
    this.btnForward = document.getElementById("forward");
    this.btnBackward = document.getElementById("backward");
    this.btnShuffle = document.getElementById("shuffle");
    this.btnRepeat = document.getElementById("repeat");
    this.btnPlays = document.querySelectorAll(".btn_play");
    this.volume = document.querySelector('.current-track__options__vol input[type="range"]');
    this.duration = document.querySelector(".current-track__progress__finish");
    this.progress = document.querySelector('.current-track__progress input[type="range"]');
    console.log(this.progress);
    this.btnVolume = this.volume.previousElementSibling;
    this.track;
    this.playList;
    //https://cdns-preview-8.dzcdn.net/stream/c-8cfdb66060be261506956daf322d8a20-4.mp3
    this.volume.value = this.volumeSettings.defaut;
    this.volume.setAttribute("min", this.volumeSettings.min);
    this.volume.setAttribute("max", this.volumeSettings.max);

    // Attach a listener to "change" event
    this.volume.addEventListener("input", (e) => this.updateVolumeRange(e.target));
    this.volume.addEventListener("wheel", (e) => this.volumeMouseWheel(e));

    this.progress.addEventListener("input", (e) => this.updateTrackProgress(e));
    this.progress.setAttribute("min", this.progressSettings.min);
    this.progress.setAttribute("max", this.progressSettings.max);

    this.btnVolume.addEventListener("click", (e) => this.muteToggle(e));

    this.btnForward.addEventListener("click", (e) => this.forward(e));
    this.btnBackward.addEventListener("click", (e) => this.backward(e));
    this.btnRepeat.addEventListener("click", (e) => this.repeat(e));
    this.btnShuffle.addEventListener("click", (e) => this.shuffle(e));

    for (const btn of this.btnPlays) {
      btn.addEventListener("click", (e) => this.playToggle(e));
    }
    this.updateVolumeRange(this.volume);
  }
  setTrack(trakUrl) {
    if (this.track) {
      this.track.setAttribute("src", trakUrl); //change the source
      this.track.load();
    } else {
      this.track = new Audio(trakUrl);
    }

    this.updatePlayerControlState();
    this.track.addEventListener("canplaythrough", (event) => {
      this.progressSettings.max = this.track.duration;
      this.track.play();
    });
    this.track.addEventListener("ended", (event) => {
      console.log("finita");
    });
    this.track.addEventListener("timeupdate", (e) => {
      //const { duration, currentTime } = e.srcElement;
      //console.log(duration, currentTime);
    });
  }
  async setPlaylist(url) {
    this.playList = await resp(url);
  }

  updatePlayerControlState(playlist = false, ended = false) {
    if (typeof playlist == "boolean" && typeof ended == "boolean") {
      if (!ended) {
        for (const btn of this.btnPlays) {
          btn.disabled = false;
        }
        this.btnPlays.disabled = false;
        this.volume.disabled = false;
        this.btnVolume.disabled = false;
        this.progress.disabled = false;
        if (playlist) {
          this.btnForward.disabled = false;
          this.btnBackward.disabled = false;
          this.btnShuffle.disabled = false;
          this.btnRepeat.disabled = false;
        }
      } else {
        for (const btn of this.btnPlays) {
          btn.disabled = true;
        }
        this.btnPlays.disabled = true;
        this.btnForward.disabled = true;
        this.btnBackward.disabled = true;
        this.btnShuffle.disabled = true;
        this.btnRepeat.disabled = true;
        this.progress.disabled = true;
        this.volume.disabled = true;
        this.btnVolume.disabled = true;
      }
    }
  }
  playToggle(e) {
    console.log("play");
    const use = e.target.querySelector("use");
    use.setAttribute("href", "#pause");
    if (!this.track.paused) {
      use.setAttribute("href", "#pause");
      this.track.pause();
    } else {
      use.setAttribute("href", "#play");
      this.track.play();
    }
  }
  backward(e) {
    console.log("avanti");
  }
  forward(e) {
    console.log("indietro");
  }
  shuffle(e) {
    e.target.classList.toggle("active");
    e.target.classList.toggle("text-success");
  }
  repeat(e) {
    e.target.classList.toggle("active");
    e.target.classList.toggle("text-success");
  }
  muteToggle(e) {
    if (this.volumeSettings.mute.set) {
      this.volumeSettings.mute.set = false;
      this.track.muted = false;
      this.volumeSettings.mute.value = 0;
      this.volume.value = this.volumeSettings.mute.set;
    } else {
      this.volumeSettings.mute.set = true;
      this.track.muted = true;
      this.volumeSettings.mute.value = this.volume.value;
      this.volume.value = 0;
    }
    this.updateVolumeRange(this.volume);
  }

  volumeMouseWheel(e) {
    let rangeValue = parseInt(this.volume.value);
    if (e.deltaY < 0) {
      rangeValue += 1;
    } else {
      rangeValue -= 1;
    }
    this.volume.value = rangeValue;
    this.updateVolumeRange();
  }

  updateRange(el, percent) {
    el.style.setProperty(
      "--bg-range",
      `linear-gradient(to right, var(--bs-light), var(--bs-light) ${percent * 100}%, var(--bs-progress) ${
        percent * 100
      }%, var(--bs-progress) 100%)`
    );
    el.style.setProperty(
      "--bg-range-hover",
      `linear-gradient(to right, var(--bs-success), var(--bs-success) ${percent * 100}%, var(--bs-progress) ${
        percent * 100
      }%, var(--bs-progress) 100%)`
    );
  }

  updateTrackProgress(e) {
    let percentage = this.percentageRange(e.target, "progressSettings");
    if (this.track) {
      this.track.pause();
      this.track.currentTime = e.target.value;
      this.track.play();
    }
    console.log(e.target.value);
    this.updateRange(e.target, percentage);
  }

  percentageRange(el, settings) {
    if (el.value === this[settings].min) {
      return;
    }
    return (el.value - this[settings].min) / (this[settings].max - this[settings].min);
  }
  /*volumePercentage(el) {
    if (this.volume.value === this.volumeSettings.min) {
      return;
    }
    return (this.volume.value - this.volumeSettings.min) / (this.volumeSettings.max - this.volumeSettings.min);
  }*/
  updateVolumeRange(el) {
    let percentage = this.percentageRange(el, "volumeSettings");
    if (this.track) {
      this.track.volume = percentage;
    }
    console.log(percentage);
    this.updateRange(el, percentage);
    //let btn = this.volume.previousElementSibling;
    /*e.target.style.setProperty(
      "--bg-range",
      `linear-gradient(to right, var(--bs-light), var(--bs-light) ${percentage * 100}%, var(--bs-progress) ${
        percentage * 100
      }%, var(--bs-progress) 100%)`
    );
    e.target.style.setProperty(
      "--bg-range-hover",
      `linear-gradient(to right, var(--bs-success), var(--bs-success) ${percentage * 100}%, var(--bs-progress) ${
        percentage * 100
      }%, var(--bs-progress) 100%)`
    );
*/
    const use = this.btnVolume.querySelector("use");
    if (percentage >= 0.6 && this.btnVolume.dataset.vol !== "max") {
      use.setAttribute("href", "#vol-max");
      this.btnVolume.dataset.vol = "max";
    } else if (percentage < 0.6 && percentage >= 0.3 && this.btnVolume.dataset.vol !== "mid") {
      use.setAttribute("href", "#vol-mid");
      this.btnVolume.dataset.vol = "mid";
    } else if (percentage < 0.3 && percentage >= 0.1 && this.btnVolume.dataset.vol !== "low") {
      use.setAttribute("href", "#vol-low");
      this.btnVolume.dataset.vol = "low";
    } else if (percentage < 0.1 && this.btnVolume.dataset.vol !== "muted") {
      use.setAttribute("href", "#vol-muted");
      this.btnVolume.dataset.vol = "muted";
    }
  }
}

/*
class Slider {
  constructor(rangeElement, options) {
    this.rangeElement = rangeElement;
    this.options = options;
    this.mute = {
      set: false,
      value: 0
    };
    this.btn = this.rangeElement.previousElementSibling;

    // Attach a listener to "change" event
    this.rangeElement.addEventListener("input", (e) => this.updateSlider(e));
    this.rangeElement.addEventListener("wheel", (e) => this.mouseWheel(e));
    this.btn.addEventListener("click", (e) => this.muteToggle());
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
  muteToggle() {
    if (this.mute.set) {
      this.mute.set = false;
      this.mute.value = 0;
      this.rangeElement.value = this.mute.set;
    } else {
      this.mute.set = true;
      this.mute.value = this.rangeElement.value;
      this.rangeElement.value = 0;
    }
    this.updateSlider();
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

    const use = btn.querySelector("use");
    if (percentage >= 60 && btn.dataset.vol !== "max") {
      use.setAttribute("href", "#vol-max");
      btn.dataset.vol = "max";
    } else if (percentage < 60 && percentage >= 30 && btn.dataset.vol !== "mid") {
      use.setAttribute("href", "#vol-mid");
      btn.dataset.vol = "mid";
    } else if (percentage < 30 && percentage >= 10 && btn.dataset.vol !== "low") {
      use.setAttribute("href", "#vol-low");
      btn.dataset.vol = "low";
    } else if (percentage < 10 && btn.dataset.vol !== "muted") {
      use.setAttribute("href", "#vol-muted");
      btn.dataset.vol = "muted";
    }
  }
}
*/
