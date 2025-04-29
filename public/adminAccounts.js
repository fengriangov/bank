document.addEventListener('DOMContentLoaded', function () {
    const editAccountBtns = document.querySelectorAll('.editAccountBtn');
    const deleteAccountBtns = document.querySelectorAll('.deleteAccountBtn');
    const createAccountBtn = document.getElementById('createAccountBtn')

    const form = document.querySelector("#popup > form");
    const popup = document.getElementById('popup');
    const popupTitle = document.getElementById('popupTitle');

    const editAccountOwner = document.getElementById('editAccountOwner');
    const editAccountType = document.getElementById('editAccountType');
    const editBalance = document.getElementById('editBalance');

    const closePopup = document.getElementById('closePopup');

    editAccountBtns.forEach(button => {
        button.addEventListener('click', function () {
            const id = this.getAttribute('data-id');
            const userId = this.getAttribute('data-user_id');
            const accountType = this.getAttribute('data-account_type');
            const balance = this.getAttribute('data-balance');

            form.action = `/admin/accounts/${id}`;

            editAccountOwner.value = userId;
            editAccountType.value = accountType;
            editBalance.value = balance;

            popupTitle.textContent = "Edit Account";
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

    deleteAccountBtns.forEach(button => {
        button.addEventListener("click", function (){
            if(!confirm("Are you sure you want to delete this account?")) return;    
            const id = this.getAttribute('data-id');
            fetch(`/admin/accounts/${id}`, {
                method: "DELETE",
            }).then(response => response.json())
            .then(results => {
                alert(results.message)
                document.location.reload()
            })
        })
    })

    createAccountBtn.addEventListener('click', function () {
        form.action = `/admin/accounts`;

        editAccountOwner.value = "";
        editAccountType.value = "";
        editBalance.value = "";

        popupTitle.textContent = "Create Account";
        popup.style.display = 'block';
    });

    closePopup.addEventListener('click', function () {
        popup.style.display = 'none';
    });
});