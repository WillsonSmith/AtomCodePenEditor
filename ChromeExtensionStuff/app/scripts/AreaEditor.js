(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var editors = document.getElementsByClassName('CodeMirror');

var AreaEditor = function AreaEditor(node) {
  var codeMirrorNode = node.CodeMirror;
  return {
    injectContent: function injectContent(content) {
      codeMirrorNode.setValue(content);
    }
  };
};

var htmlEditor = AreaEditor(editors[0]);
var cssEditor = AreaEditor(editors[1]);
var jsEditor = AreaEditor(editors[2]);

var areaEditObject = {
  htmlEditor: htmlEditor,
  cssEditor: cssEditor,
  jsEditor: jsEditor
};
window.AreaEditor = areaEditObject;

},{}]},{},[1]);
