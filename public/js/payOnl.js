const pathParts = window.location.pathname.split('/');
const orderId = pathParts[pathParts.length - 1];
socket.on(`order-status-updated-${orderId}`, (data) => {
    console.log('Cập nhật trạng thái đơn hàng:', data.status);

    if (data.status === 'payed') {
        window.location.href = `/checkout/success/${orderId}`;
    }
});