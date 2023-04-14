const loader = document.querySelector(".loader");
document.addEventListener("DOMContentLoaded", () => {
    const login = document.getElementById("login");
    const error = document.getElementById("error");
    error.style.height = "0px";
    error.style.top = "-30px";

    const password = document.getElementById("pass");
    let p = password?.value;

    const updatepass = () => {
        password.type = "text";
        // only save the part that was selected
        const x = p.slice(password.selectionStart, password.selectionEnd);
        password.value = p
            .split("")
            .map((y, i) =>
                i >= password.selectionStart && i < password.selectionEnd
                    ? y
                    : "*",
            )
            .join("");
        // keep the part selected after the update
        password.focus();
        password.setSelectionRange(
            password.selectionStart,
            password.selectionEnd,
        );
    };

    const restorePass = () => {
        console.log(p);
        password.type = "password";
        password.value = p;
    };

    password?.addEventListener("change", (e) => (p = e.target.value));
    password?.addEventListener("keyup", (e) => (p = e.target.value));
    password?.addEventListener("select", (e) => updatepass());
    password.onblur = password.onfocus = password.onmousedown = restorePass;

    const closebtn = document.getElementById("closeerrorbtn");
    console.log({ closebtn });

    login.addEventListener("click", async (e) => {
        try {
            e.preventDefault();
            let phone = document.getElementById("email").value;
            const password = document.getElementById("pass").value;
            if (!phone || !password)
                return sendError("Please fill all the fields");
            if (phone.length === 13) phone = phone.slice(3);

            phone = Number(phone).toString();
            if (isNaN(phone) || phone.length !== 10)
                return sendError("Invalid Phone Number");
            if (password.length < 8)
                return sendError("Password must be atleast 8 characters long");

            const data = {
                phone,
                password,
                token: localStorage.getItem("uid"),
                endpoint: "/api/login",
            };
            const temp = login.innerHTML;
            login.innerHTML = `<div class="spinner"></div>`;
            const resData = await fetch("https://pancham1305-proxy.deno.dev/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            }).then((d) => d.json());
            if (resData.status === 200) {
                localStorage.setItem("user", JSON.stringify(resData.data));
                localStorage.setItem("token", resData.token);
                window.location.href = "./services.html";
            } else {
                login.innerHTML = temp;
                sendError(resData.message);
            }
        } catch (e) {
            login.innerHTML = temp;
            sendError(`Failed to login: ${e.message}`);
        }
    });

    const guestbtn = document.getElementById("guest");
    guestbtn.addEventListener("click", async (e) => {
        const temp = guestbtn.innerHTML;
        guestbtn.innerHTML = `<div class="spinner"></div>
`;
        const data = {
            phone: "+910000000000",
            password: "guestOogwayrocks",
            uid: "0".repeat(64),
            endpoint: "/api/login",
        };

        const res = await fetch("https://pancham1305-proxy.deno.dev/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        }).then((d) => d.json());
        if (res.status === 200) {
            localStorage.setItem("user", JSON.stringify(res.data));
            window.location.href = "./services.html";
        } else {
            guestbtn.innerHTML = temp;
            const error = document.getElementById("error");
            error.style.height = "";
            error.style.top = "";
            error.innerHTML += `<div class='etext'>${res.message}</div>`;
        }
    });
});

document.addEventListener("click", (e) => {
    if (e.target.id !== "closeerrorbtn") return;
    const error = document.getElementById("error");
    error.innerHTML =
        '  <div class="closebtn" id="closeerrorbtn">&times;</div>';
    error.style.height = "0px";
    error.style.top = "-30px";
});

function sendError(msg) {
    const error = document.getElementById("error");
    error.style.height = "";
    error.style.top = "";
    error.innerHTML += `<div class='etext'>${msg}</div>`;
}
