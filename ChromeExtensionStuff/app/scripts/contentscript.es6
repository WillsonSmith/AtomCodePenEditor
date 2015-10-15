let areaEdtiorJsUrl = chrome.extension.getURL('/scripts/AreaEditor.js');

let newScriptTag = document.createElement("script");
let body = document.getElementsByTagName("body")[0];

let handleStateChange = function handleStateChange(change) {
  if (xhr.readyState !== 4) {
    return
  }
  if (xhr.status !== 200) {
    return
  }
  newScriptTag.innerHTML = xhr.responseText;
  body.appendChild(newScriptTag);
}

let xhr = new XMLHttpRequest();
xhr.onreadystatechange = handleStateChange;
xhr.open("GET", areaEdtiorJsUrl);
xhr.send();

chrome.runtime.sendMessage("connect", function(response) {});

chrome.extension.onMessage.addListener(function(msg, sender, sendResponse) {
  let data;
  if (msg.action !== "connected") {
    data = JSON.parse(msg.action);
  }
  let newScriptTag = document.createElement("script");
  if (data) {
    console.log(data);
    let content = data.data.replace(/[\r\n]/g, "\\n");
    let functionToRun;
    content = content.replace(/[']/g, "\\'");

    if (data.type === "html") {
      functionToRun = `AreaEditor.htmlEditor.injectContent('${content}')`;
    }
    if (data.type === "css") {
      functionToRun = `AreaEditor.cssEditor.injectContent('${content}')`;
    }
    if (data.type === "js") {
      functionToRun = `AreaEditor.jsEditor.injectContent('${content}')`;
    }
    newScriptTag.innerHTML = `(function() {${functionToRun}})`;
    body.appendChild(newScriptTag);
  }
});
