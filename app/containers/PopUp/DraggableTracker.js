/* eslint-disable no-return-assign */
class DraggableTracker {
  constructor(frameEl, layerEl) {
    Object.assign(this, {
      frameEl,
      layerEl,
      startPos: [0, 0],
      track: this.track.bind(this),
      move: this.move.bind(this),
      stop: this.stop.bind(this),
      callbacks: [],
    });
  }

  track(event, callback) {
    window.addEventListener('mousemove', this.move);
    window.addEventListener('mouseup', this.stop);
    this.oreginal = this.frameEl.getBoundingClientRect();
    this.layerBounding = this.layerEl.getBoundingClientRect();
    this.callbacks.push({ callback, startPos: [event.x, event.y] });
  }

  move(event) {
    const { height: layerHeight, width: layerWidth } = this.layerBounding;
    const { top, left, height, width } = this.oreginal;
    this.callbacks.forEach(({ callback, startPos }) => {
      const [startX, startY] = startPos;

      const newTop = parseInt(event.y - startY + top, 10);
      const newLeft = parseInt(event.x - startX + left, 10);
      const topLimit = layerHeight - height;
      const leftLimit = layerWidth - width;

      const output = {
        top: [0, newTop, topLimit].sort((a, b) => a - b)[1],
        left: [0, newLeft, leftLimit].sort((a, b) => a - b)[1],
      };
      callback(output);
    });
  }

  stop(e) {
    this.move(e);
    this.callbacks = [];
    window.removeEventListener('mousemove', this.move);
    window.removeEventListener('mouseup', this.stop);
  }
}

export default DraggableTracker;
