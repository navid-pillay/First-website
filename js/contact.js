// Contact form: checks the fields in the page. Online sending isn't set up
// yet, so a valid form shows how to reach the club instead.
(function () {
  var form = document.getElementById("contact-form");
  if (!form) return;

  var status = document.getElementById("form-status");

  var messages = {
    name: "Please enter your name.",
    email: "Please enter a valid email address.",
    topic: "Please choose a topic.",
    message: "Please write a short message."
  };

  function setError(field, text) {
    var error = document.getElementById(field.id + "-error");
    field.classList.toggle("is-invalid", !!text);
    field.setAttribute("aria-invalid", text ? "true" : "false");
    if (error) {
      error.textContent = text || "";
      if (text) field.setAttribute("aria-describedby", error.id);
    }
  }

  function check(field) {
    var ok = field.value.trim() !== "" && field.checkValidity();
    setError(field, ok ? "" : messages[field.name]);
    return ok;
  }

  var required = Array.prototype.slice.call(form.querySelectorAll("[required]"));
  required.forEach(function (field) {
    field.addEventListener("blur", function () {
      if (field.value.trim() !== "") check(field);
    });
    field.addEventListener("input", function () {
      if (field.classList.contains("is-invalid")) check(field);
    });
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    var firstInvalid = null;
    required.forEach(function (field) {
      if (!check(field) && !firstInvalid) firstInvalid = field;
    });
    if (firstInvalid) {
      firstInvalid.focus();
      status.textContent = "";
      return;
    }

    status.className = "form-status is-notice";
    status.innerHTML = "Online messages aren't available yet. Please email " +
      '<a href="mailto:info@powersoccer.ca">info@powersoccer.ca</a> or call ' +
      '<a href="tel:+14164256062">416.425.6062</a>.';
  });
})();
