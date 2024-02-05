document.addEventListener('DOMContentLoaded', function() {
    const background = document.getElementById('animated-background');
    const width = background.offsetWidth;
    const height = background.offsetHeight;

    function createSquare() {
        const square = document.createElement('div');
        square.style.position = 'absolute';
        square.style.width = `${Math.random() * 50 + 10}px`; // Random width for variety
        square.style.height = `${Math.random() * 50 + 10}px`; // Random height
        square.style.left = `${Math.random() * width}px`;
        square.style.top = `${Math.random() * height}px`;
        square.style.borderColor = 'dimgray'; // Initial color
        square.style.borderWidth = '2px';
        square.style.borderStyle = 'solid';
        background.appendChild(square);
        return square;
    }

    function animateSquares() {
        const squares = [];
        for (let i = 0; i < 50; i++) { // Create 50 squares
            squares.push(createSquare());
        }

        function animate() {
            squares.forEach(square => {
                square.style.borderColor = 'dimgray'; // Reset to dim gray
            });
            const index = Math.floor(Math.random() * squares.length);
            squares[index].style.borderColor = 'purple'; // Highlight one square
            setTimeout(animate, 1000); // Adjust time for effect speed
        }

        animate();
    }

    animateSquares();
});
