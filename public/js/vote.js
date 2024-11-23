// change status
const stars = document.querySelectorAll("[star-vote]");
if (stars.length > 0) {
    const formStar = document.querySelector("#form-star");
    const path = formStar.getAttribute("data-path");
    stars.forEach(s => {
        s.addEventListener("click", () => {
            const starCurrent = s.getAttribute("data-rating");
            stars.forEach(star => {
                if (star.getAttribute("data-rating") <= starCurrent) { star.style.color = 'gold'; } else {
                    star.style.color = 'grey';
                }
            })

            const action = path + `/${starCurrent}?_method=PATCH`;
            formStar.action = action;
        });
    });
}