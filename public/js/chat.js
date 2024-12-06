import * as Popper from 'https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js'

// fileUploadwidthpreview
const upload = new FileUploadWithPreview.FileUploadWithPreview('upload-img', {
    multiple: true,
    maxFileCount: 6
});

// CLIENT_SEND_MESSAGE
const formsendData = document.querySelector(".chat .inner-form");
if (formsendData) {
    formsendData.addEventListener("submit", (e) => {
        e.preventDefault();
        const content = e.target.elements.content.value;
        const img = upload.cachedFileArray || [];

        if (content || img.length > 0) {
            // gửi content hoặc ảnh lên server
            socket.emit("CLIENT_SEND_MESSAGE", {
                content: content,
                images: img
            });
            e.target.elements.content.value = "";
            upload.resetPreviewPanel();
            socket.emit("CLIENT_SEND_TYPING", "hidden");
        }
    });
}
//END CLIENT_SEND_MESSAGE

// SERVER_RETURN_MESSAGE
socket.on("SERVER_RETURN_MESSAGE", (data) => {
    const myId = document.querySelector("[my-id]").getAttribute("my-id");
    const body = document.querySelector(".chat .inner-body");
    const boxTyping = document.querySelector(".inner-list-typing")

    const div = document.createElement("div");

    let htmlFullName = "";
    let htmlContent = "";
    let htmlImages = "";

    if (myId == data.user_id) {
        div.classList.add("inner-outgoing");
    } else {
        htmlFullName = `<div class="inner-name">${data.fullName}</div>`;
        div.classList.add("inner-incoming");
    }
    if (data.content) {
        htmlContent = `<div class="inner-content">${data.content}</div>`;
    }
    if (data.images) {
        htmlImages += `<div class="inner-images">`;
        for (const image of data.images) {
            htmlImages += `
            <img src="${image}">
            `;
        }
        htmlImages += `</div>`;
    }
    div.innerHTML = `
    ${htmlFullName}
    ${htmlContent}
    ${htmlImages}
    `;

    body.insertBefore(div, boxTyping);

    body.scrollTop = body.scrollHeight;

    // preview image
    const boxImage = div.querySelector(".inner-images");
    if (boxImage) {
        const gallery = new Viewer(boxImage);
    }
})
// END SERVER_RETURN_MESSAGE

// scroll chat to bottom
const bodyChat = document.querySelector(".chat .inner-body");
if (bodyChat) {
    bodyChat.scrollTop = bodyChat.scrollHeight;
}
// end scroll chat to bottom

// show typing
var timeOut;
const showTyping = () => {
    socket.emit("CLIENT_SEND_TYPING", "show");

    clearTimeout(timeOut);

    timeOut = setTimeout(() => {
        socket.emit("CLIENT_SEND_TYPING", "hidden");
    }, 3000);
}
// end show typing

// emoji-picker
const buttonIcon = document.querySelector(".button-icon");
if (buttonIcon) {
    const tooltip = document.querySelector(".tooltip");
    Popper.createPopper(buttonIcon, tooltip);

    buttonIcon.onclick = () => {
        tooltip.classList.toggle('shown')
    }
}

const emojiPicker = document.querySelector("emoji-picker");
if (emojiPicker) {
    const inputChat = document.querySelector(".chat .inner-form input[name='content']");
    emojiPicker.addEventListener("emoji-click", (event) => {
        const icon = event.detail.unicode;
        inputChat.value = inputChat.value + icon;
        inputChat.setSelectionRange(inputChat.value.length, inputChat.value.length);
        inputChat.focus();
        showTyping();

    });

    inputChat.addEventListener("keyup", () => {
        showTyping();
    });
}
// end emoji-picker

// SERVER_RETURN_TYPING
const elementListTyping = document.querySelector(".chat .inner-list-typing");
if (elementListTyping) {
    socket.on("SERVER_RETURN_TYPING", (data) => {
        if (data.type == "show") {
            const exitTyping = document.querySelector(`[user-id="${data.userId}"]`);

            if (!exitTyping) {
                const boxTyping = document.createElement("div");
                boxTyping.classList.add("box-typing");
                boxTyping.setAttribute("user-id", data.userId);
                boxTyping.innerHTML = `
                <div class="inner-name">${data.fullName}</div>
                <div class="inner-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
                `;
                elementListTyping.appendChild(boxTyping);
                bodyChat.scrollTop = bodyChat.scrollHeight;
            }
        } else {
            const boxTypingRemove = elementListTyping.querySelector(`[user-id="${data.userId}"]`);
            if (boxTypingRemove) {
                elementListTyping.removeChild(boxTypingRemove);
            }
        }

    });
}

// End SERVER_RETURN_TYPING

// preview iamge
const chatBody = document.querySelector(".chat .inner-body");

if (chatBody) {
    const gallery = new Viewer(chatBody);
}
// end preview iamge