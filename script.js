document.addEventListener('DOMContentLoaded', () => {
    // ============ ELEMENT REFERENCES ============
    const todoCard = document.querySelector('[data-testid="test-todo-card"]');
    const todoViewMode = document.getElementById('todo-view-mode');
    const todoEditMode = document.getElementById('todo-edit-mode');
    
    // Title & Description
    const todoTitle = document.getElementById('todo-title');
    const todoDescription = document.querySelector('[data-testid="test-todo-description"]');
    
    // Priority
    const priorityBadge = document.querySelector('[data-testid="test-todo-priority"]');
    const priorityIndicator = document.querySelector('[data-testid="test-todo-priority-indicator"]');
    
    // Status
    const statusControl = document.getElementById('status-select');
    
    // Checkbox
    const completeCheckbox = document.getElementById('complete-checkbox');
    
    // Time & Date
    const dueDateEl = document.getElementById('due-date-display');
    const timeRemainingEl = document.getElementById('time-remaining-display');
    const overdueIndicator = document.querySelector('[data-testid="test-todo-overdue-indicator"]');
    
    // Expand/Collapse
    const expandToggle = document.getElementById('expand-toggle-btn');
    const collapsibleSection = document.getElementById('collapsible-content');
    
    // Buttons
    const editBtn = document.querySelector('[data-testid="test-todo-edit-button"]');
    const deleteBtn = document.querySelector('[data-testid="test-todo-delete-button"]');
    
    // Edit Form
    const editForm = document.querySelector('[data-testid="test-todo-edit-form"]');
    const editTitleInput = document.getElementById('edit-title-input');
    const editDescriptionInput = document.getElementById('edit-description-input');
    const editPrioritySelect = document.getElementById('edit-priority-select');
    const editDueDateInput = document.getElementById('edit-due-date-input');
    const saveBtn = document.querySelector('[data-testid="test-todo-save-button"]');
    const cancelBtn = document.getElementById('cancel-btn');

    // ============ STATE MANAGEMENT ============
    let todoState = {
        title: todoTitle.textContent.trim(),
        description: todoDescription.textContent.trim(),
        priority: priorityBadge.textContent.trim(), // "Low", "Medium", "High"
        status: statusControl.value,
        dueDate: null,
        isCompleted: false,
        isCollapsed: true
    };

    // ============ INITIAL SETUP ============
    // 1. Setup Fixed Due Date (Offset logic - 3 days from now)
    const offsetInMs = 3 * 24 * 60 * 60 * 1000; 
    todoState.dueDate = new Date(Date.now() + offsetInMs);

    // Format Due Date
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    dueDateEl.textContent = `Due ${todoState.dueDate.toLocaleDateString('en-US', options)}`;
    dueDateEl.setAttribute('datetime', todoState.dueDate.toISOString());

    // Set edit form due date input
    editDueDateInput.valueAsDate = todoState.dueDate;

    // 2. Set up expand/collapse for long descriptions
    setupExpandCollapse();

    // 3. Initialize priority indicator color
    updatePriorityIndicator();

    // 4. Check if description should be collapsed
    checkDescriptionLength();

    // ============ EVENT LISTENERS ============

    // Checkbox completion toggle
    completeCheckbox.addEventListener('change', (e) => {
        todoState.isCompleted = e.target.checked;
        if (e.target.checked) {
            todoCard.classList.add('is-completed');
            statusControl.value = 'Done';
            todoState.status = 'Done';
        } else {
            todoCard.classList.remove('is-completed');
            statusControl.value = 'Pending';
            todoState.status = 'Pending';
        }
        updateTimeDisplay();
    });

    // Status control dropdown
    statusControl.addEventListener('change', (e) => {
        todoState.status = e.target.value;
        
        if (e.target.value === 'Done') {
            completeCheckbox.checked = true;
            todoCard.classList.add('is-completed');
        } else {
            completeCheckbox.checked = false;
            todoCard.classList.remove('is-completed');
        }

        if (e.target.value === 'In Progress') {
            todoCard.classList.add('status-in-progress');
        } else {
            todoCard.classList.remove('status-in-progress');
        }

        updateTimeDisplay();
    });

    // Edit button
    editBtn.addEventListener('click', () => {
        enterEditMode();
    });

    // Save button
    saveBtn.addEventListener('click', (e) => {
        e.preventDefault();
        saveChanges();
    });

    // Cancel button
    cancelBtn.addEventListener('click', () => {
        exitEditMode();
    });

    // Delete button
    deleteBtn.addEventListener('click', () => {
        alert("Delete clicked");
    });

    // Expand/Collapse toggle
    expandToggle.addEventListener('click', toggleExpand);

    // ============ FUNCTIONS ============

    function setupExpandCollapse() {
        const descriptionLength = todoDescription.textContent.trim().length;
        // Collapse if description is longer than 150 characters
        if (descriptionLength > 150) {
            todoState.isCollapsed = true;
            collapsibleSection.classList.remove('expanded');
            expandToggle.setAttribute('aria-expanded', 'false');
            expandToggle.textContent = 'Show more';
        } else {
            collapsibleSection.classList.add('expanded');
            expandToggle.setAttribute('aria-expanded', 'true');
            expandToggle.style.display = 'none';
        }
    }

    function checkDescriptionLength() {
        const descriptionLength = todoDescription.textContent.trim().length;
        if (descriptionLength <= 150) {
            expandToggle.style.display = 'none';
        }
    }

    function toggleExpand() {
        todoState.isCollapsed = !todoState.isCollapsed;
        collapsibleSection.classList.toggle('expanded');
        expandToggle.setAttribute('aria-expanded', todoState.isCollapsed ? 'false' : 'true');
        expandToggle.textContent = todoState.isCollapsed ? 'Show more' : 'Show less';
    }

    function updatePriorityIndicator() {
        const priority = todoState.priority.toLowerCase();
        priorityIndicator.className = 'priority-indicator';
        priorityIndicator.classList.add(`priority-${priority}`);
    }

    function updateTimeRemaining() {
        const now = new Date();
        const diff = todoState.dueDate - now;

        let text = "";
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);

        if (diff < 0) {
            // Overdue
            const absDays = Math.abs(days);
            const absHours = Math.abs(hours);
            
            if (absDays > 0) {
                text = `Overdue by ${absDays} day${absDays > 1 ? 's' : ''}`;
            } else if (absHours > 0) {
                text = `Overdue by ${absHours} hour${absHours > 1 ? 's' : ''}`;
            } else {
                text = "Overdue!";
            }
            
            timeRemainingEl.classList.add('overdue-text');
            overdueIndicator.classList.add('overdue');
            todoCard.classList.add('is-overdue');
        } else {
            // Not overdue
            timeRemainingEl.classList.remove('overdue-text');
            overdueIndicator.classList.remove('overdue');
            todoCard.classList.remove('is-overdue');

            if (days > 1) {
                text = `Due in ${days} days`;
            } else if (days === 1) {
                text = "Due tomorrow";
            } else if (hours >= 1) {
                text = `Due in ${hours} hour${hours > 1 ? 's' : ''}`;
            } else if (minutes >= 1) {
                text = `Due in ${minutes} minute${minutes > 1 ? 's' : ''}`;
            } else {
                text = "Due now!";
            }
        }

        timeRemainingEl.textContent = text;
    }

    function updateTimeDisplay() {
        if (todoState.status === 'Done') {
            timeRemainingEl.textContent = "Completed";
            timeRemainingEl.classList.remove('overdue-text');
        } else {
            updateTimeRemaining();
        }
    }

    function enterEditMode() {
        todoViewMode.style.display = 'none';
        editForm.style.display = 'flex';
        
        // Populate form with current values
        editTitleInput.value = todoState.title;
        editDescriptionInput.value = todoState.description;
        editPrioritySelect.value = todoState.priority;
        editDueDateInput.valueAsDate = todoState.dueDate;
        
        // Focus on title input
        editTitleInput.focus();
    }

    function exitEditMode() {
        todoViewMode.style.display = 'block';
        editForm.style.display = 'none';
        
        // Return focus to edit button
        editBtn.focus();
    }

    function saveChanges() {
        const newTitle = editTitleInput.value.trim();
        const newDescription = editDescriptionInput.value.trim();
        const newPriority = editPrioritySelect.value;
        const newDueDate = editDueDateInput.valueAsDate;

        // Validation
        if (!newTitle) {
            alert('Title is required');
            editTitleInput.focus();
            return;
        }

        if (!newDueDate) {
            alert('Due date is required');
            editDueDateInput.focus();
            return;
        }

        // Update state
        todoState.title = newTitle;
        todoState.description = newDescription;
        todoState.priority = newPriority;
        todoState.dueDate = newDueDate;

        // Update DOM
        todoTitle.textContent = newTitle;
        todoDescription.textContent = newDescription;
        priorityBadge.textContent = newPriority;
        priorityBadge.className = `priority-badge priority-${newPriority.toLowerCase()}`;
        
        const options = { month: 'short', day: 'numeric', year: 'numeric' };
        dueDateEl.textContent = `Due ${newDueDate.toLocaleDateString('en-US', options)}`;
        dueDateEl.setAttribute('datetime', newDueDate.toISOString());

        // Update UI
        updatePriorityIndicator();
        checkDescriptionLength();
        setupExpandCollapse();
        updateTimeDisplay();

        // Exit edit mode
        exitEditMode();
    }

    // ============ INITIAL TIME UPDATE & INTERVAL ============
    updateTimeDisplay();
    
    // Update time every 30 seconds for granular display
    setInterval(() => {
        updateTimeDisplay();
    }, 30000);
});
