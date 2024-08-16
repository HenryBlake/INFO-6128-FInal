class CatDB {
    constructor() {
        this.db = null;
        this.isAvailable = false;
    }


    open() {
        return new Promise((resolve, reject) => {
            //validates whether the indexedDB onject is available
            if (indexedDB) {
                //Can not back to the previous database version
                const request = indexedDB.open('Music', 1);//databaseName,version

                //Handles the error when opening/creating the database
                request.onerror = (event) => {
                    reject(event.target.error.message);
                }

                //Handles the success when opening/creating the database
                request.onsuccess = (event) => {
                    //save the IDBDatabase interface
                    const db = event.target.result;
                    if (db) {
                        this.db = db;
                        this.isAvailable = true;
                        resolve();
                    } else {
                        reject('The database is not available');
                    }
                }

                //Handle the database upgrade
                request.onupgradeneeded = (event) => {
                    const db = event.target.result;

                    const objectStore = db.createObjectStore('MusicList', { keyPath: 'id' });

                    //Creates the indexs
                    objectStore.createIndex('title', 'title');
                    objectStore.createIndex('artist', 'artist');


                }



            } else {
                reject("Your browser doesn't support IndexedDB");
            }

        }
        );
    }

    //Add data to indexDB
    addIndexDB(catData) {
        const transaction = localDB.transaction(["MyCats"], "readwrite");
        transaction.oncomplete = (event) => {
            console.log("save success", event);
        };
        transaction.onerror = (event) => {
            console.log("Failed to save", event);
        };
        const objectStore = transaction.objectStore("MyCats");
        const request = objectStore.add(catData);
    };

    //delete 
    

}

//export a instance of the MusicDB， use lowercase for the first letter of the instance name
export default new CatDB();