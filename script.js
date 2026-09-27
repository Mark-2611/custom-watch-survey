// =========================================
// GOOGLE APPS SCRIPT URL
// =========================================

const scriptURL = "https://script.google.com/macros/s/AKfycbwKhPK8I_l6s6nQ2VWsAMfVz4BiWOuOSPOc7TSOa8ZPI0FBri6dnRyWbc84tbHb0m_8ug/exec";


// =========================================
// ELEMENTS
// =========================================

const form = document.getElementById("surveyForm");

const thankYou = document.getElementById("thankYou");

const progressFill =
    document.getElementById("progressFill");

const progressText =
    document.getElementById("progressText");


// =========================================
// COLLECT ANSWERS
// =========================================

function collectAnswers() {

    const customization = [];


    document.querySelectorAll(
        'input[name="customization"]:checked'
    ).forEach(function (checkbox) {

        customization.push(checkbox.value);

    });


    return {

        // Respondent information

        respondentName:
            document
                .querySelector(
                    'input[name="respondentName"]'
                )
                ?.value.trim() || "",


        respondentEmail:
            document
                .querySelector(
                    'input[name="respondentEmail"]'
                )
                ?.value.trim() || "",


        respondentState:
            document
                .querySelector(
                    'select[name="respondentState"]'
                )
                ?.value || "",


        // Survey answers

        age:
            document
                .querySelector(
                    'input[name="age"]:checked'
                )
                ?.value || "",


        watchUsage:
            document
                .querySelector(
                    'input[name="wear"]:checked'
                )
                ?.value || "",


        watchType:
            document
                .querySelector(
                    'input[name="type"]:checked'
                )
                ?.value || "",


        watchStyle:
            document
                .querySelector(
                    'input[name="style"]:checked'
                )
                ?.value || "",


        customization:
            customization,


        otherCustomization:
            document
                .querySelector(
                    'input[name="otherCustomization"]'
                )
                ?.value.trim() || "",


        customizationImportance:
            document
                .querySelector(
                    'input[name="importance"]:checked'
                )
                ?.value || "",


        supportIndianBrand:
            document
                .querySelector(
                    'input[name="support"]:checked'
                )
                ?.value || "",


        budget:
            document
                .querySelector(
                    'input[name="price"]:checked'
                )
                ?.value || "",


        madeInIndia:
            document
                .querySelector(
                    'input[name="india"]:checked'
                )
                ?.value || "",


        purchaseInterest:
            document
                .querySelector(
                    'input[name="purchase"]:checked'
                )
                ?.value || "",


        recommendation:
            document
                .querySelector(
                    'input[name="recommend"]:checked'
                )
                ?.value || "",


        features:
            document
                .querySelector(
                    'textarea[name="features"]'
                )
                ?.value.trim() || "",


        feedback:
            document
                .querySelector(
                    'textarea[name="feedback"]'
                )
                ?.value.trim() || ""

    };

}


// =========================================
// VALIDATE SURVEY
// =========================================

function validateSurvey() {


    // -----------------------------------------
    // Check State
    // -----------------------------------------

    const state =
        document.querySelector(
            'select[name="respondentState"]'
        );


    if (!state || state.value === "") {

        alert(
            "Please select your State / Union Territory."
        );


        state?.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });


        state?.focus();


        return false;

    }



    // -----------------------------------------
    // Required radio questions
    // -----------------------------------------

    const requiredGroups = [

        {
            name: "age",
            message: "Please select your age group."
        },

        {
            name: "wear",
            message: "Please tell us how often you wear a watch."
        },

        {
            name: "type",
            message: "Please select your preferred watch type."
        },

        {
            name: "style",
            message: "Please select your preferred watch style."
        },

        {
            name: "importance",
            message: "Please tell us how important customization is to you."
        },

        {
            name: "support",
            message: "Please tell us whether you would support the Indian watch brand."
        },

        {
            name: "price",
            message: "Please select your preferred budget."
        },

        {
            name: "india",
            message: "Please tell us your preference for a Made-in-India watch."
        },

        {
            name: "purchase",
            message: "Please tell us how likely you are to purchase the watch."
        },

        {
            name: "recommend",
            message: "Please tell us whether you would recommend the brand."
        }

    ];



    // Check each radio question

    for (
        let group of requiredGroups
    ) {


        const selected =
            document.querySelector(
                `input[name="${group.name}"]:checked`
            );


        if (!selected) {


            alert(group.message);


            const firstInput =
                document.querySelector(
                    `input[name="${group.name}"]`
                );


            const question =
                firstInput?.closest(".question");


            question?.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });


            return false;

        }

    }



    // -----------------------------------------
    // Check customization
    // -----------------------------------------

    const customizationSelected =
        document.querySelectorAll(
            'input[name="customization"]:checked'
        );


    if (
        customizationSelected.length === 0
    ) {


        alert(
            "Please select at least one customization option."
        );


        const customizationInput =
            document.querySelector(
                'input[name="customization"]'
            );


        customizationInput
            ?.closest(".question")
            ?.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });


        return false;

    }



    // -----------------------------------------
    // Check Features
    // -----------------------------------------

    const features =
        document.querySelector(
            'textarea[name="features"]'
        );


    if (
        !features ||
        features.value.trim() === ""
    ) {


        alert(
            "Please tell us which features you would like in the watch."
        );


        features?.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });


        features?.focus();


        return false;

    }


    return true;

}


