"use strict";

var chai = require("chai"),
    expect = chai.expect;

describe("aufgabe1", function () {
    var aufgabe1;

    before(function () {
        aufgabe1 = require("../lib/aufgabe1");
    });

    it("should export helloWorld = true", function () {
        expect(aufgabe1.helloWorld).to.equal(true);
    });
});