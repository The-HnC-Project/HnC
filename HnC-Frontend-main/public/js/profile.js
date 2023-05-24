const user = JSON.parse(localStorage.getItem("user"));
if (!user) {
    window.location.href = "./login.html";
}
document.addEventListener("DOMContentLoaded", () => {
    const error = document.getElementById("error");
    error.style.height = "0px";
    error.style.top = "-30px";

    const profile = document.getElementById("profileAvatar");
    if (user.hasProfile) {
        profile.src = "https://pancham1305-proxy.deno.dev/images/" + user.uid;
    }
});
const center = document.querySelector("#center1");
const body = document.querySelector("body");

const hidid = document.getElementById("hidid");
hidid.value = user.uid;

const cardCreation = (data) => {
    //Hospital Name
    const mainDiv = document.createElement("div");
    mainDiv.classList.add("MedicalDet");
    const div = document.createElement("div");
    const h3 = document.createElement("h3");
    h3.innerText = `${data.hospital}`;
    div.appendChild(h3);
    mainDiv.appendChild(div);
    // Type: TypeValue
    const div1 = document.createElement("div");
    div1.classList.add("name");
    const divpart1of2 = document.createElement("div");
    divpart1of2.classList.add("part2");
    divpart1of2.innerHTML = `${data.type}: ${data.typeValue}`;
    const divpart2of2 = document.createElement("div");
    divpart2of2.classList.add("part2");
    divpart2of2.innerHTML = `<section>${
        data.date === "NaN" ? "NaN" : new Date(data.date).toLocaleString()
    }</section><section class="currency">${data.payment}Rs</section>`;

    div1.appendChild(divpart1of2);
    div1.appendChild(divpart2of2);
    mainDiv.appendChild(div1);
    center.appendChild(mainDiv);
};
const center2 = document.querySelector("#center2");
const cardCreation2 = (data) => {
    //Hospital Name
    const mainDiv = document.createElement("div");
    mainDiv.classList.add("MedicalDet");
    const div = document.createElement("div");
    const h3 = document.createElement("h3");
    h3.innerText = `${data.hospital}`;
    div.appendChild(h3);
    mainDiv.appendChild(div);
    // Type: TypeValue
    const div1 = document.createElement("div");
    div1.classList.add("name");
    const divpart1of2 = document.createElement("div");
    divpart1of2.classList.add("part2");
    divpart1of2.innerHTML = `${data.type}: ${data.typeValue}`;
    const divpart2of2 = document.createElement("div");
    divpart2of2.classList.add("part2");
    divpart2of2.innerHTML = `<section>${
        data.date === "NaN" ? "NaN" : new Date(data.date).toLocaleString()
    }</section><section class="currency">${data.payment}Rs</section>`;

    div1.appendChild(divpart1of2);
    div1.appendChild(divpart2of2);
    mainDiv.appendChild(div1);
    center2.appendChild(mainDiv);
};

body.classList.add("hide");
const getProfileData = async () => {
    if (user) {
        body.classList.remove("hide");
        showdata(user);
    } else {
        // sendError("Please login to continue");
        window.location.href = "./login.html";
    }
};

const showdata = (profileData) => {
    let data = profileData;
    console.log(data);
    const username = data.username;
    let age = data.age;
    let bloodGroup = data.bloodgroup;
    const phone = data.phone;
    if (age == undefined) {
        age = "Not Available";
    }
    if (bloodGroup == undefined) {
        bloodGroup = "Not Available";
    }
    document.getElementById("username").innerHTML = username;
    document.getElementById("age").innerHTML = age;
    document.getElementById("bloodGroup").innerHTML = bloodGroup;
    document.getElementById("phone").innerHTML = phone;
    if (data.medHistory?.length) {
        data.medHistory.forEach((e) => {
            cardCreation(e);
        });
    } else {
        cardCreation({
            hospital: "No hospitals visited yet...",
            payment: "-",
            type: "-",
            typeValue: " ",
            date: "NaN",
        });
    }
    console.log(data.username);
    if (data.appointments?.length) {
        data.appointments?.reverse()?.forEach((e) => {
            cardCreation2(e);
        });
    } else {
        data = {
            hospital: "No appointments yet...",

            payment: "-",
            type: "-",
            typeValue: " ",
            date: "NaN",
        };
        cardCreation2(data);
    }
};
getProfileData();
const btn = document.getElementById("logout");
btn.addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "./login.html";
});
function sendError(msg) {
    const error = document.getElementById("error");
    error.style.height = "";
    error.style.top = "";
    error.innerHTML += `<div class='etext'>${msg}</div>`;
}
document.addEventListener("click", (e) => {
    if (e.target.id !== "closeerrorbtn") return;
    const error = document.getElementById("error");
    error.innerHTML =
        '  <div class="closebtn" id="closeerrorbtn">&times;</div>';
    error.style.height = "0px";
    error.style.top = "-30px";
});

// Main div => div => Heading
// Main Div => div.name => 2*div.part2
// 1st div.part2 => innerText: Type:Typevalue
// 2nd div.part2 => 2*section
// 1st section => innerText:Date-Time
// 2nd section.currency: Payment

const img = document.getElementById("img");
const btnup = document.getElementById("Upload");
const imgupload = document.getElementById("imgupload");
const profile = document.getElementById("profileAvatar");
if (user.uid === "0".repeat(64)) {
    imgupload.remove();
}
btnup.addEventListener("click", async (e) => {
    e.preventDefault();
    const hidid = document.getElementById("hidid");
    const formData = new FormData(imgupload);
    formData.append("phone", user.phone);
    formData.append("endpoint", "/api/upload");
    btnup.textContent = "Uploading...";
    let url = "https://pancham1305-proxy.deno.dev/";
    const { imgLink, hasProfile } = await fetch(url, {
        method: "POST",
        body: formData,
        headers: {
            "x-uid": hidid.value,
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
    }).then((e) => e.json());
    console.log(imgLink);
    user.hasProfile = hasProfile;

    localStorage.setItem("user", JSON.stringify(user));
    profile.src = "../images/guestlogo.jpg";
    setTimeout(() => {
        btnup.textContent = "Done";
        profile.src = imgLink;
        window.location.reload();
    }, 1000);
});
const login = document.getElementById("login");
if (user) {
    login.innerHTML = `${user.username}
            <span class="material-symbols-outlined" id="loginicon">
              login
            </span>`;
}

const actualBtn = document.getElementById("img");

const fileChosen = document.getElementById("file-chosen");

actualBtn.addEventListener("change", function () {
    fileChosen.textContent = this.files[0].name;
});
