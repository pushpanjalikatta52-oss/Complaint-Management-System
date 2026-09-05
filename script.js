const complaintForm =
    document.getElementById("complaintForm");

const successMessage =
    document.getElementById("successMessage");


// ================= SUBMIT COMPLAINT =================

complaintForm.addEventListener("submit", async function(event) {

    event.preventDefault();

    const complaintData = {

        name:
            document.getElementById("name").value.trim(),

        email:
            document.getElementById("email").value.trim(),

        phone:
            document.getElementById("phone").value.trim(),

        category:
            document.getElementById("category").value,

        subject:
            document.getElementById("subject").value.trim(),

        description:
            document.getElementById("description").value.trim()

    };


    try {

        const response = await fetch(
            "/api/complaints",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(complaintData)
            }
        );


        const result = await response.json();


        if (result.success) {

            successMessage.innerHTML = `
                <div class="result-card">
                    <h3>✅ Complaint Submitted Successfully</h3>

                    <p>
                        Your complaint has been registered.
                    </p>

                    <p>
                        <strong>Complaint ID:</strong>
                        ${result.complaint.id}
                    </p>

                    <p>
                        Please save this ID to track
                        your complaint.
                    </p>
                </div>
            `;

            complaintForm.reset();

        } else {

            successMessage.textContent =
                result.message;

        }

    } catch (error) {

        successMessage.textContent =
            "Unable to connect to the server.";

        console.error(error);

    }

});


// ================= TRACK COMPLAINT =================

async function trackComplaint() {

    const id =
        document.getElementById("complaintId")
        .value
        .trim();

    const resultBox =
        document.getElementById("trackResult");


    if (!id) {

        resultBox.innerHTML =
            "<p>Please enter a complaint ID.</p>";

        return;
    }


    try {

        const response = await fetch(
            `/api/complaints/${id}`
        );

        const result = await response.json();


        if (result.success) {

            const complaint =
                result.complaint;


            resultBox.innerHTML = `

                <div class="result-card">

                    <h3>
                        ${complaint.subject}
                    </h3>

                    <p>
                        <strong>Complaint ID:</strong>
                        ${complaint.id}
                    </p>

                    <p>
                        <strong>Category:</strong>
                        ${complaint.category}
                    </p>

                    <p>
                        <strong>Date:</strong>
                        ${complaint.date}
                    </p>

                    <p>
                        <strong>Description:</strong>
                        ${complaint.description}
                    </p>

                    <br>

                    <span class="status">
                        ${complaint.status}
                    </span>

                </div>

            `;

        } else {

            resultBox.innerHTML = `
                <div class="result-card">
                    ❌ ${result.message}
                </div>
            `;

        }

    } catch (error) {

        resultBox.innerHTML = `
            <div class="result-card">
                ❌ Server connection failed.
            </div>
        `;

    }

}