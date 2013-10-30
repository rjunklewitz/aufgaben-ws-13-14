"use strict";

var chai = require("chai"),
    expect = chai.expect;

chai.Assertion.includeStack = true;

describe("MemoryStore()", function () {
    var MemoryStore;

    before(function () {
        MemoryStore = require("../lib/MemoryStore.js");
    });

    describe(".prototype: Object", function () {
        var memoryStore,
            item,
            otherItem;

        beforeEach(function () {
            memoryStore = new MemoryStore();
            item = {
                id: 0
            };
            otherItem = {
                id: 1
            };
        });

        describe(".add(item: Item, callback: Function): *", function () {

            it("should add the item to the store", function (done) {
                memoryStore.add(item, function () {
                    memoryStore.findById(item.id, function (err, result) {
                        expect(err).to.equal(null);
                        expect(result).to.equal(item);
                        done();
                    });
                });
            });

            it("should overwrite an item with the same id", function (done) {
                otherItem.id = item.id;

                memoryStore.add(item, function () {
                    memoryStore.add(otherItem, function () {
                        memoryStore.findById(item.id, function (err, result) {
                            expect(err).to.equal(null);
                            expect(result).to.equal(otherItem);
                            done();
                        });
                    });
                });
            });

        });

        describe(".findById(id: String, callback: Function): Item", function () {

            beforeEach(function (done) {
                memoryStore.add(item, function () { done(); });
            });

            it("should return the item", function (done) {
                memoryStore.findById(item.id, function (err, result) {
                    expect(err).to.equal(null);
                    expect(result).to.equal(item);
                    done();
                });
            });

            it("should return null if there is no item with the given id", function (done) {
                memoryStore.findById(99, function (err, result) {
                    expect(err).to.equal(null);
                    expect(result).to.equal(null);
                    done();
                });
            });

        });

        describe(".findAll(callback: Function): Array", function () {

            it("should return an empty array if no item has been added yet", function (done) {
                memoryStore.findAll(function (err, result) {
                    expect(err).to.equal(null);
                    expect(result).to.eql([]);
                    done();
                });
            });

            it("should return an array with all items that have been added", function (done) {
                memoryStore.add(item, function () {
                    memoryStore.add(otherItem, function () {
                        memoryStore.findAll(function (err, result) {
                            expect(err).to.equal(null);
                            expect(result.sort()).to.eql([item, otherItem].sort());
                            done();
                        });
                    });
                });
            });

        });

        describe(".removeById(id: String, callback: Function): *", function () {

            it("should remove the item with the given id", function (done) {
                memoryStore.add(item, function () {
                    memoryStore.removeById(item.id, function () {
                        memoryStore.findById(item.id, function (err, result) {
                            expect(err).to.equal(null);
                            expect(result).to.equal(null);
                            done();
                        });
                    });
                });
            });

            it("should do nothing if there is no item with the given id", function (done) {
                memoryStore.removeById(99, function (err) {
                    expect(err).to.equal(null);
                    done();
                });
            });

        });

    });

});
