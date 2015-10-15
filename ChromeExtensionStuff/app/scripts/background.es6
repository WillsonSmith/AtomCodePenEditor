let isConnected = false;
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  let socket = new WebSocket("ws://127.0.0.1:8080");
  socket.addEventListener("message", function(message) {
    if (!isConnected) {
      socket.send("test ws received");
      isConnected = true;
    }
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {action: message.data}, function(response) {
        console.log(response);
      });
    });
  });
});
