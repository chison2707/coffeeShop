document.addEventListener('DOMContentLoaded', function () {
    const alerts = document.querySelectorAll('.alert[show-alert]');

    alerts.forEach(alert => {
        const time = alert.getAttribute('data-time');
        const closeButton = alert.querySelector('.close-alert');

        // Show alert with slide-in effect
        setTimeout(() => {
            alert.classList.add('show');
        }, 100);

        // Auto-close after specified time with slide-out effect
        setTimeout(() => {
            alert.classList.add('hide');
            setTimeout(() => alert.remove(), 500); // Remove alert after animation ends
        }, time);

        // Close alert on close button click with slide-out effect
        closeButton.addEventListener('click', () => {
            alert.classList.add('hide');
            setTimeout(() => alert.remove(), 500); // Remove alert after animation ends
        });
    });
});

// button go back

const btnGoBack = document.querySelectorAll("[btn-go-back]");
if (btnGoBack.length > 0) {
    btnGoBack.forEach(btn => {
        btn.addEventListener("click", () => {
            history.back();
        });
    });
}

// end button go back