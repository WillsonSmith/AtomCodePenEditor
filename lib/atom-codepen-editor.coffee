AtomCodepenEditorView = require './atom-codepen-editor-view'
{CompositeDisposable} = require 'atom'
open = require "open"
ws = require "ws"
tmp = require "tmp"
fs = require "fs"

WebSocketServer = ws.Server


module.exports = AtomCodepenEditor =
  atomCodepenEditorView: null
  modalPanel: null
  subscriptions: null

  activate: (state) ->

    @atomCodepenEditorView = new AtomCodepenEditorView(state.atomCodepenEditorViewState)
    @modalPanel = atom.workspace.addModalPanel(item: @atomCodepenEditorView.getElement(), visible: false)

    # Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    @subscriptions = new CompositeDisposable

    # Register command that toggles this view
    @subscriptions.add atom.commands.add 'atom-workspace', 'atom-codepen-editor:toggle': => @toggle()
    @subscriptions.add atom.commands.add 'atom-workspace', "codepen-editor:new", => @newEditor()
    @subscriptions.add atom.commands.add 'atom-workspace', "codepen-editor:newWithPen", => @newEditorWithPen()
    @subscriptions.add atom.commands.add 'atom-workspace', "codepen-editor:publish", => @publishChanges()
    @subscriptions.add atom.commands.add 'atom-workspace', "codepen-editor:currentEditorText", => @currentEditorText()

  deactivate: ->
    @modalPanel.destroy()
    @subscriptions.dispose()
    @atomCodepenEditorView.destroy()

  serialize: ->
    atomCodepenEditorViewState: @atomCodepenEditorView.serialize()

  addTextBufferObserver: (workspace, callback) ->
    console.log('test', workspace, callback)
    workspace.buffer.onDidSave ->
      callback()

  toggle: ->
    if !@wss
      @wss = new WebSocketServer({port: 8080})
      @wss.on 'connection', (ws) =>
        @ws = ws
        ws.on 'message', (message) ->
          console.log "received: #{message}"
        ws.send('connected')

    textBufferSaveEventHandler = =>
      @publishChanges()

    atom.workspace.observeTextEditors (workspace) =>
      @addTextBufferObserver(workspace, textBufferSaveEventHandler)

    if @modalPanel.isVisible()
      @modalPanel.hide()
    else
      @modalPanel.show()
    setTimeout (=> @modalPanel.hide() ), 1500

  newEditor: ->

    tmp.dir {mode: '0777', prefix: 'AtomCodePen_'}, (err, path, cleanupCallback) ->
      throw err if err
      ["html", "css", "js"].forEach (extension) ->
        fs.writeFileSync "/#{path}/codepen.#{extension}", ""

      atom.open({
        pathsToOpen: ["#{path}"],
        newWindow: false
      })


  newEditorWithPen: ->
    @newEditor()
    open("https://codepen.io/pen", "Google Chrome")

  currentEditorText: ->
    editor = atom.workspace.getActiveTextEditor()
    console.log editor.getText()

  publishChanges: ->
    console.log(@wss, @ws)
    if @wss && @ws
      editor = atom.workspace.getActiveTextEditor()
      currentFileType = editor.getTitle().split(".")[1]
      @ws.send(JSON.stringify({
        "type": currentFileType,
        "data": editor.getText()
        }))
