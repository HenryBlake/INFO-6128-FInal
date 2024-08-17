import dbOnline from './firebaseDB.js';
import dbOffline from './indexDB.js'

/**
 * MusicDB API for using cloud or local DB.
 */
class CatDB {
    constructor() {
        this.dbOnline = dbOnline;
        this.dbOffline = dbOffline;
        this.swController = null;
        this.swRegistration = null;
    }

    open() {
        return new Promise((resolve, reject) => {
            if ('serviceWorker' in navigator) {
                navigator.serviceWorker.ready.then((registration) => {
                    if ('active' in registration && 'sync' in registration) {
                        this.dbOffline.open()
                            .then(() => {
                                this.swController = registration.active;
                                this.swRegistration = registration;
                                this.dbOnline.open().then(resolve).catch(reject);
                            }).catch(() => {
                                this.dbOnline.open().then(resolve).catch(reject);
                            })
                    } else {
                        this.dbOnline.open().then(resolve).catch(reject);
                    }
                });
            } else {
                this.dbOnline.open().then(resolve).catch(reject);
            }

        });
    }

    add(catData) {
        console.log("Start add data:",catData);
        if (navigator.onLine) {
             this.dbOnline.firebaseWrite(catData);
             console.log("add to firebase:",catData);
        } else {
            this.swRegistration.sync.getTags()
                .then((tags) => {
                    if (!tags.includes('add-cat')) {
                        this.swRegistration.sync.register('add-cat');
                    }
                });

             this.dbOffline.addIndexDB(catData);
             console.log("add to indexDB:",catData);
        }
    }

    getAll() {
        if (navigator.onLine) {
            return this.dbOnline.getAll();
        } else {
            return new Promise((resolve, reject) => {
                reject('You must be connected to the web to get the data');
            })
        }
    }

    get(id) {
        console.log('Music get:', id);
    }

    getByArtist(artist) {
        console.log('Music getByArtist:', artist);
    }

    update(updatedMusic) {
        console.log('Music update:', updatedMusic);
    }

    delete(id) {
        console.log('Music delete:', id);
    }
}

export default new CatDB();
