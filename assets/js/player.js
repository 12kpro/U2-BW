class AudioControls {
  constructor(audioEl) {
    this.volumeSettings = {
      defaut: 20,
      min: 0,
      max: 100,
      beforeMute: 0
    };
    this.progressSettings = {
      defaut: 1,
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
    //this.setTrack();
  }
  setTrack(trakUrl) {
    if (this.track) {
      this.track.setAttribute("src", trakUrl); //change the source
      this.track.load();
    } else {
      //this.track = new Audio("https://cdns-preview-8.dzcdn.net/stream/c-8cfdb66060be261506956daf322d8a20-4.mp3");
      this.track = new Audio(trakUrl);
    }

    this.track.addEventListener("canplaythrough", (event) => {
      this.duration.innerHTML = this.formatTime(this.track.duration);
      this.track.volume = this.volume.value / 100;
      this.track.play();
      this.updatePlayerControlState();
    });
    this.track.addEventListener("ended", (event) => {
      console.log("finita");
    });
    this.track.addEventListener("timeupdate", (e) => {
      let percentage = this.track.currentTime / this.track.duration;
      this.progress.value = percentage * 100;
      this.updateRange(this.progress, percentage);
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
        this.btnRepeat.disabled = false;
        if (playlist) {
          this.btnForward.disabled = false;
          this.btnBackward.disabled = false;
          this.btnShuffle.disabled = false;
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
    for (const btn of this.btnPlays) {
      const use = btn.querySelector("use");
      this.track.paused ? use.setAttribute("href", "#pause") : use.setAttribute("href", "#play");
    }
    this.track.paused ? this.track.play() : this.track.pause();
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
    this.track.loop = this.track.loop ? false : true;
    console.log(this.track.loop);
  }
  muteToggle(e) {
    if (this.track.muted) {
      this.volume.disabled = false;
      this.track.muted = false;
      this.volume.value = this.volumeSettings.beforeMute;
      this.volumeSettings.beforeMute = 0;
    } else {
      this.volume.disabled = true;
      this.track.muted = true;
      this.volumeSettings.beforeMute = this.volume.value;
      this.volume.value = 0;
    }
    this.updateVolumeRange(this.volume);
  }

  volumeMouseWheel(e) {
    if (!e.target.disabled) {
      let rangeValue = parseInt(this.volume.value);
      if (e.deltaY < 0) {
        rangeValue += 1;
      } else {
        rangeValue -= 1;
      }
      this.volume.value = rangeValue;
      this.updateVolumeRange(e.target);
    }
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
      this.track.currentTime = percentage * this.track.duration;
    }
    this.updateRange(e.target, percentage);
  }

  percentageRange(el, settings) {
    if (el.value === this[settings].min) {
      return;
    }
    return (el.value - this[settings].min) / (this[settings].max - this[settings].min);
  }
  updateVolumeRange(el) {
    let percentage = this.percentageRange(el, "volumeSettings");
    if (this.track) {
      this.track.volume = percentage;
    }
    this.updateRange(el, percentage);

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
  formatTime(seconds) {
    let minutes = Math.floor(seconds / 60);
    let secs = Math.floor(seconds % 60);

    if (minutes < 10) {
      minutes = "0" + minutes;
    }

    if (secs < 10) {
      secs = "0" + secs;
    }

    return minutes + ":" + secs;
  }
}
