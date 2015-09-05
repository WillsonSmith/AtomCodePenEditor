AtomCodepenEditorView = require './atom-codepen-editor-view'
{CompositeDisposable} = require 'atom'
open = require "open"
ws = require "ws"

WebSocketServer = ws.Server


module.exports = AtomCodepenEditor =
  atomCodepenEditorView: null
  modalPanel: null
  subscriptions: null

  activate: (state) ->
    shell = require 'shell'

    @atomCodepenEditorView = new AtomCodepenEditorView(state.atomCodepenEditorViewState)
    @modalPanel = atom.workspace.addModalPanel(item: @atomCodepenEditorView.getElement(), visible: false)

    # Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    @subscriptions = new CompositeDisposable

    # Register command that toggles this view
    @subscriptions.add atom.commands.add 'atom-workspace', 'atom-codepen-editor:toggle': => @toggle()
    atom.commands.add 'atom-workspace', "codepen-editor:new", => @newEditor()

  deactivate: ->
    @modalPanel.destroy()
    @subscriptions.dispose()
    @atomCodepenEditorView.destroy()

  serialize: ->
    atomCodepenEditorViewState: @atomCodepenEditorView.serialize()

  toggle: ->

    if @modalPanel.isVisible()
      @modalPanel.hide()
    else
      @modalPanel.show()

  newEditor: ->
      open("https://codepen.io/pen", "Google Chrome")

      if !@wss
        @wss = new WebSocketServer({port: 8080})
        @wss.on 'connection', (ws) ->
          ws.on 'message', (message) ->
            console.log "received: #{message}"
          ws.send('connected')
