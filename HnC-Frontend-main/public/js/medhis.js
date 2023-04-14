var testb = document.getElementById("testbox");
var scanb = document.getElementById("scanbox");
var checkupb = document.getElementById("checkupbox");
var testbtn = document.getElementById("test");
var scanbtn = document.getElementById("scan");
var checkupbtn = document.getElementById("checkup");
const loader = document.querySelector(".loaderContainer");
const address = document.querySelector("#address");
const body = document.querySelector("body");
testbtn?.addEventListener("click", async (e) => {
    testb.classList.remove("hide");
    scanb.classList.add("hide");
    checkupb.classList.add("hide");
});

scanbtn?.addEventListener("click", async (e) => {
    scanb.classList.remove("hide");
    testb.classList.add("hide");
    checkupb.classList.add("hide");
});

checkupbtn?.addEventListener("click", async (e) => {
    testb.classList.add("hide");
    checkupb.classList.remove("hide");
    scanb.classList.add("hide");
});

// For Hospital Data
const getData = async () => {
    const a = new URLSearchParams(window.location.search);
    const [b, hospitalinfo] = a.get("id").split(":");

    // localStorage.removeItem("hospitalinfo");
    loader?.classList.remove("hide");
    body?.classList.add("hide");
    const data = await fetch(
        "https://pancham1305-proxy.deno.dev/",
        {
            method: "POST",
            body: JSON.stringify({ hospitalinfo, b, endpoint: "/api/hospital" }),
            headers: {
                "Content-Type": "application/json",
            },
        },
    ).then((r) => r.json());
    const arr = data.split(":");
    console.log(arr);
    showdata(arr);

    loader?.classList.add("hide");
    body?.classList.remove("hide");
};
getData();
const showdata = async (arr) => {
    const name = document.getElementById("name");
    name.innerHTML = arr[0].split(",")[0];
    address.innerHTML = arr[5];
    const rating = document.getElementById("rating");
    rating.innerHTML = `Rating: ${arr[3]}`;
};

const login = document.getElementById("login");

const user = JSON.parse(localStorage.getItem("user"));
if (user) {
    login.innerHTML = `${user.username}
            <span class="material-symbols-outlined" id="loginicon">
              login
            </span>`;
}

const viewmap = document.getElementById("viewmap");

viewmap?.addEventListener("click", async (e) => {
    const id = new URLSearchParams(window.location.search).get("id");
    window.location.href = `./map.html?id=${id}`;
});

const Name = document.getElementById("username");
const age = document.getElementById("age");
const bloodgroup = document.getElementById("bloodgroup");
const phone = document.getElementById("phone");
const type = document.getElementById("type");
const typevalue = document.getElementById("typevalue");

Name.value = user?.username;
age.value = user?.age;
bloodgroup.value = user?.bloodgroup;
phone.value = user?.phone;

type.innerHTML = `
${Object.keys(list)
    .map(
        (x) =>
            `<option value="${x}">${x[0].toUpperCase() + x.slice(1)}</option>`,
    )
    .join("\n")}
`;

typevalue.innerHTML = `
  ${list["test"]
      .map(
          (x) =>
              `<option value="${x}">${
                  x[0].toUpperCase() + x.slice(1)
              }</option>`,
      )
      .join("\n")}
  `;

type?.addEventListener("change", async (e) => {
    typevalue.innerHTML = `
  ${list[e.target.value]
      .map(
          (x) =>
              `<option value="${x}">${
                  x[0].toUpperCase() + x.slice(1)
              }</option>`,
      )
      .join("\n")}
  `;
});
