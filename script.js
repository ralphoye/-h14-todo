document.addEventListener('DOMContentLoaded', () => {
    const userTime = document.getElementById('user-time');

    function updateCurrentTime() {
        userTime.textContent = Date.now();
    }

    updateCurrentTime();
    setInterval(updateCurrentTime, 500);
});