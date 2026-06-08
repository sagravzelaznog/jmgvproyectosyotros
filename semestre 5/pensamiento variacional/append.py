append_script = """
// Reveal bottom nav when scrolling to the end
document.addEventListener('DOMContentLoaded', () => {
    const bottomNav = document.querySelector('.bottom-nav');
    if (bottomNav) {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                bottomNav.classList.add('visible');
            }
        }, { threshold: 0.1 });
        
        // Observe the bottom nav itself or the quiz container
        const quizPoint = document.getElementById('quiz-mount-point');
        if (quizPoint) observer.observe(quizPoint);
        else observer.observe(bottomNav);
    }
});
"""

with open("js/script.js", "a", encoding="utf-8") as f:
    f.write("\n" + append_script)
