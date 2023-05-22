var btn6 = document.getElementById("b1");
var btn2 = document.getElementById("b2");
var btn3 = document.getElementById("b3");
var btn4 = document.getElementById("b4");
// Get the modal
var modal = document.getElementById("myModal");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

btn6.addEventListener("click", (e) => {
    console.log("1");
    modal.style.display = "block";
});

btn2.addEventListener("click", (e) => {
    console.log("2");
    modal.style.display = "block";
});

btn3.addEventListener("click", (e) => {
    console.log("3");
    modal.style.display = "block";
});

btn4.addEventListener("click", (e) => {
    console.log("4");
    modal.style.display = "block";
});

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
    modal.style.display = "none";
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == modal) {
        document.body.style.overflow = "auto";
        modal.style.display = "none";
    }
};

const emercont = document.querySelector(".wrapper");
const button_e_emergency = document.querySelector(".emergencybtn");
let a = 0;
const btn5 = document.querySelector(".cld");

button_e_emergency.addEventListener("click", (e) => {
    a++;
    if (a % 2) {
        emercont.classList.remove("hidden");
        emercont.classList.add("blur");
        btn5.innerHTML = '<span class="material-symbols-outlined">close</span>';
        document.body.style.overflow = "hidden";
    } else {
        emercont.classList.add("hidden");
        emercont.classList.remove("blur");
        btn5.innerHTML = '<span class="content">Emergency Button</span>';
        document.body.style.overflow = "auto";
    }
});
function giveRandom(mini, maxi) {
    return Math.random() * (maxi - mini) + mini;
}

// Emergency Button Final Work
const hosDetails = document.querySelector(".hosdetails");
const btn_of_emergency = document.querySelectorAll(".emer");
btn_of_emergency.forEach((e) => {
    e.addEventListener("click", async () => {
        let url = `https://pancham1305-proxy.deno.dev/`;
        const a = "hospital";
        const b = drop.options[drop.selectedIndex].text;
        const info = await fetch(url, {
            method: "POST",
            body: JSON.stringify({
                city: b,
                query: a,
                endpoint: "/api/search/",
            }),
            headers: {
                "Content-Type": "application/json",
            },
        }).then((e) => e.json());
        console.log(info.results);
        // hosDetails.innerHTML = "";
        const index = Math.floor(giveRandom(0, info.results.length));
        console.log("index:", index);
        hosDetails.innerHTML = `<span class="hosname">Hospital Name::${info.results[index].name}</span>
    <span class="hosadd"> Hospital Address::${info.results[index].address_line2}</span>`;
    });
});
