class MyDB {
  constructor() {
    this.myIndexDB = null;
    this.localDB=null;
    this.myDB=null;
    this.swRegistration = null;
    this.objectStore=null;
    this.transaction=null;
  }
  create() {
    this.myIndexDB = window.indexedDB.open("MyDB", 1);
    this.myIndexDB.onsuccess = (event) => {
      console.log("Build success");
    localDB = myIndexDB.result;
      // console.log(localDB);
    };
    this.myIndexDB.onerror = (event) => {
      console.log("Build failed");
    };
    this.myIndexDB.onupgradeneeded = (event) => {
      this.mydb = event.target.result;
        this. objectStore = this.mydb.createObjectStore("MyCats", {
        autoIncrement: true,
      });
    };
  }
  add(catData){
    this.transaction =this.localDB.transaction(["MyCats"], "readwrite");
    this.transaction.oncomplete = (event) => {
      console.log("save success", event);
    };
    this.transaction.onerror = (event) => {
      console.log("Failed to save", event);
    };
    this.objectStore = transaction.objectStore("MyCats");
    const request = objectStore.add(catData);
  }
  open(catData) {
    return new Promise((resolve, reject) => {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.ready.then((registration) => {
                if ('active' in registration && 'sync' in registration) {
                    this.myDB().open()
                        .then(() => {
                            this.swRegistration = registration;
                            this.add(catData)
                        }).catch(() => {
                            console.log("Failed")
                        })
                } else {
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
}

export default new MyDB();