// =========================================
// SUBMIT SURVEY
// =========================================

form.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        // -------------------------------------
        // Validate
        // -------------------------------------

        if (!validateSurvey()) {

            return;

        }



        // -------------------------------------
        // Submit button
        // -------------------------------------

        const submitButton =
            form.querySelector(
                'button[type="submit"]'
            );


        submitButton.disabled = true;

        submitButton.textContent =
            "Submitted ✓";



        // -------------------------------------
        // Collect data
        // -------------------------------------

        const responseData =
            collectAnswers();



        // -------------------------------------
        // Send to Google Sheets
        // -------------------------------------

        try {


            await fetch(
                scriptURL,
                {

                    method: "POST",

                    mode: "no-cors",

                    headers: {
                        "Content-Type":
                            "text/plain;charset=utf-8"
                    },

                    body:
                        JSON.stringify(
                            responseData
                        )

                }
            );


            // ---------------------------------
            // Show Thank You
            // ---------------------------------

            setTimeout(function () {


                form.style.display =
                    "none";


                const progressContainer =
                    document.querySelector(
                        ".progress-container"
                    );


                if (progressContainer) {

                    progressContainer.style.display =
                        "none";

                }


                const header =
                    document.querySelector(
                        ".header"
                    );


                if (header) {

                    header.style.display =
                        "none";

                }


                thankYou.style.display =
                    "block";


                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });


            }, 500);


        }

        catch (error) {


            console.error(
                "Submission error:",
                error
            );


            alert(
                "Something went wrong while submitting your response. Please try again."
            );


            submitButton.disabled =
                false;


            submitButton.textContent =
                "Submit Survey 🚀";

        }

    }
);


// =========================================
// PROGRESS BAR
// =========================================

function updateProgress() {


    const questions =
        document.querySelectorAll(
            ".question"
        );


    let answered = 0;



    questions.forEach(
        function (question) {


            const inputs =
                question.querySelectorAll(
                    "input, select, textarea"
                );


            let isAnswered = false;



            inputs.forEach(
                function (input) {


                    if (
                        input.type === "radio" &&
                        input.checked
                    ) {

                        isAnswered = true;

                    }


                    if (
                        input.type === "checkbox" &&
                        input.checked
                    ) {

                        isAnswered = true;

                    }


                    if (
                        (
                            input.type === "text" ||
                            input.type === "email"
                        ) &&
                        input.value.trim() !== ""
                    ) {

                        isAnswered = true;

                    }


                    if (
                        input.tagName === "SELECT" &&
                        input.value !== ""
                    ) {

                        isAnswered = true;

                    }


                    if (
                        input.tagName === "TEXTAREA" &&
                        input.value.trim() !== ""
                    ) {

                        isAnswered = true;

                    }

                }
            );



            if (isAnswered) {

                answered++;

            }

        }
    );



    const total =
        questions.length;


    const percentage =
        total > 0
            ? Math.round(
                (answered / total) * 100
            )
            : 0;



    if (progressFill) {

        progressFill.style.width =
            percentage + "%";

    }



    if (progressText) {

        progressText.textContent =
            percentage + "% Complete";

    }

}


// =========================================
// UPDATE PROGRESS
// =========================================

form.addEventListener(
    "change",
    updateProgress
);


form.addEventListener(
    "input",
    updateProgress
);


updateProgress();