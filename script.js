const modals = document.querySelectorAll(".modal");
const openButtons = document.querySelectorAll("[data-open-modal]");
const closeButtons = document.querySelectorAll(".close-btn");

function openModal(key) {
  const modal = document.getElementById(`${key}Modal`);
  if (!modal) return;
  modal.classList.add("show");
}

function closeModal(modal) {
  if (!modal) return;
  modal.classList.remove("show");
}

openButtons.forEach((button) => {
  button.addEventListener("click", () => {
    openModal(button.dataset.openModal);
  });
});

closeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const modal = button.closest(".modal");
    closeModal(modal);
  });
});

modals.forEach((modal) => {
  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeModal(modal);
    }
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    modals.forEach((modal) => closeModal(modal));
  }
});

const signupForm = document.getElementById("signupForm");
const loginForm = document.getElementById("loginForm");
const modelForm = document.getElementById("modelForm");

const USER_DB_KEY = "velvetStudioUsers";

function safeParseUsers() {
  try {
    return JSON.parse(localStorage.getItem(USER_DB_KEY)) || [];
  } catch {
    return [];
  }
}

function saveUsers(users) {
  localStorage.setItem(USER_DB_KEY, JSON.stringify(users));
}

signupForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = document.getElementById("signupName").value.trim();
  const email = document.getElementById("signupEmail").value.trim();
  const password = document.getElementById("signupPassword").value.trim();
  const role = document.getElementById("signupRole").value;

  if (!name || !email || !password || !role) {
    alert("Please fill in all fields.");
    return;
  }

  const users = safeParseUsers();
  const exists = users.some((user) => user.email.toLowerCase() === email.toLowerCase());

  if (exists) {
    alert("An account with this email already exists.");
    return;
  }

  users.push({
    name,
    email,
    password,
    role,
    createdAt: new Date().toISOString()
  });

  saveUsers(users);
  alert("Account created successfully. You can now log in.");
  signupForm.reset();
  closeModal(document.getElementById("signupModal"));
});

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value.trim();

  const users = safeParseUsers();
  const user = users.find(
    (item) =>
      item.email.toLowerCase() === email.toLowerCase() &&
      item.password === password
  );

  if (!user) {
    alert("Invalid email or password.");
    return;
  }

  localStorage.setItem("velvetStudioLoggedInUser", JSON.stringify(user));

  alert(`Welcome back, ${user.name}!`);
  loginForm.reset();
  closeModal(document.getElementById("loginModal"));
});

modelForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(modelForm);
  const data = Object.fromEntries(formData.entries());

  const payload = {
    ...data,
    appliedAt: new Date().toISOString()
  };

  const existingApplications = JSON.parse(localStorage.getItem("velvetStudioApplications") || "[]");
  existingApplications.push(payload);
  localStorage.setItem("velvetStudioApplications", JSON.stringify(existingApplications));

  alert("Your model application has been submitted successfully.");
  modelForm.reset();
});
