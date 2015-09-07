chrome.runtime.sendMessage "hi", (response) ->
  console.log(response)

chrome.extension.onMessage.addListener (msg, sender, sendResponse) ->
  data = JSON.parse(msg.action)
  console.log(data)
