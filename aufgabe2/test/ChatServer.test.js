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
        this.add = sinon.spy();
        this.findById = sinon.stub().returns(user);
        this.findAll = sinon.stub().returns([user]);
        this.removeById = sinon.spy();
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

        describe(".addUser(user: User): *", function () {

            it("should call .add() on the userstore", function () {
                chatServer.addUser(user);
                expect(userStore.add).to.have.been.calledWith(user);
            });

            it("should emit a 'user added'-event with the user after the user has been added", function () {
                var listener = sinon.spy();

                chatServer.on("user added", listener);
                chatServer.on("user added", function () {
                    expect(userStore.add).to.have.been.called;
                });
                chatServer.addUser(user);
                expect(listener).to.have.been.calledWith({
                    user: user
                });
            });

        });

        describe(".removeUserById(userId: String): *", function () {

            it("should call .removeById() on the user store", function () {
                chatServer.addUser(user);
                chatServer.removeUserById(user.id);
                expect(userStore.removeById).to.have.been.calledWith(user.id);
            });

            it("should emit a 'user removed'-event with the user after the user has been removed", function () {
                var listener = sinon.spy();

                chatServer.on("user removed", listener);
                chatServer.on("user removed", function () {
                    expect(userStore.removeById).to.have.been.called;
                });
                chatServer.addUser(user);
                chatServer.removeUserById(user.id);
                expect(listener).to.have.been.calledWith({
                    user: user
                });
            });
            
            it("should throw an 'Unknown user'-error if the store returns null on findById()", function () {
                userStore.findById = function () {
                    return null;
                };

                expect(function () {
                    chatServer.removeUserById("fritz");
                }).to.throw("Unknown user");
            });

        });

        describe(".sendMessage(userId: String, text: String): *", function () {

            it("should store the message in message store with the senderId and the timestamp as id", function () {
                var now = Date.now(),
                    message,
                    then;

                chatServer.sendMessage("hans", "hallo");
                message = messageStore.add.firstCall.args[0];
                then = Date.now();

                expect(message.id).to.be.least(now);
                expect(message.id).to.be.most(then);
                expect(message.senderId).to.equal("hans");
                expect(message.text).to.equal("hallo");
            });

            it("should emit a 'new message'-event with the user as sender and the message", function () {
                var listener = sinon.spy(),
                    event;

                chatServer.on("new message", listener);
                chatServer.on("new message", function () {
                    expect(messageStore.add).to.have.been.called;
                });

                chatServer.sendMessage("hans", "hallo");
                event = listener.firstCall.args[0];

                expect(event.sender).to.equal(user);
                expect(event.message).to.be.an("object");
                expect(event.message.senderId).to.equal("hans");
            });

            it("should throw an 'Unknown user'-error if the store returns null on findById()", function () {
                userStore.findById = function () {
                    return null;
                };

                expect(function () {
                    chatServer.sendMessage("fritz", "hallo");
                }).to.throw("Unknown user");
            });

        });

        describe(".getAllMessages(): Array", function () {

            it("should call .findAll() on the message store and return the result", function () {
                var expectedResult = [],
                    result;

                messageStore.findAll = sinon.stub().returns(expectedResult);

                result = chatServer.getAllMessages();

                expect(messageStore.findAll).to.have.been.calledWith();
                expect(result).to.equal(expectedResult);
            });

        });

    });

});
