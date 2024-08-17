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
                const request = indexedDB.open('MyDB', 1);//databaseName,version

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

                    const objectStore = db.createObjectStore('MyCats', { keyPath: 'id' });

                }



            } else {
                reject("Your browser doesn't support IndexedDB");
            }

        }
        );
    }

    //Add data to indexDB
    addIndexDB(catData) {
        return new Promise((resolve, reject) => {
            if (!this.isAvailable) {
                reject('Database not opened!')
            }
            console.log("start insert into indexDB:", catData);

            const transaction = this.db.transaction(["MyCats"], "readwrite");
            transaction.onerror = (event) => {
                console.log('[Transaction] Error:', event);
                return;
            };
            const objectStore = transaction.objectStore("MyCats");
            const request = objectStore.add(catData);

            request.onerror = (event) => {
                reject(event.target.error.message);
            }

            request.onsuccess = (event) => {
                resolve();
            }
        })
    };


    getAll() {
        return new Promise((resolve, reject) => {
            if (!this.isAvailable) {
                reject('Database not opened!')
            }

            //Transaction handles
            const transaction = this.db.transaction(['MyCats'], 'readonly');
            transaction.onerror = (event) => {
                console.log('Error:', error);
                reject(event.target.error.message);
            }

            //Store handles
            const store = transaction.objectStore('MyCats');
            const request = store.getAll();

            request.onerror = (event) => {
                reject(event.target.error.message);
            }

            request.onsuccess = (event) => {
                resolve(event.target.result);
            }

        })

    }

    //delete 
    delete(id) {
        return new Promise((resolve, reject) => {
            if (!this.isAvailable) {
                reject('Database not opened!');
            }

            //Transaction handles
            const transaction = this.db.transaction(['MyCats'], 'readwrite');
            transaction.onerror = (event) => {
                reject(event.target.error.message);
            }

            //Get the store
            const store = transaction.objectStore('MyCats');
            const request = store.delete(id);

            request.onerror = (event) => {
                reject(event.target.error.message);
            }

            request.onsuccess = (event) => {
                resolve();
            }

        })
    }

}

//export a instance of the MusicDB， use lowercase for the first letter of the instance name
export default new CatDB();