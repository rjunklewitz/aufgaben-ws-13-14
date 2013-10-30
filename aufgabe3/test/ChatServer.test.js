"use strict";

var EventEmitter = require("events").EventEmitter,
    chai = require("chai"),
    sinon = require("sinon"),
    expect = chai.expect;

chai.use(require("sinon-chai"));

describe("ChatServer(userStore: Store, messageStore: Store)", function () {
    var ChatServer,
        user = {
            id: "hans"
        };

    function StoreMock() {
        this.add = sinon.stub().yieldsAsync(null);
        this.findById = sinon.stub().yieldsAsync(null, user);
        this.findAll = sinon.stub().yieldsAsync(null, [user]);
        this.removeById = sinon.stub().yieldsAsync(null);
    }

    before(function () {
        ChatServer = require("../lib/ChatServer.js");
    });

    it("should return an instance of EventEmitter", function () {
        expect(new ChatServer(new StoreMock(), new StoreMock())).to.be.an.instanceof(EventEmitter);
    });

    describe(".prototype: Object", function () {
        var chatServer,
            userStore,
            messageStore;

        beforeEach(function () {
            userStore = new StoreMock();
            messageStore = new StoreMock();
            chatServer = new ChatServer(userStore, messageStore);
        });

        describe(".addUser(user: User, callback: Function): *", function () {

            it("should call .add() on the userstore", function () {
                chatServer.addUser(user, function (err) {
                    expect(err).to.equal(null);
                    expect(userStore.add).to.have.been.calledWith(user);
                });
            });

            it("should emit a 'user added'-event with the user after the user has been added", function (done) {
                var listener = sinon.spy();

                chatServer.on("user added", listener);
                chatServer.on("user added", function () {
                    expect(userStore.add).to.have.been.called;
                });
                chatServer.addUser(user, function () {
                    expect(listener).to.have.been.calledWith({
                        user: user
                    });
                    done();
                });
            });

        });

        describe(".removeUserById(userId: String, callback: Function): *", function () {

            beforeEach(function (done) {
                chatServer.addUser(user, function () {
                   done();
                });
            });

            it("should call .removeById() on the user store", function (done) {
                chatServer.removeUserById(user.id, function (err) {
                    expect(err).to.equal(null);
                    expect(userStore.removeById).to.have.been.calledWith(user.id);
                    done();
                });
            });

            it("should emit a 'user removed'-event with the user after the user has been removed", function (done) {
                var listener = sinon.spy();

                chatServer.on("user removed", listener);
                chatServer.on("user removed", function () {
                    expect(userStore.removeById).to.have.been.called;
                });
                chatServer.removeUserById(user.id, function () {
                    expect(listener).to.have.been.calledWith({
                        user: user
                    });
                    done();
                });
            });
            
            it("should call the callback with an 'Unknown user'-error if the store returns null on findById()", function (done) {
                userStore.findById = function (id, callback) {
                    callback(null, null);
                };

                chatServer.removeUserById("fritz", function (err) {
                    expect(err.message).to.contain("Unknown user");
                    done();
                });
            });

        });

        describe(".sendMessage(userId: String, text: String, callback: Function): *", function () {

            it("should store the message in message store with the senderId and the timestamp as id", function (done) {
                var now = Date.now(),
                    message,
                    then;

                chatServer.sendMessage("hans", "hallo", function (err) {
                    expect(messageStore.add).to.have.been.called;

                    message = messageStore.add.firstCall.args[0];
                    then = Date.now();

                    expect(err).to.equal(null);

                    expect(message.id).to.be.least(now);
                    expect(message.id).to.be.most(then);
                    expect(message.senderId).to.equal("hans");
                    expect(message.text).to.equal("hallo");
                    done();
                });
            });

            it("should emit a 'new message'-event with the user as sender and the message", function (done) {
                var listener = sinon.spy(),
                    event;

                chatServer.on("new message", listener);
                chatServer.on("new message", function () {
                    expect(messageStore.add).to.have.been.called;
                });

                chatServer.sendMessage("hans", "hallo", function () {
                    event = listener.firstCall.args[0];

                    expect(event.sender).to.equal(user);
                    expect(event.message).to.be.an("object");
                    expect(event.message.senderId).to.equal("hans");
                    done();
                });
            });

            it("should call the callback with an 'Unknown user'-error if the store returns null on findById()", function (done) {
                userStore.findById = function (id, callback) {
                    callback(null, null);
                };

                chatServer.sendMessage("fritz", "hallo", function (err) {
                    expect(err.message).to.contain("Unknown user");
                    done();
                });
            });

        });

        describe(".getAllMessages(callback: Function): *", function () {

            it("should call .findAll() on the message store and return the result", function (done) {
                var expectedResult = [];

                messageStore.findAll = sinon.stub().yields(null, expectedResult);

                chatServer.getAllMessages(function (err, result) {
                    expect(err).to.equal(null);
                    expect(messageStore.findAll).to.have.been.calledWith();
                    expect(result).to.equal(expectedResult);
                    done();
                });
            });

        });

    });

});
