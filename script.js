document.addEventListener('DOMContentLoaded', () => {
    // 1. Setup Fixed Due Date (Offset logic)
    // Setting it to 3 days from now for demonstration
    const offsetInMs = 3 * 24 * 60 * 60 * 1000; 
    const dueDate = new Date(Date.now() + offsetInMs);

    const dueDateEl = document.getElementById('due-date-display');
    const timeRemainingEl = document.getElementById('time-remaining-display');
    const completeCheckbox = document.getElementById('complete-checkbox');
    const todoCard = document.querySelector('[data-testid="test-todo-card"]');
    const statusIndicator = document.querySelector('[data-testid="test-todo-status"]');

    // Format Due Date
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    dueDateEl.textContent = `Due ${dueDate.toLocaleDateString('en-US', options)}`;
    dueDateEl.setAttribute('datetime', dueDate.toISOString());

    // 2. Time Remaining Logic
    function updateTimeRemaining() {
        const now = new Date();
        const diff = dueDate - now;

        let text = "";
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);

        if (diff < 0) {
            text = "Overdue!";
        } else if (days > 1) {
            text = `Due in ${days} days`;
        } else if (days === 1) {
            text = "Due tomorrow";
        } else if (hours >= 1) {
            text = `Due in ${hours} hours`;
        } else {
            text = "Due now!";
        }

        timeRemainingEl.textContent = text;
    }

    // 3. Completion Toggle Logic
    completeCheckbox.addEventListener('change', (e) => {
        if (e.target.checked) {
            todoCard.classList.add('is-completed');
            statusIndicator.textContent = 'Done';
        } else {
            todoCard.classList.remove('is-completed');
            statusIndicator.textContent = 'Pending';
        }
    });

    // 4. Dummy Button Actions
    document.querySelector('[data-testid="test-todo-edit-button"]').addEventListener('click', () => {
        console.log("edit clicked");
    });

    document.querySelector('[data-testid="test-todo-delete-button"]').addEventListener('click', () => {
        alert("Delete clicked");
    });

    // Initial Run
    updateTimeRemaining();
    
    // Optional: Refresh every 60 seconds
    setInterval(updateTimeRemaining, 60000);
});