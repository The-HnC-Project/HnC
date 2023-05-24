/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */
const changetype = document.getElementById("changetype");
console.log(changetype.innerText);
let currentType = "cities";
const inputs = document.getElementById("input");
// document.addEventListener("DOMContentLoaded", async () => {
const drop = document.getElementById("dropbtn");
const s = document.querySelector(".search");
document.addEventListener("DOMContentLoaded", async () => {
  drop.innerHTML = `${cities
    .map((city) => `<option class="links">${city.name}</option>`)
    .join("\n")}`;
  //
  if (localStorage.getItem("searchinfo")) {
    let { name, query, selectedIndex } = JSON.parse(
      localStorage.getItem("searchinfo")
    );
    console.log(name, query, selectedIndex);
    s.value = query;
    // drop.options.findIndex((x) => {
    //   name == x;
    // })
    drop.selectedIndex = selectedIndex;
    // document.getElementById("btn").click();
    query = !query ? "hospital" : query;
    const info = await search(query, name);
    collection.innerHTML = "";
    for (let i of info.results) {
      console.log(i);
      newCardCreation(i);
    }
    loader.classList.add("hide");
    localStorage.removeItem("searchinfo");
  }
});
// Filter Box JS

var button = document.getElementById("filter-button");
var container = document.getElementById("filter-container");
var input = document.querySelectorAll("input");

button.onclick = function (e) {
  e.stopPropagation();
  if (container.classList.contains("filters--active")) {
    container.classList.remove("filters--active");
  } else {
    container.classList.add("filters--active");
  }
};

container.onclick = function (e) {
  e.stopPropagation();
};

window.onclick = function () {
  container.classList.remove("filters--active");
};

console.log(input);

for (var i = 0; i < input.length; i++) {
  var currentInput = input[i];

  currentInput.onclick = function () {
    var isChecked = false;
    for (var j = 0; j < input.length; j++) {
      if (input[j].checked) {
        isChecked = true;
        break;
      }
    }

    if (isChecked) {
      button.classList.add("button--highlight");
    } else {
      button.classList.remove("button--highlight");
    }
  };
}

const getLoc = new Promise((res, rej) => {
  navigator.geolocation.getCurrentPosition(
    (e) => {
      res(e);
    },
    (e) => {
      rej("Location Access Denied With Error: " + e.message);
    }
  );
});

// Fetch Hospital Details

