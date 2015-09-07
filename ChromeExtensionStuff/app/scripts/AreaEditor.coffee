editors = document.getElementsByClassName('CodeMirror')
class AreaEditor
  constructor: (@node) ->
    @node = @node.CodeMirror
  injectContent: (content) ->
    @node.setValue(content)
    console.log(@node)
    @

htmlEditor = new AreaEditor(editors[0]);
cssEditor = new AreaEditor(editors[1]);
jsEditor = new AreaEditor(editors[2]);

areaEditObject = {
  AreaEditor: AreaEditor
  htmlEditor: htmlEditor
  cssEditor: cssEditor
  jsEditor: jsEditor
}
window.AreaEditor = areaEditObject
