"use strict";
let AtomCodepenEditorView = function AtomCodepenEditorView(serializedState) {
  let element = document.createElement("div");
  element.classList.add("atom-codepen-editor");
  let message = document.createElement("div");
  message.textContent = "The Atom CodepenEditor package is Alive! It's Alive!";
  message.classList.add("message");
  element.appendChild(message);

  return {
    serialize: function serialize() {

    },

    destroy: function destroy() {
      element.remove();
    },

    getElement: function getElement() {
      return element;
    }
  }
}

module.exports = AtomCodepenEditorView;
