let editors = document.getElementsByClassName('CodeMirror');

let AreaEditor = function AreaEditor(node) {
  let codeMirrorNode = node.CodeMirror;
  return {
    injectContent: function injectContent(content) {
      codeMirrorNode.setValue(content);
    }
  }
}

editors = document.getElementsByClassName('CodeMirror')

class AreaEditor
  constructor: (@node) ->
    @node = @node.CodeMirror
  injectContent: (content) ->
    @node.setValue(content)
    console.log(@node)
    @

editorOne = new AreaEditor(editors[0]);

editorOne.injectContent("<textarea></textarea>")
