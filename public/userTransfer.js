document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector("#transferForm > form");

    form.addEventListener("submit", (event) => {
        event.preventDefault()
        const formData = new FormData(form);
        const data = new URLSearchParams(formData);

        if(!confirm("Are you sure you want to complete this transaction?")) return;

        fetch(`/user/transfer`, {
            method: "POST",
            body: data,
        }).then(response => response.json())
        .then(result => {
            alert(result.message)
            window.location.reload()
        })
    });
});