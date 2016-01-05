/**
 * jquery.rich-functional-list.js
 * Copyright Aaron McAvinue 2015
 * v1.0.0
 *
 * Special thanks to Nestable whose code had a significant impact on building this plugin.
 * http://dbushell.github.io/Nestable/
 *
 * NOTES:
 *      The $.RichList objects live on the call object in $(callobject).data() in memory.
 *
 *      The partials files are prefixed with the scope of "this".
 *          jquery.*    : "this" is the jQ object calling the function.
 *          plugin.*    : "this" is the global scope.
 *          RL.*        : "this" is the instance of the $.RichList class.
 *
 *      STRUCTURE OF THE PLUGIN:
 *          Think of $.richFunctionalList as the SUPER-CLASS.
 *              This starts the plugin & sets up the environment for the lists.
 *              Contains methods that affect any/all of the lists in the document.
 *          $.RichList is the INHERITING CLASS.
 *              Each instance of $.RichList represents one list-tree in the DOM.
 *              Contains methods that affect ONLY that singular list in the document.
 *              $.RichList can access all variables/methods in $.richFunctionalList.
 *          The entire plugin is roughly ONE UNIT. It is wrapped in an IIFE & does not pollute global scope.
 */

(function(){
    'use strict';