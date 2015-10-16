"use babel";

let AtomCodepenEditorView = require("./atom-codepen-editor-view");
let {CompositeDisposable} = require("atom");
let open = require("open");
let ws = require("ws");
let tmp = require("tmp");
let fs = require("fs");
let WebSocketServer = ws.Server;

module.exports = AtomCodepenEditor = (function AtomCodepenEditor() {
  let ws, wss;
  let modalPanel;
  let addTextBufferObserver = function addTextBufferObserver(workspace, callback) {
    console.log("test", workspace, callback);
    workspace.buffer.onDidSave(function() {
      callback();
    });
  };

  let newEditor = function newEditor() {
    let tmpOptions = {mode: '0777', prefix: 'AtomCodePen_'};
    tmp.dir(tmpOptions, function(err, path, cleanupCallback) {
      if (err) {
        throw err;
      }
      ["html", "css", "js"].forEach(function(extension) {
        fs.writeFileSync(`/${path}/codepen.${extension}`, "");
      });
      atom.open({
        pathsToOpen: [`${path}`],
        newWindow: false
      });
    });
  };

  let publishChanges = function publishChanges() {
    console.log(wss, ws);
    if (wss && ws) {
      let editor = atom.workspace.getActiveTextEditor();
      let currentFileType = editor.getTitle().split(".")[1];
      ws.send(JSON.stringify({
        "type": currentFileType,
        "data": editor.getText()
      }));
    }
  };

  return {
    AtomCodepenEditorView: null,
    subscriptions: null,

    activate: function activate(state) {
      this.AtomCodepenEditorView = AtomCodepenEditorView(state.atomCodepenEditorViewState);
      modalPanel = atom.workspace.addModalPanel({item: this.AtomCodepenEditorView.getElement(), visible: false});
      let actions = {
        "atom-codepen-editor:toggle": this.toggle,
        "codepen-editor:new": this.newEditor,
        "codepen-editor:newWithPen": this.newEditorWithPen,
        "codepen-editor:currentEditorText": this.currentEditorText
      };
      this.subscriptions = new CompositeDisposable();
      this.subscriptions.add(atom.commands.add("atom-workspace", actions));
    },

    toggle: function toggle() {
      if (!wss) {
        wss = new WebSocketServer({port: 8080});
        wss.on("connection", function(s) {
          ws = s;
          ws.on("message", function(message) {
            console.log(`received: ${message}`);
          });
          ws.send("connected");
        });
      }
      let textBufferSaveEventHandler = () => publishChanges();
      atom.workspace.observeTextEditors(function(workspace) {
        addTextBufferObserver(workspace, textBufferSaveEventHandler);
      });

      if (modalPanel.isVisible()) {
        modalPanel.hide();
      } else {
        modalPanel.show();
      }
      setTimeout(() => modalPanel.hide(), 1500);
    },

    newEditor: newEditor,

    newEditorWithPen: function newEditorWithPen() {
      newEditor();
      open("https://codepen.io/pen", "Google Chrome");
    },

    currentEditorText: function currentEditorText() {
      let editor = atom.workspace.getActiveTextEditor();
      console.log(editor.getText());
      return editor;
    }
  }
})();