var requestOptions = {
  method: "GET",
};
// DOM Variables
const loader = document.querySelector(".loaderContainer");
const body = document.querySelector(".hospitals");
// const drop = document.getElementById("dropbtn");
// const s = document.querySelector(".search");
const btn1 = document.getElementById("btn");
const collection = document.querySelector(".collection");
// Functional Programming Starts
// Hospital info Extraction
let data = [];
const info = async () => {
  // User location
  const dt = await getLoc.catch((e) => {
    collection.innerText = e;
  });

  if (!dt) {
    return;
  }

  let lat = dt.coords.latitude;
  let long = dt.coords.longitude;
  // Reverse geocoding => Finding place_id
  const exactloc = await fetch(`https://pancham1305-proxy.deno.dev/`, {
    method: "POST",
    body: JSON.stringify({ lat, long, endpoint: "/api/userLoc" }),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((r) => r.json());
  // console.log(exactloc);
  let ind = cities.findIndex(
    (x) =>
      x.name === exactloc.features[0].properties.city ||
      x.name === exactloc.features[0].properties.county ||
      x.name === exactloc.features[0].properties.state_district
  );
  drop.selectedIndex = ind;
  let place_id = exactloc.features[0].properties.place_id;
  let url = `https://pancham1305-proxy.deno.dev/`;
  const Hosinfo = await fetch(url, {
    method: "POST",
    body: JSON.stringify({ place_id, endpoint: "/api/hospitals" }),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((e) => e.json());
  console.log(Hosinfo, "a");
  let i = 0;
  Hosinfo.features = Hosinfo.features.sort((a, b) => b.rating - a.rating);
  Hosinfo.features = [
    ...Hosinfo.features.filter((x) => x.status === "Available"),
    ...Hosinfo.features.filter((x) => x.status !== "Available"),
  ];

  Hosinfo.features.forEach((e) => {
    console.log(e);
    newCardCreation({ ...e.properties, ...e });
    i++;
  });
};

// Function for loader
let executed = true;
const loadData = async () => {
  loader.classList.remove("hide");
  body.classList.add("hide");
  await info().catch((e) => {
    console.log(e);
    collection.innerText = "Internet issues";
  });
  loader.classList.add("hide");
  body.classList.remove("hide");
  executed = false;
};

if (executed && !localStorage.getItem("searchinfo")) {
  loadData();
}

const search = async (a, b) => {
  // if (localStorage.getItem("searchinfo")) {
  //   b = searchinfo.name;
  //   localStorage.removeItem("searchinfo");
  // }
  // console.log(b);
  let url = `https://pancham1305-proxy.deno.dev/`;
  const info = await fetch(url, {
    method: "POST",
    body: JSON.stringify({ city: b, query: a ,endpoint: "/api/search"}),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((e) => e.json());
    console.log(info);
    console.log(drop.options[drop.selectedIndex].value)
  info.results = info.results
      .filter((x) => {
          if(currentType === 'cities') return x.city?.toLowerCase() === drop.options[drop.selectedIndex].value?.toLowerCase() || x.county?.toLowerCase() === drop.options[drop.selectedIndex].value?.toLowerCase() || x.state_district?.toLowerCase() === drop.options[drop.selectedIndex].value?.toLowerCase();
          else return true;
      })
        .sort((a, b) => b.rating - a.rating);
    console.log(info.results);
  info.results = [
    ...info.results.filter((x) => x.status === "Available"),
    ...info.results.filter((x) => x.status !== "Available"),
  ];
  return info;
};

btn1.addEventListener("click", async (e) => {
  e.preventDefault();
  loader.classList.remove("hide");
    body.classList.add("hide");
        e.preventDefault();
    const info = searchBar.value;

    // const name = drop.options[drop.selectedIndex].text;
    let name;

    if (currentType !== "cities") {
      console.log(inputs.value);
      name = await fetch(
        `https://api.postalpincode.in/pincode/${inputs.value}`
      ).then((res) => res.json());
      console.log(name);
      name = name[0].PostOffice[0].Division;
      // console.log(name);
      // return;
      for (let i = 0; i < drop.options.length; i++) {
        // console.log(drop.options[i].value);
        for (let j = 0; j < drop.options[i].value.length; j++) {
          if (
            drop.options[i].value.includes(
              drop.options[i].value.substr(0, j)
            ) == name
          ) {
            drop.selectedIndex = i;
            console.log(i);
            break;
          }
        }
      }
    } else {
      name = drop.options[drop.selectedIndex].text;
    }
    const query = searchBar.value || "hospital";
    console.log({name, query});
    localStorage.setItem(
      "searchinfo",
      JSON.stringify({ name, query, selectedIndex: drop.selectedIndex })
    );
    const Sinfo = await search(query, name);
    collection.innerHTML = "";
    for (let i of Sinfo.results) {
      console.log(i);
      newCardCreation(i);
    }

  loader.classList.add("hide");
  body.classList.remove("hide");
});

const newCardCreation = (data) => {
  const con = document.createElement("a");
  con.classList.add("card");
  con.classList.add("roll-in-blurred-left");
  con.style.backgroundImage = "url('../images/hospital.avif')";
  con.style.backgroundSize = "cover";
  con.style.backgroundPosition = "center";
  con.style.backgroundRepeat = "no-repeat";
  con.style.width = "300px";
  con.style.height = "480px";
  con.style.borderRadius = "10px";
  collection.appendChild(con);
  const info = document.createElement("div");
  info.classList.add("info");
  info.style.width = "100%";
  info.style.height = "40%";

  if (user) {
    con.href = `./hospital.html?id=${data.sig.iv}:${data.sig.data}`;
  } else {
    con.href = "./login.html";
  }

  const namet = document.createElement("h3");
  namet.innerText = data.name;

  namet.classList.add("name");
  info.appendChild(namet);
  con.appendChild(info);

  const addr = document.createElement("p");
  addr.innerText = data.address_line1 + "\n" + data.address_line2;

  addr.classList.add("address");
  info.appendChild(addr);

  const rating = document.createElement("p");
  rating.classList.add("rating");
  rating.innerText = `Rating: ${data.rating}`;

  rating.classList.add("rating");
  info.appendChild(rating);

  const status = document.createElement("div");
  status.classList.add("status");
  if (data.status === "Unavailable") status.style.backgroundColor = "red";
  status.innerText = data.status;

  con.appendChild(status);
};

const login = document.getElementById("login");

const user = JSON.parse(localStorage.getItem("user"));
if (user) {
  login.innerHTML = `${user.username}
            <span class="material-symbols-outlined" id="loginicon">
              login
            </span>`;
}
login.style.fontSize = "20px";
login.style.flexDirection = "row";
const searchBar = document.querySelector(".search");

if (changetype == "cities") {
  searchBar.addEventListener("input", async () => {
    const query = searchBar.value;
    const name = drop.options[drop.selectedIndex].text;
    console.log(name, query);
    const data = await fetch("https://pancham1305-proxy.deno.dev/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, query, endpoint: "/api/search/auto" }),
    }).then((rs) => rs.json());
    console.log(data);

    const arr = data.features;
    const possible = document.querySelector("#possible");
    possible.innerHTML = "";
    createoptions(arr);
  });
}
// data ko iterate karke daal do option
const createoptions = (arr) => {
  const possible = document.querySelector("#possible");
  for (let i of arr) {
    const option = document.createElement("option");
    option.innerText = `${i.properties.name}`;
    possible.appendChild(option);
  }
};

const change = (e) => {
  e.preventDefault();
  if (currentType === "cities") {
    drop?.classList.add("disable");
    inputs?.classList.remove("disable");
    changetype.innerText = "Search by Cities";
    currentType = "pincode";
    input.value = "";
  } else {
    drop?.classList.remove("disable");
    inputs?.classList.add("disable");
    changetype.innerText = "Search by Pincode";
    currentType = "cities";
  }
};

changetype.addEventListener("click", change);
if (currentType != "cities") {
  const possible = document.querySelector("#possible");
  possible.innerHTML = "";
}
const btn8 = document.querySelector(".searchbtnicon");

// btn8.addEventListener("click", async (e) => {
//     // check if user has disabled location access
//             e.preventDefault();

//         const info = searchBar.value;

//         // const name = drop.options[drop.selectedIndex].text;
//         let name;
//         if (currentType !== "cities") {
//             name = await fetch(
//                 `https://api.postalpincode.in/pincode/${inputs.value}`,
//             ).then((res) => res.json());
//             console.log(name);
//             name = name[0].PostOffice[0].Division;
//             console.log(name);
//             // return;
//             for (let i = 0; i < drop.options.length; i++) {
//                 // console.log(drop.options[i].value);
//                 if (drop.options[i].value.includes(name.split(" ")[0])) {
//                     drop.selectedIndex = i;
//                     console.log(i);
//                     break;
//                 }
//             }
//         } else {
//             name = drop.options[drop.selectedIndex].text;
//         }
//         const query = searchBar.value;
//         console.log(name, query);
//         localStorage.setItem(
//             "searchinfo",
//             JSON.stringify({ name, query, selectedIndex: drop.selectedIndex }),
//         );
//         search(name,query || "hospital");
// });

changetype.addEventListener("click", change);
if (currentType != "cities") {
  const possible = document.querySelector("#possible");
  possible.innerHTML = "";
}
