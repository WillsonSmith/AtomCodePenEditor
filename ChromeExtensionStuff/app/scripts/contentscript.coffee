areaEdtiorJsUrl = chrome.extension.getURL('/scripts/AreaEditor.js')

s = document.createElement("script")

handleStateChange = (c) ->
  return unless xhr.readyState == 4
  return unless xhr.status == 200
  console.log(xhr.responseText)
  s.innerHTML = xhr.responseText
  document.body.appendChild(s)

xhr = new XMLHttpRequest()
xhr.onreadystatechange = handleStateChange
xhr.open("GET", areaEdtiorJsUrl)
xhr.send()

chrome.runtime.sendMessage "hi", (response) ->
  console.log(response)

chrome.extension.onMessage.addListener (msg, sender, sendResponse) ->
  data = JSON.parse(msg.action) unless msg.action == "connected"
  console.log(data)
  s = document.createElement("script")
  if data
    content = data.data.replace(/[\r\n]/g, "");
    functionToRun = "AreaEditor.htmlEditor.injectContent('#{content}')" if data.type == "html"
    functionToRun = "AreaEditor.cssEditor.injectContent('#{content}')" if data.type == "css"
    functionToRun = "AreaEditor.jsEditor.injectContent('#{content}')" if data.type == "js"
    s.innerHTML = "
    (function() {
        #{functionToRun}
    })();
    "
    document.body.appendChild(s)
