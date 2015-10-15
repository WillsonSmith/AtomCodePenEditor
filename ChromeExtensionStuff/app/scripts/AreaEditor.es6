let editors = document.getElementsByClassName('CodeMirror');

let AreaEditor = function AreaEditor(node) {
  let codeMirrorNode = node.CodeMirror;
  return {
    injectContent: function injectContent(content) {
      codeMirrorNode.setValue(content);
    }
  }
}

let htmlEditor = AreaEditor(editors[0]);
let cssEditor = AreaEditor(editors[1]);
let jsEditor = AreaEditor(editors[2]);

let areaEditObject = {
  htmlEditor: htmlEditor,
  cssEditor: cssEditor,
  jsEditor: jsEditor
}
window.AreaEditor = areaEditObject;
