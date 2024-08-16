//Rigester Service Worker
regiServiceW();
//General ref of database
var dbRef;
var localData;
let localDB;
let reg;
//IndexDB prepare part
const myIndexDB = window.indexedDB.open("MyDB", 1);
myIndexDB.onsuccess = (event) => {
  console.log("Build success");
  localDB = myIndexDB.result;
  // console.log(localDB);
};
myIndexDB.onerror = (event) => {
  console.log("Build failed");
};
myIndexDB.onupgradeneeded = (event) => {
  const mydb = event.target.result;
  const objectStore = mydb.createObjectStore("MyCats", { autoIncrement: true });
};
//Start of project
$(document).ready(function () {
  db();
  firebaseReadChanges();
  clicks();
  catId();
  searchBar();
  $("#defultP").hide();
  getBattery();
  // const url = catId();
});
//Ask user's permission.
window.onload = () => {
  checkPermission();
  readySW();
};
//Import firebase config here.
const db = () => {
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyCA0pyxRhCJHTas6lUvydkB7L1kBJiDYQs",
    authDomain: "info-6128-e3339.firebaseapp.com",
    projectId: "info-6128-e3339",
    storageBucket: "info-6128-e3339.appspot.com",
    messagingSenderId: "236321873138",
    appId: "1:236321873138:web:d07724b5701c7b3448c46b",
    measurementId: "G-8F04ZSLQF6",
  };
  firebase.initializeApp(firebaseConfig);
  const myDb = firebase.firestore();
  dbRef = myDb.collection("Project");
};
//All clicks are here
const clicks = () => {
  const submitBtn = document.getElementById("submitBtn");
  submitBtn.addEventListener("click", () => {
    getInput();

    // console.log("Submitsted");
  });
  const localBtn = document.getElementById("getLocal");
  localBtn.addEventListener("click", () => {
    pushNotification(
      "We are getting your location",
      "Please wait until locations shows."
    );
    // console.log("Location btn clicked");
    getLocation();
  });
};

//Registert service worker.
function regiServiceW() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("/service-worker.js", { scope: "/" })
      .then(function (Registration) {
        console.log("Registration successful. Scope is :", Registration.scope);
      })
      .catch(function (error) {
        console.log("Registration failed Error:", error);
      });
  }
}
function readySW() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.ready
      .then((Registration) => {
        if ("active" in Registration && "sync" in Registration) {
          // console.log("OffLine now")
          reg = Registration;
        } else {
          console.log("cant get registration");
        }
      })
      .catch(function (error) {
        console.log("Ready failed Error:", error);
      });
  }
}
//Check if permission is granted.（Using Notification API)
function checkPermission() {
  if (Notification.permission === "granted") {
    $("#setting_btn").hide();
    // $(".left").hide();
  } else {
    $("#setting_btn").click(function (e) {
      e.preventDefault();
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          $("#setting_btn").hide();
          // $(".left").hide();
          // location.reload();
        } else {
          console.log("not granted");
        }
      });
    });
  }
}
function pushNotification(title, body) {
  const options = {
    body: body,
  };
  navigator.serviceWorker.ready.then((registration) => {
    registration.showNotification(title, options);
  });
}
//Append list
function appendList(pageid, item) {
  $(`<ons-list-item>${item.val().name}  ${item.key}</ons-list-item>`).appendTo(
    pageid
  );
  console.log("Successfully append");
}
//Firebase functions,use Firestore database.

