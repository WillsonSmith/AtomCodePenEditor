// Generated by CoffeeScript 1.9.3
(function() {
  chrome.runtime.sendMessage("hi", function(response) {
    return console.log(response);
  });

  chrome.extension.onMessage.addListener(function(msg, sender, sendResponse) {
    var data;
    data = JSON.parse(msg.action);
    return console.log(data);
  });

}).call(this);
