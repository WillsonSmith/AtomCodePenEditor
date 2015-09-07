isConnected = false
chrome.runtime.onMessage.addListener (request, sender, sendResponse) ->
  socket = new WebSocket("ws://127.0.0.1:8080")
  socket.addEventListener "message", (message) ->
    if !isConnected
      socket.send("test ws receive")
      isConnected = true
    chrome.tabs.query {active: true, currentWindow: true}, (tabs) ->
      chrome.tabs.sendMessage tabs[0].id, {action: message.data}, (response) ->
        console.log(response)
