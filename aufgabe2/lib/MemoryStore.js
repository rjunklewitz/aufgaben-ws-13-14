"use strict";

function MemoryStore() {
    this.item_list = new Array();
}

MemoryStore.prototype.add = function (item) {
    this.item_list[item.id] = item;
};

MemoryStore.prototype.findById = function (id) {
    var item = this.item_list[id];
    
    if (item === undefined) {
        return null;
    }
    
    return item;
};

MemoryStore.prototype.findAll = function () {
    return this.item_list;
};

MemoryStore.prototype.removeById = function (id) {
    delete this.item_list[id];
};

module.exports = MemoryStore;