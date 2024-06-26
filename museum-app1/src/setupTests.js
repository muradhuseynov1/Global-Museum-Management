// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import 'matchmedia-polyfill'; 
import 'matchmedia-polyfill/matchMedia.addListener'; 

beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
});
afterEach(() => {
    jest.clearAllMocks();
});

class ResizeObserver {
    constructor(callback) {
      this.callback = callback;
    }
    observe(target) {
      this.target = target;
      this.callback([{ target: this.target, contentRect: this.target.getBoundingClientRect() }]);
    }
    unobserve() {}
    disconnect() {}
  }
  
  window.ResizeObserver = ResizeObserver;