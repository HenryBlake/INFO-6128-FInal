
class MusicDB {
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
                //Syntax 1
                // this.dbOnline.open()
                //     .then(() => { resolve() })
                //     .catch((error) => { reject(error) });
                //Syntax 2
                this.dbOnline.open().then(resolve).catch(reject);
            }

        });
    }

    add(title, artist, hasFinished) {
        if (navigator.onLine) {
            return this.dbOnline.add(title, artist, hasFinished);
        } else {
            this.swRegistration.sync.getTags()
                .then((tags) => {
                    if (!tags.includes('add-music')) {
                        this.swRegistration.sync.register('add-music');
                    }
                });

            return this.dbOffline.add(title, artist, hasFinished);
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

export default new MusicDB();
