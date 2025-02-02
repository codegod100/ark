// Global declarations for HTML element references
export const target = document.getElementById("target") as HTMLElement;
export const scoreDisplay = document.getElementById("score") as HTMLElement;
export const timeDisplay = document.getElementById("timeLeft") as HTMLElement;

let score: number = 0;
let timeLeft: number = 30;
let timerId: number | null = null;

function moveTarget(): void {
    const container = document.getElementById("gameContainer") as HTMLElement;
    const maxX = container.clientWidth - target.offsetWidth;
    const maxY = container.clientHeight - target.offsetHeight;

    target.style.left = `${Math.random() * maxX}px`;
    target.style.top = `${Math.random() * maxY}px`;
}

function updateScore(): void {
    score++;
    scoreDisplay.textContent = `Score: ${score}`;
}

function updateTime(): void {
    timeLeft--;
    timeDisplay.textContent = `Time Left: ${timeLeft}`;

    if (timeLeft <= 0) {
        if (timerId) clearInterval(timerId);
        target.style.display = "none";
        alert(`Game Over! Final Score: ${score}`);
    }
}

function startGame(): void {
    score = 0;
    timeLeft = 30;
    scoreDisplay.textContent = `Score: ${score}`;
    timeDisplay.textContent = `Time Left: ${timeLeft}`;
    target.style.display = "block";
    moveTarget();

    if (timerId) clearInterval(timerId);
    timerId = window.setInterval(updateTime, 1000);
}

// Initialize event listeners
(window as any).startGame = startGame;
target.addEventListener("click", () => {
    updateScore();
    moveTarget();
});
