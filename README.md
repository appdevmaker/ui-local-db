# ui-local-db
Database implementation within user's browser environment.

### What is it for

This module is an implementation to store data on the user's device within him work through Web. Actually, it has <b>CRUD</b> behaviour to work with data (create, read, update, delete).

### How to use

```javascript
var dbPanel = new dBControl();
```

This action initializes control to work with data within current user session.

```javascript
dbPanel.create('First');
```

Create a new data store in the localStorage. This action is required and have to be involved necessarily to use almost all control methods.

```javascript
dbPanel.connect('First');
```

Call specified localDB to work.

```javascript
dbPanel.clear();
```

Reset all data for the current localDB. Furthermore, the connection with current localDB wont be lost.

```javascript
dbPanel.disconnect();
```

Disconnect and back to the main control state.

```javascript
dbPanel.drop('Title');
```

Remove localDB from the common storage by the received title.

```javascript
dbPanel.displayMessages(bool);
```

Show\ignore specific infrom messages into browser console.

```javascript
dbPanel.find('Some title');
```

Find localDB at the common storage.

```javascript
dbPanel.getAll();
```

Find and return collection of exist localDB's in the user localStorage.

```javascript
dbPanel.getData();
```

Retrieve data inside current localDB.

```javascript
dbPanel.getInfo();
```

Display common info about current localDB.

```javascript
dbPanel.removeValue('Some');
```

Delete the property from the current localDB.

```javascript
dbPanel.setValue('Another');
```

Set a new value into the current localDB.
