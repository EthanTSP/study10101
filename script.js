class StudyTimer {
    constructor() {
        this.isRunning = false;
        this.isPaused = false;
        this.currentMode = 'study'; // 'study' or 'break'
        this.timeLeft = 120 * 60; // 25 minutes in seconds
        this.totalTime = 120 * 60;
        this.interval = null;
        this.tasks = [];
        this.stats = {
            completedTasks: 0,
            studySessions: 0,
            breakSessions: 0
        };

        this.initializeElements();
        this.bindEvents();
        this.updateDisplay();
        this.updateStats();
    }

    initializeElements() {
        this.timerDisplay = document.getElementById('timerDisplay');
        this.timerLabel = document.getElementById('timerLabel');
        this.progressFill = document.getElementById('progressFill');
        this.startBtn = document.getElementById('startBtn');
        this.pauseBtn = document.getElementById('pauseBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.studyBtn = document.getElementById('studyBtn');
        this.breakBtn = document.getElementById('breakBtn');
        this.taskInput = document.getElementById('taskInput');
        this.addTaskBtn = document.getElementById('addTaskBtn');
        this.tasksList = document.getElementById('tasksList');
        this.completedTasksEl = document.getElementById('completedTasks');
        this.studySessionsEl = document.getElementById('studySessions');
        this.breakSessionsEl = document.getElementById('breakSessions');
    }

    bindEvents() {
        this.startBtn.addEventListener('click', () => this.startTimer());
        this.pauseBtn.addEventListener('click', () => this.pauseTimer());
        this.resetBtn.addEventListener('click', () => this.resetTimer());
        this.studyBtn.addEventListener('click', () => this.setMode('study'));
        this.breakBtn.addEventListener('click', () => this.setMode('break'));
        this.addTaskBtn.addEventListener('click', () => this.addTask());
        this.taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTask();
        });
    }

    startTimer() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.startBtn.disabled = true;
            this.pauseBtn.disabled = false;

            this.interval = setInterval(() => {
                this.timeLeft--;
                this.updateDisplay();
                this.updateProgress();

                if (this.timeLeft <= 0) {
                    this.completeSession();
                }
            }, 1000);
        }
    }

    pauseTimer() {
        if (this.isRunning) {
            this.isRunning = false;
            this.isPaused = true;
            this.startBtn.disabled = false;
            this.pauseBtn.disabled = true;
            clearInterval(this.interval);
        }
    }

    resetTimer() {
        this.isRunning = false;
        this.isPaused = false;
        clearInterval(this.interval);
        this.startBtn.disabled = false;
        this.pauseBtn.disabled = true;

        if (this.currentMode === 'study') {
            this.timeLeft = 25 * 60;
            this.totalTime = 25 * 60;
        } else {
            this.timeLeft = 5 * 60;
            this.totalTime = 5 * 60;
        }

        this.updateDisplay();
        this.updateProgress();
    }

    setMode(mode) {
        if (this.isRunning) return;

        this.currentMode = mode;

        if (mode === 'study') {
            this.timeLeft = 25 * 60;
            this.totalTime = 25 * 60;
            this.timerLabel.textContent = 'Study Session';
        } else {
            this.timeLeft = 5 * 60;
            this.totalTime = 5 * 60;
            this.timerLabel.textContent = 'Break Time';
        }

        this.updateDisplay();
        this.updateProgress();
    }

    completeSession() {
        this.isRunning = false;
        clearInterval(this.interval);
        this.startBtn.disabled = false;
        this.pauseBtn.disabled = true;

        if (this.currentMode === 'study') {
            this.stats.studySessions++;
            this.showModal('Study Session Complete!', 'Great job! You\'ve completed a 25-minute study session. Time for a well-deserved break!', 'break');
        } else {
            this.stats.breakSessions++;
            this.showModal('Break Time Over!', 'Hope you feel refreshed! Ready to dive back into your studies?', 'study');
        }

        this.updateStats();
    }

    showModal(title, message, nextMode) {
        // Create modal backdrop
        const backdrop = document.createElement('div');
        backdrop.className = 'modal-backdrop';
        backdrop.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            z-index: 1000;
            display: flex;
            align-items: center;
            justify-content: center;
        `;

        // Create modal content
        const modal = document.createElement('div');
        modal.className = 'completion-modal';
        modal.style.cssText = `
            background: linear-gradient(135deg, #5a4fcf, #3b82f6);
            border-radius: 20px;
            padding: 40px;
            max-width: 500px;
            width: 90%;
            text-align: center;
            color: white;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
            transform: scale(0.7);
            opacity: 0;
            transition: all 0.3s ease;
        `;

        const icon = nextMode === 'break' ? '🎉' : '💪';

        modal.innerHTML = `
            <div style="font-size: 4rem; margin-bottom: 20px;">${icon}</div>
            <h2 style="margin-bottom: 20px; font-size: 1.8rem;">${title}</h2>
            <p style="margin-bottom: 30px; font-size: 1.1rem; line-height: 1.5;">${message}</p>
            <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
                <button class="modal-btn-primary" style="
                    background: rgba(255, 255, 255, 0.9);
                    color: #4c1d95;
                    border: none;
                    padding: 12px 25px;
                    border-radius: 25px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    font-size: 1rem;
                ">
                    Start ${nextMode === 'break' ? 'Break' : 'Study Session'}
                </button>
                <button class="modal-btn-secondary" style="
                    background: rgba(255, 255, 255, 0.2);
                    color: white;
                    border: 1px solid rgba(255, 255, 255, 0.3);
                    padding: 12px 25px;
                    border-radius: 25px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    font-size: 1rem;
                ">
                    Maybe Later
                </button>
            </div>
        `;

        // Add hover effects
        const primaryBtn = modal.querySelector('.modal-btn-primary');
        const secondaryBtn = modal.querySelector('.modal-btn-secondary');

        primaryBtn.addEventListener('mouseenter', () => {
            primaryBtn.style.transform = 'translateY(-2px)';
            primaryBtn.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.2)';
        });

        primaryBtn.addEventListener('mouseleave', () => {
            primaryBtn.style.transform = 'translateY(0)';
            primaryBtn.style.boxShadow = 'none';
        });

        secondaryBtn.addEventListener('mouseenter', () => {
            secondaryBtn.style.background = 'rgba(255, 255, 255, 0.3)';
        });

        secondaryBtn.addEventListener('mouseleave', () => {
            secondaryBtn.style.background = 'rgba(255, 255, 255, 0.2)';
        });

        // Event listeners
        primaryBtn.addEventListener('click', () => {
            this.setMode(nextMode);
            this.removeModal(backdrop);
            // Auto-start the next session
            setTimeout(() => this.startTimer(), 500);
        });

        secondaryBtn.addEventListener('click', () => {
            this.setMode(nextMode);
            this.removeModal(backdrop);
        });

        // Close on backdrop click
        backdrop.addEventListener('click', (e) => {
            if (e.target === backdrop) {
                this.setMode(nextMode);
                this.removeModal(backdrop);
            }
        });

        // Close on Escape key
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                this.setMode(nextMode);
                this.removeModal(backdrop);
                document.removeEventListener('keydown', handleEscape);
            }
        };
        document.addEventListener('keydown', handleEscape);

        // Add to DOM and animate in
        backdrop.appendChild(modal);
        document.body.appendChild(backdrop);

        // Trigger animation
        setTimeout(() => {
            modal.style.transform = 'scale(1)';
            modal.style.opacity = '1';
        }, 50);

        // Play notification sound (if browser supports it)
        try {
            const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMdBjad3vO/cyMNLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMdBjad3vO/cyMNLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMdBjad3vO/cyMN');
            audio.volume = 0.3;
            audio.play().catch(() => { }); // Ignore errors if audio can't play
        } catch (e) {
            // Audio not supported, continue silently
        }
    }

    removeModal(backdrop) {
        const modal = backdrop.querySelector('.completion-modal');
        modal.style.transform = 'scale(0.7)';
        modal.style.opacity = '0';

        setTimeout(() => {
            if (backdrop.parentNode) {
                backdrop.parentNode.removeChild(backdrop);
            }
        }, 300);
    }

    updateDisplay() {
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        this.timerDisplay.textContent =
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    updateProgress() {
        const progress = ((this.totalTime - this.timeLeft) / this.totalTime) * 100;
        this.progressFill.style.width = `${progress}%`;
    }

    addTask() {
        const taskText = this.taskInput.value.trim();
        if (taskText === '') return;

        const task = {
            id: Date.now(),
            text: taskText,
            completed: false
        };

        this.tasks.push(task);
        this.taskInput.value = '';
        this.renderTasks();
    }

    toggleTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            task.completed = !task.completed;
            if (task.completed) {
                this.stats.completedTasks++;
            } else {
                this.stats.completedTasks--;
            }
            this.updateStats();
            this.renderTasks();
        }
    }

    deleteTask(taskId) {
        const taskIndex = this.tasks.findIndex(t => t.id === taskId);
        if (taskIndex !== -1) {
            if (this.tasks[taskIndex].completed) {
                this.stats.completedTasks--;
                this.updateStats();
            }
            this.tasks.splice(taskIndex, 1);
            this.renderTasks();
        }
    }

    renderTasks() {
        this.tasksList.innerHTML = '';

        this.tasks.forEach(task => {
            const taskElement = document.createElement('div');
            taskElement.className = `task-item ${task.completed ? 'completed' : ''}`;

            taskElement.innerHTML = `
                <span class="task-text">${task.text}</span>
                <div class="task-actions">
                    <button class="btn-task btn-complete" onclick="timer.toggleTask(${task.id})">
                        <i class="fas fa-check"></i>
                    </button>
                    <button class="btn-task btn-delete" onclick="timer.deleteTask(${task.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;

            this.tasksList.appendChild(taskElement);
        });
    }

    updateStats() {
        this.completedTasksEl.textContent = this.stats.completedTasks;
        this.studySessionsEl.textContent = this.stats.studySessions;
        this.breakSessionsEl.textContent = this.stats.breakSessions;
    }
}

// Initialize the timer when the page loads
let timer;
document.addEventListener('DOMContentLoaded', function () {
    timer = new StudyTimer();
});