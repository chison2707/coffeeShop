// button status
const buttonStatus = document.querySelectorAll("[button-status");
if (buttonStatus.length > 0) {
    let url = new URL(window.location.href);
    buttonStatus.forEach(button => {
        button.addEventListener("click", () => {
            const stauts = button.getAttribute("button-status");
            if (stauts) {
                url.searchParams.set("status", stauts);
            }
            else {
                url.searchParams.delete("status");
            }

            window.location.href = url.href;
        });
    });
}
// end button status

// form search
const formSearch = document.querySelector("#form-search");
if (formSearch) {
    let url = new URL(window.location.href);

    formSearch.addEventListener("submit", (e) => {
        e.preventDefault();
        const key = e.target.elements.keyword.value;

        if (key) {
            url.searchParams.set("keyword", key);
        }
        else {
            url.searchParams.delete("keyword");
        }

        window.location.href = url.href;
    })
}
// end form search

// pagination
const buttonPagination = document.querySelectorAll("[button-pagination]");
if (buttonPagination) {
    let url = new URL(window.location.href);
    buttonPagination.forEach(button => {
        button.addEventListener("click", () => {
            const page = button.getAttribute("button-pagination");

            url.searchParams.set("page", page);

            window.location.href = url.href;
        });
    })
};
// end pagination

// checkbox multi
const checkboxMulti = document.querySelector("[checkbox-multi]");
if (checkboxMulti) {
    const inputCheckAll = checkboxMulti.querySelector("input[name='checkall']");
    const inputsId = checkboxMulti.querySelectorAll("input[name='id']");
    inputCheckAll.addEventListener("click", () => {
        if (inputCheckAll.checked) {
            inputsId.forEach(input => {
                input.checked = true;
            });
        } else {
            inputsId.forEach(input => {
                input.checked = false;
            });
        }
    });

    inputsId.forEach((input) => {
        input.addEventListener("click", () => {
            const countChecked = checkboxMulti.querySelectorAll("input[name='id']:checked").length;
            if (countChecked == inputsId.length) {
                inputCheckAll.checked = true;
            } else {
                inputCheckAll.checked = false;
            }
        });
    });
}
// end checkbox multi

// form change multi
const formChangeMulti = document.querySelector("[form-change-multi]");
if (formChangeMulti) {
    formChangeMulti.addEventListener("submit", (e) => {
        e.preventDefault();

        const checkboxMulti = document.querySelector("[checkbox-multi]");
        const inputsChecked = checkboxMulti.querySelectorAll("input[name='id']:checked");

        const typeChange = e.target.elements.type.value;

        if (typeChange == "delete-all") {
            const isConfirm = confirm("Bạn có chắc chắn muốn xóa tất cả các bản ghi đã chọn?");

            if (!isConfirm) {
                return;
            }
        }

        if (inputsChecked.length > 0) {
            let ids = [];
            const inputIds = formChangeMulti.querySelector("input[name='ids']");
            inputsChecked.forEach(input => {
                const id = input.value;

                if (typeChange == "change-position") {
                    const position = input.closest("tr").querySelector("input[name='position']").value;

                    ids.push(`${id}-${position}`);
                } else {
                    ids.push(id);
                }
            })

            inputIds.value = ids.join(", ");

            formChangeMulti.submit();
        } else {
            alert(" Vui lòng chọn ít nhất một bản ghi");
        }
    });
}
// end form change multi

// show alert
const showAlert = document.querySelector("[show-alert]")
if (showAlert) {
    const time = parseInt(showAlert.getAttribute("data-time"));
    const closeAlert = showAlert.querySelector("[close-alert]");
    setTimeout(() => {
        showAlert.classList.add("alert-hidden");
    }, time);
    closeAlert.addEventListener("click", () => {
        showAlert.classList.add("alert-hidden");
    })
}
// end show alert

// upload image
const uploadImage = document.querySelector("[upload-image]");
if (uploadImage) {
    const uploadImageInput = document.querySelector("[upload-image-input]");
    const uploadImagePreview = document.querySelector("[upload-image-preview]");
    const removeImage = document.querySelector("[removeImage]");

    uploadImageInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (file) {
            uploadImagePreview.src = URL.createObjectURL(file);
            removeImage.style.display = 'block';
        }
    });
    removeImage.addEventListener("click", () => {
        uploadImageInput.value = '';
        uploadImagePreview.src = '';
        removeImage.style.display = 'none';
    })
}
// end upload image