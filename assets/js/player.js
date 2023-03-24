class AudioControls {
  constructor(controlEL, audioEl) {
    this.rangeElement = rangeElement;

    this.rangeElement.addEventListener("input", (e) => this.updateSlider(e));
    this.rangeElement.addEventListener("wheel", (e) => this.mouseWheel(e));
    this.btn.addEventListener("click", (e) => this.mute());
    this.init();
  }
  init() {
    this.rangeElement.setAttribute("min", this.options.min);
    this.rangeElement.setAttribute("max", this.options.max);
    this.rangeElement.value = this.options.cur;
  }
}
