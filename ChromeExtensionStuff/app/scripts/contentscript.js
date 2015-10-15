(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var areaEdtiorJsUrl = chrome.extension.getURL('/scripts/AreaEditor.js');

var newScriptTag = document.createElement("script");
var body = document.getElementsByTagName("body")[0];

var handleStateChange = function handleStateChange(change) {
  if (xhr.readyState !== 4) {
    return;
  }
  if (xhr.status !== 200) {
    return;
  }
  newScriptTag.innerHTML = xhr.responseText;
  body.appendChild(newScriptTag);
};

var xhr = new XMLHttpRequest();
xhr.onreadystatechange = handleStateChange;
xhr.open("GET", areaEdtiorJsUrl);
xhr.send();

chrome.runtime.sendMessage("connect", function (response) {});

chrome.extension.onMessage.addListener(function (msg, sender, sendResponse) {
  var data = undefined;
  if (msg.action !== "connected") {
    data = JSON.parse(msg.action);
  }
  var newScriptTag = document.createElement("script");
  if (data) {
    console.log(data);
    var content = data.data.replace(/[\r\n]/g, "\\n");
    var functionToRun = undefined;
    content = content.replace(/[']/g, "\\'");

    if (data.type === "html") {
      functionToRun = "AreaEditor.htmlEditor.injectContent('" + content + "')";
    }
    if (data.type === "css") {
      functionToRun = "AreaEditor.cssEditor.injectContent('" + content + "')";
    }
    if (data.type === "js") {
      functionToRun = "AreaEditor.jsEditor.injectContent('" + content + "')";
    }
    newScriptTag.innerHTML = "(function() {" + functionToRun + "})";
    body.appendChild(newScriptTag);
  }
});

},{}]},{},[1]);
