// Contact form: validates in the page, then sends through FormSubmit
// (https://formsubmit.co), which emails each message to the form's address.
(function () {
  var form = document.getElementById("contact-form");
  if (!form) return;

  var status = document.getElementById("form-status");
  var button = form.querySelector(".btn-submit");

  // Without JavaScript the form posts normally and FormSubmit returns here.
  if (/[?&]sent=1/.test(window.location.search)) {
    showSuccess();
  }

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

  function showSuccess() {
    form.classList.add("is-sent");
    form.innerHTML =
      '<div class="form-success" role="status">' +
      '<span class="success-mark" aria-hidden="true"></span>' +
      '<h2>Thanks, your message is on its way.</h2>' +
      '<p>We\'ll get back to you as soon as we can. For anything urgent, call ' +
      '<a href="tel:+14164256062">416.425.6062</a>.</p>' +
      '</div>';
  }

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

    button.disabled = true;
    button.textContent = "Sending…";
    status.className = "form-status";
    status.textContent = "";

    var data = new FormData(form);
    var payload = {};
    data.forEach(function (value, key) { payload[key] = value; });

    fetch(form.action.replace("formsubmit.co/", "formsubmit.co/ajax/"), {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload)
    })
      .then(function (response) {
        return response.json().then(function (json) {
          if (!response.ok || String(json.success) !== "true") throw new Error(json.message || "Send failed");
        });
      })
      .then(showSuccess)
      .catch(function () {
        button.disabled = false;
        button.textContent = "Send Message";
        status.className = "form-status is-error";
        status.innerHTML = 'Sorry, your message couldn\'t be sent. Please try again, or email ' +
          '<a href="mailto:info@powersoccer.ca">info@powersoccer.ca</a>.';
      });
  });
})();
