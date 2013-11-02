"use strict";

var EventEmitter = require("events").EventEmitter;
var util = require("util");

function ChatServer(userStore, messageStore) {
    EventEmitter.call(this);
    this.userStore = userStore;
    this.messageStore = messageStore;
}

util.inherits(ChatServer, EventEmitter);

ChatServer.prototype.addUser = function (user) {
    this.userStore.add(user);
    
    this.emit("user added", { "user" : user });
};

ChatServer.prototype.removeUserById = function (id) {
    this.userStore.removeById(id);
    
    var user = this.userStore.findById(id);
    
    if (user === null) {
        throw "Unknown user";
    } else {
        this.emit("user removed", { "user" : user });
    }
};

ChatServer.prototype.sendMessage = function (userId, text) {
    var message = {"id" : Date.now(), "senderId" : userId, "text" : text},
        user = this.userStore.findById(userId);
    
    if (user === null) {
        throw "Unknown user";
    } else {
        this.messageStore.add(message);
    }
    
    this.emit("new message", { "sender": user, "message": message });
};

ChatServer.prototype.getAllMessages = function () {
    return this.messageStore.findAll();
};

module.exports = ChatServer;