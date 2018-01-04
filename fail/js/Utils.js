define(function () {
    'use strict';
    
    return {
        qs: function (selector, node) {
            return (node || document).querySelector(selector);
        },
        qsAll: function qsAll(selector, node) {
            var nodeList = (node || document).querySelectorAll(selector);
            return this.toArray(nodeList);
        },
        isAlreadyCreated: function (selector, node) {
            return node || document.querySelector(selector);
        },
        toArray: function (node) {
            return Array.prototype.slice.call(node);
        },
        clearNode: function (element, selector) {
            var nodes = this.qsAll(selector) || element;
            [].forEach.call(nodes, function(node) {
                return node && node.remove();
            });
        }
    }
});
