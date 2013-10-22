"use strict";

var chai = require("chai"),
    expect = chai.expect;

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

        describe(".add(item: Item): *", function () {

            it("should add the item to the store", function () {
                memoryStore.add(item);
                expect(memoryStore.findById(item.id)).to.equal(item);
            });

            it("should overwrite an item with the same id", function () {
                otherItem.id = item.id;

                memoryStore.add(item);
                memoryStore.add(otherItem);
                expect(memoryStore.findById(item.id)).to.equal(otherItem);
            });

        });

        describe(".findById(id: String): Item", function () {

            beforeEach(function () {
                memoryStore.add(item);
            });

            it("should return the item", function () {
                expect(memoryStore.findById(item.id)).to.equal(item);
            });

            it("should return null if there is no item with the given id", function () {
                expect(memoryStore.findById(99)).to.equal(null);
            });

        });

        describe(".findAll(): Array", function () {

            it("should return an empty array if no item has been added yet", function () {
                expect(memoryStore.findAll()).to.eql([]);
            });

            it("should return an array with all items that have been added", function () {
                memoryStore.add(item);
                memoryStore.add(otherItem);
                expect(memoryStore.findAll().sort()).to.eql([item, otherItem].sort());
            });

        });

        describe(".removeById(id: String): *", function () {

            it("should remove the item with the given id", function () {
                memoryStore.add(item);
                memoryStore.removeById(item.id);
                expect(memoryStore.findById(item.id)).to.equal(null);
            });

            it("should do nothing if there is no item with the given id", function () {
                expect(function () {
                    memoryStore.removeById(99);
                }).to.not.throw();
            });

        });

    });

});
