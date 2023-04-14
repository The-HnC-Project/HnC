/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */

document.addEventListener("DOMContentLoaded", async () => {
    const drop = document.getElementById("dropbtn");
    const s = document.querySelector(".search");
    drop.innerHTML = `${cities
        .map((city) => `<option class="links">${city.name}</option>`)
        .join("\n")}`;

    if (localStorage.getItem("searchinfo")) {
        const { name, query, selectedIndex } = JSON.parse(
            localStorage.getItem("searchinfo"),
        );
        console.log(name, query, selectedIndex);
        s.value = query;
        console.log(drop.selectedIndex);
        drop.selectedIndex = selectedIndex;
        document.getElementById("btn").click();
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
        },
    );
});

// Fetch Hospital Details

var requestOptions = {
    method: "GET",
};
// DOM Variables
const loader = document.querySelector(".loaderContainer");
const body = document.querySelector(".hospitals");
const drop = document.getElementById("dropbtn");
const s = document.querySelector(".search");
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
            x.name === exactloc.features[0].properties.state_district,
    );
    drop.selectedIndex = ind;
    let place_id = exactloc.features[0].properties.place_id;
    let url = `https://pancham1305-proxy.deno.dev/`;
    const Hosinfo = await fetch(url, {
        method: "POST",
        body: JSON.stringify({ place_id, endpoint: "/api/hospitals"}),
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
    let url = `https://pancham1305-proxy.deno.dev/`;
    const info = await fetch(url, {
        method: "POST",
        body: JSON.stringify({ city: b, query: a, endpoint: "/api/search/" }),
        headers: {
            "Content-Type": "application/json",
        },
    }).then((e) => e.json());
    console.log(info);
    info.results = info.results
        .filter((x) => x.city === drop.options[drop.selectedIndex].value)
        .sort((a, b) => b.rating - a.rating);
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
    const params = {
        cityname: drop.options[drop.selectedIndex].value,
        query: s.value,
    };
    const info = await search(params.query, params.cityname);
    console.log(info.results);
    collection.innerHTML = "";
    for (let i of info.results) {
        console.log(i);
        newCardCreation(i);
    }
    loader.classList.add("hide");
    body.classList.remove("hide");
});

const cardCreation = (name, address, id) => {
    console.log(name, address, id);
    const div = document.createElement("div");
    div.classList.add("card");
    const div2 = document.createElement("div");
    div2.classList.add("finfo");
    const div3 = document.createElement("div3");
    div3.classList.add("image");
    const div4 = document.createElement("div");
    div4.classList.add("top");
    const h4 = document.createElement("h4");
    const b = document.createElement("b");
    const p = document.createElement("p");
    const br = document.createElement("br");
    const span = document.createElement("span");
    const spanI = document.createElement("spanI");
    const spanII = document.createElement("spanII");
    const spanIII = document.createElement("spanIII");
    const spanIV = document.createElement("spanIV");
    span.classList.add("material-symbols-outlined");
    span.id = "star";
    span.innerText = "star";
    spanI.classList.add("material-symbols-outlined");
    spanI.id = "star";
    spanI.innerText = "star";
    spanII.classList.add("material-symbols-outlined");
    spanII.id = "star";
    spanII.innerText = "star";
    spanIII.classList.add("material-symbols-outlined");
    spanIII.id = "star";
    spanIII.innerText = "star";
    spanIV.classList.add("material-symbols-outlined");
    spanIV.id = "star";
    spanIV.innerText = "star";
    const div5 = document.createElement("div");
    div5.classList.add("bottom");
    const p2 = document.createElement("p");
    p2.innerHTML = "<b>Rating:</b>";
    const btn = document.createElement("button");
    const span2 = document.createElement("span");
    span2.innerText = "Status";
    const img = document.createElement("img");
    img.src = "../images/hospital-1.jpg";
    div3.appendChild(img);
    b.innerText = name;
    h4.appendChild(b);
    p.appendChild(br);
    p.innerHTML = `<br><b>Address:</b> ${address}`;
    // Insertions Start
    h4.appendChild(b);
    div4.appendChild(h4);
    div4.appendChild(p); //left
    div4.innerHTML += "<br>";
    p2.appendChild(span);
    p2.appendChild(spanI);
    p2.appendChild(spanII);
    p2.appendChild(spanIII);
    p2.appendChild(spanIV);
    div4.appendChild(p2);
    btn.appendChild(span2);
    div5.appendChild(btn);
    div.appendChild(div3);
    div.appendChild(div2);
    div2.appendChild(div4);
    div2.appendChild(div5);
    collection.appendChild(div);
    const form = document.createElement("form");
    form.method = "GET";
    form.action = "/hospital";
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = "id";
    input.value = id.iv;
    form.appendChild(input);
    div.appendChild(form);
};

const newCardCreation = (data) => {
    const con = document.createElement("a");
    con.classList.add("card");
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

    con.href = `./hospital.html?id=${data.sig.iv}:${data.sig.data}`;

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
