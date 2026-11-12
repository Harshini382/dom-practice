
const form = document.getElementById("applicationForm");

const fields = [
  "name", "email", "phone", "address",
  "education", "college", "year", "experience"
];

function getFormData() {
  const data = {};

  fields.forEach(id => {
    data[id] = document.getElementById(id).value;
  });

  data.skills = [...document.querySelectorAll(
    'input[name="skills"]:checked'
  )].map(item => item.value);

  return data;
}

function loadDraft() {
  const draft = JSON.parse(localStorage.getItem("jobDraft"));

  if (!draft) return;

  fields.forEach(id => {
    document.getElementById(id).value = draft[id] || "";
  });

  document.querySelectorAll('input[name="skills"]').forEach(item => {
    item.checked = (draft.skills || []).includes(item.value);
  });
}

function saveDraft() {
  localStorage.setItem("jobDraft", JSON.stringify(getFormData()));
  alert("Draft saved successfully!");
}

document.getElementById("saveDraft").addEventListener("click", saveDraft);

document.getElementById("clearDraft").addEventListener("click", () => {
  if (!confirm("Clear saved draft and form?")) return;

  localStorage.removeItem("jobDraft");
  form.reset();
  document.getElementById("errorSummary").hidden = true;
  document.getElementById("success").hidden = true;
});

function validateForm(data) {
  const errors = [];

  if (!data.name.trim()) {
    errors.push("Full name is required.");
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push("Enter a valid email address.");
  }

  if (!/^\d{10}$/.test(data.phone)) {
    errors.push("Phone number must contain exactly 10 digits.");
  }

  if (!data.address.trim()) {
    errors.push("Address is required.");
  }

  if (!data.education) {
    errors.push("Select your highest qualification.");
  }

  if (!data.college.trim()) {
    errors.push("College or university is required.");
  }

  const currentYear = new Date().getFullYear();

  if (!/^\d{4}$/.test(data.year) ||
      Number(data.year) < 1950 ||
      Number(data.year) > currentYear + 6) {
    errors.push("Enter a valid graduation year.");
  }

  if (data.skills.length === 0) {
    errors.push("Select at least one technical skill.");
  }

  if (data.experience === "" ||
      !Number.isInteger(Number(data.experience)) ||
      Number(data.experience) < 0 ||
      Number(data.experience) > 60) {
    errors.push("Enter valid years of experience.");
  }

  return errors;
}

form.addEventListener("submit", e => {
  e.preventDefault();

  document.getElementById("success").hidden = true;

  const data = getFormData();
  const errors = validateForm(data);

  const summary = document.getElementById("errorSummary");
  const errorList = document.getElementById("errorList");

  errorList.innerHTML = "";

  if (errors.length > 0) {
    errors.forEach(error => {
      const li = document.createElement("li");
      li.textContent = error;
      errorList.appendChild(li);
    });

    summary.hidden = false;
    summary.scrollIntoView({ behavior: "smooth" });
    return;
  }

  summary.hidden = true;
  document.getElementById("success").hidden = false;

  localStorage.removeItem("jobDraft");
  form.reset();

  document.getElementById("success").scrollIntoView({
    behavior: "smooth"
  });
});

loadDraft();
