// ============================================
// SONICFLOW AUTHENTICATION
// ============================================

console.log("SonicFlow Auth Loaded");


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


            // SUCCESS

            showMessage(
                message,
                "Account created successfully ✦",
                "success"
            );


            // GO TO LOGIN

            setTimeout(
                function() {

                    window.location.href =
                        "login.html";

                },
                1000
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


            // SUCCESS

            showMessage(
                message,
                `Welcome back, ${user.name} ✦`,
                "success"
            );


            // GO HOME

            setTimeout(
                function() {

                    window.location.href =
                        "index.html";

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