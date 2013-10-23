## Aufgabe 2

Wir möchten in den nächsten drei Wochen einen kleinen Chat auf Basis von WebSockets bauen. Wir beginnen mit zwei Klassen, dem `MemoryStore` und dem `ChatServer`. Bevor ihr beginnt, führt wieder `npm install` aus.

Falls ihr nicht wisst, welche Objekte euch von Haus aus bei JavaScript zur Verfügung stehen und welche Methoden sie bieten, habt ihr hier ein gutes Nachschlagewerk: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference

---

### MemoryStore

Der `MemoryStore` implementiert ein fiktives Datenbank-Interface zum Speichern und Auslesen von Daten. Er soll später - theoretisch zumindest - mit einer echten Datenbank ausgetauscht werden. Seine Aufgabe ist es, zu Testzwecken alle Daten im Arbeitsspeicher zu halten. Diese Form von Datenspeicherung ist die einfachste, ist aber natürlich nicht für eine echte Anwendung geeignet, da bei Beendigung des Prozesses auch alle Daten futsch wären.

Die genaue Spezifikation findet ihr im Test `aufgabe2/test/MemoryStore.test.js`. Hier die Anforderung jedoch zusätzlich in Prosa.


Die Tests erwarten, dass beide Klassen in `aufgabe2/lib` liegen. Legt also z.B. für den MemoryStore die Datei `aufgabe2/lib/MemoryStore.js` an und schreibt in diese Datei:

```javascript
function MemoryStore() {}

// Hier kommt eure Implementierung

module.exports = MemoryStore;
```

`module.exports` exportiert den MemoryStore, so dass der Test darauf zugreifen kann.

#### MemoryStore()

Der `MemoryStore` ist eine `function`

#### MemoryStore.prototype: Object

Der `MemoryStore` soll einen Prototyp besitzen mit folgenden Eigenschaften.

#### MemoryStore.prototype.add(item: Item): *

##### 1)
Der Prototyp besitzt eine `add()`-Funktion, mit der ein neues `item` hinzugefügt werden kann. Das einfachste `Item` sieht folgendermaßen aus:

```javascript
{
    id: String
}
``` 

Danach kann das `item` über die Funktion `findById(item.id)` gefunden werden.

##### 2)
Das Hinzufügen eines `item`s mit der selben `id` überschreibt einfach das alte `item`.

##### Tipp:
Verwendet zum Speichern der `items` einfach ein leeres `Object` `{}`, in dem ihr über die Brackets-Notation die `items` folgendermaßen speichern könnt: `items[item.id] = item`. Jedes `Object` ist in JavaScript also ein [assoziatives Array](http://en.wikipedia.org/wiki/Associative_array).


#### MemoryStore.prototype.findById(id: String): Item

##### 1)

Gibt das `item` mit der jeweiligen `id` zurück.

##### 2)

Gibt `null` zurück, wenn es kein `item` mit dieser `id` gibt.

#### MemoryStore.prototype.findAll(): Array

##### 1)

Gibt alle `items` in einem Array zurück.

##### 2)

Gibt ein leeres Array zurück, wenn bisher keine `items` gespeichert wurden.

##### Tipp:

Ihr könnt über ein `Object` mit einer `for in`-Schleife iterieren.

```javascript
for (key in object) {
    if (object.hasOwnProperty(key)) {
        
    }
}
```

`if (object.hasOwnProperty(key))` verhindert, dass ihr aus Versehen über Eigenschaften in der Prototypen-Kette iteriert.

#### MemoryStore.prototype.removeById(id: String): *

##### 1)

Entfernt das `item` mit der jeweiligen `id`

##### 2)

Macht gar nichts, falls es das `item` nicht gibt.

---

#### ChatServer(userStore: Store, messageStore: Store) extends EventEmitter

Ein kleiner Hinweis zu den Tests: Wir arbeiten hier mit sogenannten Spies und Stubs. Spies und Stubs sind Funktionen, die an Stelle von echten Funktionen platziert werden, und uns um Nachhinein verraten, mit welchen Argumenten sie aufgerufen werden. So können wir den `ChatServer` testen, ohne von einer anderen Klasse - also dem `MemoryStore` - abhängig zu sein. Mehr Informationen findet ihr dazu hier: http://sinonjs.org/

##### 1)

Der `ChatServer` ist eine `function`

##### 2)

Der `ChatServer` wird mit zwei `Store`-Implementierungen instanziiert, dem `userStore` und dem `messageStore`

#### ChatServer.prototype: Object

Der `ChatServer.prototype` soll von [`EventEmitter.prototype`](http://nodejs.org/api/events.html#events_class_events_eventemitter) aberben und außerdem folgende Eigenschaften besitzen.

#### ChatServer.prototype.addUser(user: Item): *

##### 1)

Sollte `.add(user)` auf dem `userStore` ausführen.

##### 2)

Sollte ein `user added`-Event emitten, nachdem der User hinzugefügt wurde. Das Event-Object, das alle Listener kriegen, sieht so aus:

```javascript
{
    user: user
}
```

Informationen zur EventEmitter-API findet ihr hier: http://nodejs.org/api/events.html#events_class_events_eventemitter

#### ChatServer.prototype.removeUserById(userId: String): *

##### 1)

Sollte `.removeById(userId)` auf dem `userStore` ausführen.

##### 2)

Sollte ein `user removed`-Event emitten, nachdem der User entfernt wurde. Das Event-Object, das alle Listener kriegen, sieht so aus:

```javascript
{
    user: Item
}
```

##### 3)

Sollte einen Fehler mit der Nachricht `Unknown user` werfen, wenn `userStore.findById(userId)` `null` zurückliefert.

#### ChatServer.prototype.sendMessage(userId: String, text: String): *

##### 1)

Sollte `.add(message)` auf dem `messageStore` ausführen. Die `message` sollte folgendermaßen aussehen:

```javascript
{
    id: Timestamp
    senderId: String
    text: String
}
```

**Tipp:** Ihr bekommt den aktuellen Timestamp über den Aufruf `Date.now()`

##### 2)

Sollte ein `new message`-Event emitten, nachdem die `message` gespeichert wurde. Das Event-Object, das alle Listener kriegen, sieht so aus:

```javascript
{
    sender: Item,
    message: String
}
```

##### 3)

Sollte einen Fehler mit der Nachricht `Unknown user` werfen, wenn `userStore.findById(userId)` `null` zurückliefert.

#### ChatServer.prototype.getAllMessages(): Array

##### 1)

Sollte `.findAll()` auf dem `messageStore` ausführen und einfach das Ergebnis zurückliefern.