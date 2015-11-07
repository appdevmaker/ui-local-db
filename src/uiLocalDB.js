var dBControl = (function(){

    var storage = localStorage, _info, db;

    this.constructor = undefined;
    this.clear = ClearDB;
    this.connect = ConnectDB;
    this.create = CreateDB;
    this.disconnect = DisconnectDB;
    this.displayMessages = DisplayMessages;
    this.drop = DropDB;
    this.find = FindDB;
    this.getAll = GetAll;
    this.getData = GetData;
    this.getInfo = GetInfo;
    this.removeValue = RemoveValue;
    this.setValue = SetValue;

    /*
     ** Current LocalDB to work
     */
    db = {
        // LocalDB entities
        Data: [],
        // show messages in console if true
        DisplayMessages: true,
        // you need this field to involve all functional DB methods
        Name: null,
        // if Type field wont be 'localDB' connection is broken
        Type: null,
        // time when LocalDB has been created
        Created: null,
        // time when LocalDB had last handling
        LastTimeUsed: null
    };

    /**
     * Clear exists LocalDB
     * @constructor
     */
    function ClearDB(){
        if (IsTrue(FindDB(db.Name))){
            ResetDBValues(db);
            _info.Cleared();
        } else {
            _info.NotFound(db.Name);
        }
    }

    /**
     * Connect to exists LocalDB
     * @param title {String}
     * @constructor
     */
    function ConnectDB(title){
        if (IsTrue(FindDB(title))){
            db = JSON.parse(storage.getItem(title));
            info('Connection has been established with success. Your current LocalDB is \ ' + db.Name + '\' .');
        } else {
            _info.NotFound(title);
        }
    }

    /**
     * Create new LocalDB into the user's device
     * @param title {String}
     * @param forcibly {Boolean}
     * @constructor
     */
    function CreateDB(title, forcibly){
        if (IsTrue(FindDB(title))) {
            if (IsTrue(forcibly)) {
                EstablishLocalDB(title, null);
            } else {
                warn('LocalDB with specified Name is already exists. Use .create("Title", true) syntax to avoid that.');
            }
        } else {
            EstablishLocalDB(title, null);
        }
    }

    /**
     * Use this method to broke current LocalDB connection. Moreover,
     * all user action will be saved into LocalDB before it closed.
     */
    function DisconnectDB(){
        if (IsTrue(FindDB(db.Name))){
            db.Data = [];
            db.DisplayMessages = true;
            db.Name = null;
            _info.Disconnected();
        } else {
            _info.NotConnected();
        }
    }

    /**
     * Show status messages in user's browser console if true.
     * You may change that attribute whenever you need throughout current connection.
     * However, it will be returned to the default value after each connection into the module.
     * @param bool {Boolean}
     */
    function DisplayMessages(bool){
        db.DisplayMessages = bool;
    }

    /**
     * Remove LocalDB via received Name
     */
    function DropDB(title){
        if (IsTrue(FindDB(title))){
            storage.removeItem(title);
            info('LocalDB \ ' + title + '\' has been completely removed from the storage.');
        } else {
            _info.NotFound(title);
        }
    }

    /**
     * Set specific LocalDB with default Data into the major storage
     * @param title {String}
     * @param obj {Object}
     */
    function EstablishLocalDB(title, obj){
        var tempObj = FillDBProps(title, obj);
        storage.setItem(title, JSON.stringify(tempObj));
        info('LocalDB \'' + title + '\' has been successfully created.');
    }

    /**
     * Write into the concrete object specific properties.
     * It behaviour may be initialized into the current LocalDB or into another Object.
     * @param title {String}
     * @param receivedObj {Object}
     * @returns {Object}
     * @constructor
     */
    function FillDBProps(title, receivedObj){
        var obj = receivedObj || {};
        obj.Name = title;
        obj.Type = 'localDB';
        obj.Data = [];
        obj.Created = TransformDateToString(new Date);
        obj.LastTimeUsed = TransformDateToString(new Date);
        return obj;
    }

    /**
     * Get exists collection of LocalDB's at the common user storage.
     * If nothing is found, return null.
     * @returns {Array}
     */
    function GetAll(){
        var temp = [], len = storage.length, item;
        for (var i=0; i<len; i++) {
            item = JSON.parse(storage.getItem(storage.key(i)));
            if (item.hasOwnProperty('Type') && item.Type == "localDB") {
                temp.push(item);
            }
        }
        return temp.length > 0 ? temp : null;
    }

    /**
     * Return Data for current LocalDB if it exists in the storage and has user connection.
     * @returns {*}
     */
    function GetData(){
        return IsTrue(db.Name) ? db.Data : null;
    }

    /**
     * Show information about current LocalDB.
     * Of course you have to be connected to the specific LocalDB.
     * @returns {Object} | String}
     * @constructor
     */
    function GetInfo(){
        return IsTrue(db.Name) ? db : _info.NotConnected();
    }

    /**
     * Return false if Boolean transform equals 0
     * @param param
     * @returns {boolean}
     * @constructor
     */
    function IsFalse(param){
        return Boolean(param) == false;
    }

    /**
     * Return true if Boolean transform equals 1
     * @param param
     * @returns {boolean}
     * @constructor
     */
    function IsTrue(param){
        return Boolean(param) == true;
    }

    /**
     * Return localDB if exists
     * @param title
     * @returns {string|null}
     * @constructor
     */
    function FindDB(title){
        return JSON.parse(storage.getItem(title)) || null;
    }

    /**
     * Delete exists key from the Data within current LocalDB.
     * If you want to delete another item in another LocalDB,
     * use '.connect' method.
     * @param title {String}
     */
    function RemoveValue(title){
        if (IsTrue(db.Name)){
            db.Data.forEach(function(i, index){
                if (i.Name == title) {
                    db.Data.splice(index,1);
                }
            });
            Save();
        }
    }

    /**
     * Clear Data for current LocalDB and save changes.
     * @param existsDB
     */
    function ResetDBValues(existsDB){
        existsDB.Data = [];
        existsDB.LastTimeUsed = TransformDateToString(new Date);
        Save();
    }

    /**
     * Save changes inside current LocalDB into the common storage.
     */
    function Save(data){
        if (IsFalse(data)) {
            db.LastTimeUsed = TransformDateToString(new Date);
            storage.setItem(db.Name, JSON.stringify(db));
        } else {
            data.LastTimeUsed = TransformDateToString(new Date);
            storage.setItem(db.Name, JSON.stringify(data));
            for (var key in data) {
                if (data.hasOwnProperty(key)) {
                    db[key] = data[key];
                }
            }
        }
    }

    /**
     * Initialize new property into the specific LocalDB ('db' variable)
     * @param title {String}
     * @param value {String|Number|Object|Array}
     */
    function SetValue(title, value){
        var result, status;
        if (IsTrue(db)){
            result = JSON.parse(storage.getItem(db.Name));
            status = result.Data.some(function(i){
                return i.Name == title;
            });
            IsFalse(status) && result.Data.push({
                Name: title,
                Value: value
            });
            Save(result);
        }
    }

    /**
     * Transform Date-object into readable string format
     * @param date {Date}
     * @returns {String}
     * @constructor
     */
    function TransformDateToString(date){
        var yyyy = date.getFullYear().toString(),
            mm = (date.getMonth()+1).toString(),
            dd  = date.getDate().toString(),
            h = (date.getHours().toString()),
            m = (date.getMinutes().toString()),
            s = (date.getSeconds().toString()),
            p1, p2;

        p1 = [yyyy, mm[1]?mm:"0"+mm[0], dd[1]?dd:"0"+dd[0]].join('-');
        p2 = [h[1]?h:"0"+h[0], m[1]?m:"0"+m[0], s[1]?s:"0"+s[0]].join(':');

        return p1.concat(' ', p2);
    }


    /****
     **** Notification methods ****
     ****/
    _info = {
        Cleared: function(){
            db.DisplayMessages && info('LocalDB has been cleared and ready to insert new values.');
        },
        Disconnected: function(){
            db.DisplayMessages && info('You have been successfully disconnected.');
        },
        NotConnected: function(){
            db.DisplayMessages && error('You don\'t have connection wih any LocalDB. Use .connect method to start work.');
        },
        NotFound: function(title){
            db.DisplayMessages && warn('LocalDB with name \'' + title + '\' doesn\'t exist. Use .create method to make a new LocalDB.');
        }
    };

    function error(text){
        console.error(text);
    }
    function info(text){
        console.info(text);
    }
    function warn(text){
        console.warn(text);
    }

});