//Get what users input
function getInput() {
  // dbRef.set({
  var name = $("#catName").val();
  var age = $("#catAge").val();
  var birthday = $("#catBirthday").val();
  var favFood = $("#catFood").val();
  var location = localData;
  // var isVac = $("#isVac").val();
  var isHungry = false;

  if (name === "" || age === "" || birthday === "" || favFood === "") {
    alert("You need fill all info");
  } else {
    if (location == undefined) {
      // console.log(location);
      location = "unknow";
      var catObj = {
        name: name,
        age: age,
        birthday: birthday,
        favFood: favFood,
        location: location,
        // isVac: isVac,
        isHungry: false,
      };
      firebaseWrite(catObj);
      addIndexDB(catObj);
    } else {
      var catObj = {
        name: name,
        age: age,
        birthday: birthday,
        favFood: favFood,
        location: location,
        isHungry: false,
      };
      firebaseWrite(catObj);
      addIndexDB(catObj);
    }
  }
  // });
}
//DB wirte
function firebaseWrite(catobj) {
  if (navigator.onLine) {
    dbRef.add(catobj);
  } else {
    addIndexDB(catobj);
    console.log("reg:", reg);
    if (reg) {
      reg.sync.getTags().then((tags) => {
        if (!tags.includes("add-cats")) {
          console.log("get tags");
          reg.sync.register("add-cats");
          
        }
      });
      console.log("Cant save online");
    }
  }
}
function firebaseDelete() {}
function firebaseReadOnce() {
  dbRef.get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      const catData = doc.data();
      appendListCats(catData);
      // console.log(doc.data())
    });
  });
}
function firebaseReadChanges() {
  dbRef.onSnapshot((querySnapshot) => {
    querySnapshot.docChanges().forEach((change) => {
      if (change.type === "added") {
        // console.log(change.doc.data());
        const newCat = change.doc.data();
        appendListCats(newCat);
      }
    });
  });
}
function appendListCats(data) {
  $(`<ons-card class="MyCats">
      <p>Name:${data.name}</p><br>
      <p>Location:${data.location}</p>
      </ons-card>`).appendTo("#myList");
}
//TODO:Use api to get all cats,still you can create your own cat,and check your cat,location,when you click the cat,you will get a notification:the fav food.
//Gelocation API
function getLocation() {
  function success(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    localData = latitude + "," + longitude;
    pushNotification("We have got you location,Thanks");
    // console.log("Got", latitude, longitude);
  }
  function failed() {
    console.log("failed");
  }
  const geo = navigator.geolocation;
  console.log(geo.getCurrentPosition(success, failed));
}
//When the battery low it will note you that your cat is hungry rn.
//Battery API?
//Or Accelerometer API?
//Cat API
const catImage = () => {
  const headers = new Headers({
    "Content-Type": "application/json",
    "x-api-key":
      "live_vQ3W6vgLE3H2BY1vuXj4oSi6AEXsMhGEzmDpssTMWO9uh6RdMSKMNiKGEfMGmFwU",
  });
  var requestOptions = {
    method: "GET",
    headers: headers,
    redirect: "follow",
  };
  fetch("https://api.thecatapi.com/v1/images/search?limit=1", requestOptions)
    .then((response) => {
      return response.url;
    })
    .catch((error) => console.log("error", error));
};

const catId = () => {
  const headers = new Headers({
    "Content-Type": "application/json",
    "x-api-key":
      "live_vQ3W6vgLE3H2BY1vuXj4oSi6AEXsMhGEzmDpssTMWO9uh6RdMSKMNiKGEfMGmFwU",
  });
  var requestOptions = {
    method: "GET",
    headers: headers,
    redirect: "follow",
  };
  fetch("https://api.thecatapi.com/v1/images/search?limit=10", requestOptions)
    .then((response) => response.text())
    .then((result) => JSON.parse(result))
    .then((josnresult) => {
      for (i = 0; i < 10; i++) {
        catJson(josnresult[i].id, requestOptions);
      }
      // console.log(josnresult)
    })
    .catch((error) => console.log("error", error));
};
const catJson = (id, requestOptions) => {
  fetch(`https://api.thecatapi.com/v1/images/${id}`, requestOptions)
    .then((response) => response.text())
    .then((result) => JSON.parse(result))
    .then((catJson) => {
      appendHome(catJson.url, catJson);
      // console.log(catJson);
    })
    .catch((error) => console.log("error", error));
};
//Data means cat json with unique id
function appendHome(imgUrl) {
  $(`<img class="main_images" src=${imgUrl} style="width: 100%">`).appendTo(
    "#home_ons_page"
  );
}

//Search function
const searchCat = (breed_id) => {
  const headers = new Headers({
    "Content-Type": "application/json",
    "x-api-key":
      "live_vQ3W6vgLE3H2BY1vuXj4oSi6AEXsMhGEzmDpssTMWO9uh6RdMSKMNiKGEfMGmFwU",
  });
  var requestOptions = {
    method: "GET",
    headers: headers,
    redirect: "follow",
  };
  fetch(
    `https://api.thecatapi.com/v1/images/search?breed_id=${breed_id}`,
    requestOptions
  )
    .then((response) => response.text())
    .then((result) => JSON.parse(result))
    .then((josnresult) => {
      if (josnresult.length === 0) {
        $(".main_images").hide();
        console.log("no result ");
        appendErr("no result");
      } else {
        $(".main_images").hide();
        $(".errP").hide();
        appendHome(josnresult[0].url);
        // console.log(josnresult);
      }
    })
    .catch((error) => {
      appendErr(error);
      console.log("error", error);
      // console.log("error", error);
    });
};
//When user search cat
const searchBar = () => {
  $("#searchInput").change(function (e) {
    e.preventDefault();
    // console.log($(this).val());
    if ($(this).val() === "") {
      $(".errP").hide();
      catId();
    } else {
      searchCat($(this).val());
    }
  });
};
//Append all the error to home page
function appendErr(err) {
  $(`<p class="errP">${err}</p>`).appendTo("#home_ons_page");
}
//Add data to indexDB
const addIndexDB = (catData) => {
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
//Battery API
const getBattery = () => {
  navigator.getBattery().then(function (battery) {
    // console.log(battery.level)
    if (battery.level < 1) {
      pushNotification(
        "YOUR CATS are HUNGRY",
        `Your battery now is ${
          battery.level * 100
        }%,feed them by charging your phone.`
      );
    }
  });
};
