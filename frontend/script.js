// ================================
// Job Application Tracker
// ================================

let applications =
JSON.parse(localStorage.getItem("applications")) || [];

let currentFilter = "All";
let editId = null;

// ================================
// DOM Elements
// ================================

const applicationForm =
document.getElementById("applicationForm");

const tableBody =
document.getElementById("applicationTableBody");

const totalCount =
document.getElementById("totalCount");

const appliedCount =
document.getElementById("appliedCount");

const interviewCount =
document.getElementById("interviewCount");

const offerCount =
document.getElementById("offerCount");

const rejectedCount =
document.getElementById("rejectedCount");

const searchInput =
document.getElementById("searchInput");

// ================================
// Save To Local Storage
// ================================

function saveApplications() {

localStorage.setItem(
    "applications",
    JSON.stringify(applications)
);

}

// ================================
// Dashboard Counts
// ================================

function updateCounts() {

totalCount.textContent =
    applications.length;

appliedCount.textContent =
    applications.filter(
        app => app.status === "Applied"
    ).length;

interviewCount.textContent =
    applications.filter(
        app => app.status === "Interview"
    ).length;

offerCount.textContent =
    applications.filter(
        app => app.status === "Offer"
    ).length;

rejectedCount.textContent =
    applications.filter(
        app => app.status === "Rejected"
    ).length;

}

// ================================
// Status Badge
// ================================

function getStatusClass(status) {

switch (status) {

    case "Applied":
        return "status-applied";

    case "Interview":
        return "status-interview";

    case "Offer":
        return "status-offer";

    case "Rejected":
        return "status-rejected";

    default:
        return "";
}

}

// ================================
// Render Applications
// ================================

function renderApplications(filter = "All") {

tableBody.innerHTML = "";

let filteredApplications =
    applications;

// Status Filter

if (filter !== "All") {

    filteredApplications =
        filteredApplications.filter(
            app => app.status === filter
        );

}

// Search Filter

const searchTerm =
    searchInput
        ? searchInput.value.toLowerCase()
        : "";

filteredApplications =
    filteredApplications.filter(
        app =>
            app.company
                .toLowerCase()
                .includes(searchTerm)
            ||
            app.role
                .toLowerCase()
                .includes(searchTerm)
    );

if (filteredApplications.length === 0) {

    tableBody.innerHTML = `
        <tr>
            <td colspan="7">
                No Applications Found
            </td>
        </tr>
    `;

    return;

}

filteredApplications.forEach(app => {

    const row =
        document.createElement("tr");

    row.innerHTML = `
        <td>${app.id}</td>

        <td>${app.company}</td>

        <td>${app.role}</td>

        <td>
            <span class="${getStatusClass(app.status)}">
                ${app.status}
            </span>
        </td>

        <td>${app.applicationDate}</td>

        <td>${app.followUpDate}</td>

        <td>

            <div class="action-buttons">

                <button
                    class="edit-btn"
                    onclick="editApplication(${app.id})"
                >
                    Edit
                </button>

                <button
                    class="delete-btn"
                    onclick="deleteApplication(${app.id})"
                >
                    Delete
                </button>

            </div>

        </td>
    `;

    tableBody.appendChild(row);

});


}

// ================================
// Render Upcoming Follow-Ups
// ================================

function renderFollowUps() {

const container =
    document.getElementById(
        "followUpContainer"
    );

if (!container) return;

container.innerHTML = "";

const upcomingApplications =
    [...applications]
        .sort(
            (a, b) =>
                new Date(a.followUpDate)
                -
                new Date(b.followUpDate)
        )
        .slice(0, 5);

if (
    upcomingApplications.length === 0
) {

    container.innerHTML =
        "<p>No Follow-Ups Available</p>";

    return;

}

upcomingApplications.forEach(app => {

    const card =
        document.createElement("div");

    card.className =
        "followup-card";

    card.innerHTML = `
        <h4>${app.company}</h4>

        <p>${app.role}</p>

        <p>
            Follow-Up:
            ${app.followUpDate}
        </p>
    `;

    container.appendChild(card);

});

}

// ================================
// Add / Update Application
// ================================

applicationForm.addEventListener(
"submit",
function (event) {

    event.preventDefault();

    const company =
        document
            .getElementById("company")
            .value
            .trim();

    const role =
        document
            .getElementById("role")
            .value
            .trim();

    const status =
        document
            .getElementById("status")
            .value;

    const applicationDate =
        document
            .getElementById("date")
            .value;

    const followUpDate =
        document
            .getElementById("followUpDate")
            .value;

    if (editId !== null) {

        const app =
            applications.find(
                a => a.id === editId
            );

        if (app) {

            app.company =
                company;

            app.role =
                role;

            app.status =
                status;

            app.applicationDate =
                applicationDate;

            app.followUpDate =
                followUpDate;

        }

        editId = null;

    } else {

        const newApplication = {

            id: Date.now(),

            company,

            role,

            status,

            applicationDate,

            followUpDate

        };

        applications.push(
            newApplication
        );

    }

    saveApplications();

    renderApplications(
        currentFilter
    );

    updateCounts();

    renderFollowUps();

    applicationForm.reset();

}

);

// ================================
// Edit Application
// ================================

function editApplication(id) {

const app =
    applications.find(
        application =>
            application.id === id
    );

if (!app) return;

document.getElementById(
    "company"
).value = app.company;

document.getElementById(
    "role"
).value = app.role;

document.getElementById(
    "status"
).value = app.status;

document.getElementById(
    "date"
).value = app.applicationDate;

document.getElementById(
    "followUpDate"
).value = app.followUpDate;

editId = id;

}

// ================================
// Delete Application
// ================================

function deleteApplication(id) {

const confirmDelete =
    confirm(
        "Are you sure you want to delete this application?"
    );

if (!confirmDelete) return;

applications =
    applications.filter(
        app => app.id !== id
    );

saveApplications();

renderApplications(
    currentFilter
);

updateCounts();

renderFollowUps();

}

// ================================
// Filter Buttons
// ================================

const filterButtons =
document.querySelectorAll(
".filter-btn"
);

filterButtons.forEach(button => {

button.addEventListener(
    "click",
    function () {

        currentFilter =
            this.dataset.filter;

        renderApplications(
            currentFilter
        );

    }
);

});

// ================================
// Search
// ================================

if (searchInput) {


searchInput.addEventListener(
    "keyup",
    function () {

        renderApplications(
            currentFilter
        );

    }
);

}

// ================================
// Initial Load
// ================================

renderApplications();

updateCounts();

renderFollowUps();
