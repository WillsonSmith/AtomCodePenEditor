editors = document.getElementsByClassName('CodeMirror')
class AreaEditor
  constructor: (@node) ->
    @node = @node.CodeMirror
  injectContent: (content) ->
    @node.setValue(content)
    @

htmlEditor = new AreaEditor(editors[0]);
cssEditor = new AreaEditor(editors[1]);
jsEditor = new AreaEditor(editors[2]);

areaEditObject = {
  htmlEditor: htmlEditor
  cssEditor: cssEditor
  jsEditor: jsEditor
}
window.AreaEditor = areaEditObject
