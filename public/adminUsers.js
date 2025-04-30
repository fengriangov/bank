document.addEventListener('DOMContentLoaded', function () {
    const editUserBtns = document.querySelectorAll('.editUserBtn');
    const deleteUserBtns = document.querySelectorAll('.deleteUserBtn');
    const createUserBtn = document.getElementById('createUserBtn')

    const form = document.querySelector("#popup > form");
    const popup = document.getElementById('popup');
    const popupTitle = document.getElementById('popupTitle');

    const editFirstName = document.getElementById('editFirstName');
    const editLastName = document.getElementById('editLastName');
    const editEmail = document.getElementById('editEmail');
    const editPassword = document.getElementById('editPassword');
    const editAdmin = document.getElementById('editAdmin');

    const closePopup = document.getElementById('closePopup');

    editUserBtns.forEach(button => {
        button.addEventListener('click', function () {
            const id = this.getAttribute('data-id');
            const firstName = this.getAttribute('data-firstName');
            const lastName = this.getAttribute('data-lastName');
            const email = this.getAttribute('data-email');
            const admin = this.getAttribute('data-admin');

            form.action = `/admin/users/${id}`;

            editFirstName.value = firstName;
            editLastName.value = lastName;
            editEmail.value = email;
            editAdmin.checked = admin === "1";
            editPassword.placeholder = "New password";
            editPassword.required = false;

            popupTitle.textContent = "Edit User";
            popup.style.display = 'block';
        });
    });

    form.addEventListener("submit", (event) => {
        event.preventDefault()
        const formData = new FormData(form);
        const data = new URLSearchParams(formData);

        fetch(form.action, {
            method: "POST",
            body: data,
        }).then(response => response.json())
        .then(result => {
            alert(result.message)
            window.location.reload()
        })
    })

    deleteUserBtns.forEach(button => {
        button.addEventListener("click", function (){
            if(!confirm("Are you sure you want to delete this user?")) return;    
            const id = this.getAttribute('data-id');
            fetch(`/admin/users/${id}`, {
                method: "DELETE",
            }).then(response => response.json())
            .then(results => {
                alert(results.message)
                document.location.reload()
            })
        })
    })

    createUserBtn.addEventListener('click', function () {
        form.action = `/admin/users`;
        
        editFirstName.value = "";
        editLastName.value = "";
        editEmail.value = "";
        editPassword.value = "";
        editAdmin.checked = 0;
        editPassword.placeholder = "Password";
        editPassword.required = false;

        popupTitle.textContent = "Create User";
        popup.style.display = 'block';
    });

    closePopup.addEventListener('click', function () {
        popup.style.display = 'none';
    });
});