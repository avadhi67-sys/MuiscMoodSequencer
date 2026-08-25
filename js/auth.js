// ============================================
// SONICFLOW AUTHENTICATION
// ============================================

console.log("SonicFlow Auth Loaded");

// URL Parameters
const urlParams = new URLSearchParams(window.location.search);
const redirectParam = urlParams.get("redirect");
const msgParam = urlParams.get("msg");

// Update switch links to preserve redirect param
const authSwitchLinks = document.querySelectorAll(".auth-switch a");
authSwitchLinks.forEach(function(link) {
    if (redirectParam) {
        const baseHref = link.getAttribute("href").split("?")[0];
        link.setAttribute("href", `${baseHref}?redirect=${encodeURIComponent(redirectParam)}`);
    }
});

// Show initial notice if user was redirected because authentication is required
document.addEventListener("DOMContentLoaded", function() {
    const loginMsg = document.getElementById("loginMessage");
    const authMsg = document.getElementById("authMessage");

    if (msgParam === "login_required" || redirectParam) {
        if (loginMsg) {
            showMessage(
                loginMsg,
                "✦ Please log in or sign up first to access this feature.",
                "error"
            );
        } else if (authMsg) {
            showMessage(
                authMsg,
                "✦ Please create an account or log in to access this feature.",
                "error"
            );
        }
    }
});

// ============================================
// SIGNUP
// ============================================

const signupForm =
    document.getElementById("signupForm");


if (signupForm) {

    signupForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            // GET VALUES

            const name =
                document
                    .getElementById("signupName")
                    .value
                    .trim();


            const email =
                document
                    .getElementById("signupEmail")
                    .value
                    .trim()
                    .toLowerCase();


            const password =
                document
                    .getElementById("signupPassword")
                    .value;


            const confirmPassword =
                document
                    .getElementById("confirmPassword")
                    .value;


            const message =
                document.getElementById(
                    "authMessage"
                );


            // VALIDATION

            if (
                name === "" ||
                email === "" ||
                password === "" ||
                confirmPassword === ""
            ) {

                showMessage(
                    message,
                    "Please fill in all fields.",
                    "error"
                );

                return;

            }


            // PASSWORD CHECK

            if (password.length < 6) {

                showMessage(
                    message,
                    "Password must contain at least 6 characters.",
                    "error"
                );

                return;

            }


            // CONFIRM PASSWORD

            if (password !== confirmPassword) {

                showMessage(
                    message,
                    "Passwords do not match.",
                    "error"
                );

                return;

            }


            // GET EXISTING USERS

            let users =
                JSON.parse(
                    localStorage.getItem(
                        "sonicflow_users"
                    )
                ) || [];


            // CHECK DUPLICATE EMAIL

            const existingUser =
                users.find(
                    function(user) {

                        return user.email === email;

                    }
                );


            if (existingUser) {

                showMessage(
                    message,
                    "An account with this email already exists.",
                    "error"
                );

                return;

            }


            // CREATE USER

            const user = {

                id: Date.now(),

                name: name,

                email: email,

                password: password

            };


            // SAVE USER

            users.push(user);


            localStorage.setItem(
                "sonicflow_users",
                JSON.stringify(users)
            );

            // Auto-login newly registered user
            localStorage.setItem(
                "sonicflow_current_user",
                JSON.stringify(user)
            );

            // Mark session for one-time home entrance celebration
            sessionStorage.setItem("sonicflow_just_authenticated", "true");

            // SUCCESS

            showMessage(
                message,
                "Account created successfully ✦ Redirecting...",
                "success"
            );


            // GO TO DESTINATION OR HOME

            setTimeout(
                function() {
                    const destination = redirectParam ? decodeURIComponent(redirectParam) : "index.html";
                    window.location.href = destination;
                },
                900
            );

        }
    );

}


// ============================================
// LOGIN
// ============================================

const loginForm =
    document.getElementById("loginForm");


if (loginForm) {

    loginForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            // GET VALUES

            const email =
                document
                    .getElementById("loginEmail")
                    .value
                    .trim()
                    .toLowerCase();


            const password =
                document
                    .getElementById("loginPassword")
                    .value;


            const message =
                document.getElementById(
                    "loginMessage"
                );


            // GET USERS

            const users =
                JSON.parse(
                    localStorage.getItem(
                        "sonicflow_users"
                    )
                ) || [];


            // FIND USER

            const user =
                users.find(
                    function(item) {

                        return (
                            item.email === email &&
                            item.password === password
                        );

                    }
                );


            // WRONG LOGIN

            if (!user) {

                showMessage(
                    message,
                    "Invalid email or password.",
                    "error"
                );

                return;

            }


            // SAVE CURRENT USER
            localStorage.setItem(
                "sonicflow_current_user",
                JSON.stringify(user)
            );

            // Mark session for one-time home entrance celebration
            sessionStorage.setItem("sonicflow_just_authenticated", "true");

            // SUCCESS

            showMessage(
                message,
                `Welcome back, ${user.name} ✦`,
                "success"
            );


            // GO TO DESTINATION OR HOME

            setTimeout(
                function() {
                    const destination = redirectParam ? decodeURIComponent(redirectParam) : "index.html";
                    window.location.href = destination;
                },
                800
            );

        }
    );

}


// ============================================
// MESSAGE FUNCTION
// ============================================

function showMessage(
    element,
    text,
    type
) {

    if (!element) {

        return;

    }


    element.textContent = text;

    element.className =
        `auth-message ${type}`;

}