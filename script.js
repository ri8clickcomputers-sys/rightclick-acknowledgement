document.addEventListener("DOMContentLoaded", function () {

  const form = document.getElementById("jobForm");

  if (!form) {
    alert("Form not found! Check form ID in HTML.");
    return;
  }

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    alert("Form connected successfully! Firebase will be added next.");
  });

});
