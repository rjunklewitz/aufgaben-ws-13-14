## Aufgabe 1

In der ersten Aufgabe geht es erstmal darum, euch mit der Projektstruktur vertraut zu machen. Im Ordner `aufgabe1` findet ihr eine `package.json`, in der die Dependencies (also Module, die die Aufgabe benötigt) angegeben werden. Im Ordner `aufgabe1/test` liegen die Test-Dateien, in diesem Fall nur `aufgabe1.test.js`. Wir geben euch in Zukunft die Tests vor und ihr müsst die Implementierung dazu liefern. Diese Vorgehensweise nennt man [Test-driven development](http://en.wikipedia.org/wiki/Test-driven_development), bei der man zuerst die Tests und dann die Implementierung schreibt.

### Dependencies installieren

Ihr beginnt jede Aufgabe erst einmal mit dem Installieren der Dependencies. Geht in der Kommandozeile in euren Ordner `cd /pfad/zu/ordner/aufgabe1` und führt dann `npm install` aus. [npm](https://npmjs.org/) erstellt dabei den Ordner `node_modules` (näheres dazu [hier](http://nodejs.org/api/modules.html#modules_loading_from_node_modules_folders)) und installiert dort alle Dependencies, die in der `package.json` angegeben sind.  Die benötigten Versionsnummern werden bei [npm](https://npmjs.org/) nach dem [semver](http://semver.org/)-Prinzip angegeben. Version `1.x` bedeutet demnach, *"Gib mir die neueste Version, die mit einer 1 beginnt, bei mocha zum Beispiel 1.13.0"*

### Test ausführen

Führt nun im Ordner `aufgabe1` den Befehl `npm test` aus. [npm](https://npmjs.org/) führt daraufhin den Befehl aus, der in der `package.json` unter `scripts.test` angegeben ist, in dem Fall `node node_modules/mocha/bin/mocha -R spec`. `npm test` ist ein Quasi-Standard bei allen node-Modulen, um die Unit-Tests auszuführen. Wie ihr seht, schlagen die Tests fehl, da ihr die Aufgabe noch nicht gelöst habt.

### Aufgabe 1 lösen

Wie der Fehler `Error: Cannot find module '../lib/aufgabe1'` schon verrät, ist ein bestimmtes Modul nicht vorhanden. Für die erste Aufgabe müsst ihr nur im Ordner `aufgabe1` einen Ordner `lib` erstellen, der wiederum eine JavaScript-Datei enthält, die ihr `index.js` nennt. Dieses Modul `index.js` soll lediglich die Property `helloWorld` mit dem Wert `true` exportieren. Diese Anforderung könnt ihr auch im Test an folgenden Zeilen erkennen:

```javascript
it("should export helloWorld = true", function () {
    expect(aufgabe1.helloWorld).to.equal(true);
});
```

Die `index.js` muss demnach nur folgende Zeile beinhalten:

```javascript
exports.helloWorld = true;
```

Wenn ihr nun wieder `npm test` ausführt, sollten alle Tests durchlaufen.

### mocha global installieren

Damit ihr in der Entwicklung nicht immer `npm test` ausführen müsst, könnt ihr den sog. Test-Runner [mocha](http://visionmedia.github.io/mocha/) auch global mit diesem Befehl installieren: `npm install -g mocha`. Nun könnt ihr einfach in eurem Aufgaben-Ordner `mocha -w` ausführen, und die Tests laufen jedesmal neu, wenn ihr eine Datei speichert.