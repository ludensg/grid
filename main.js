function createOverlayContent() {
    // Create the main content div and style it
    let mainContent = createDiv('').addClass('main-content');
    mainContent.style('position', 'absolute');
    mainContent.style('top', '50%');
    mainContent.style('left', '50%');
    mainContent.style('transform', 'translate(-50%, -50%)');
    mainContent.style('z-index', '10');
    mainContent.style('padding', '20px');
    mainContent.style('box-sizing', 'border-box');
    mainContent.style('width', '80%');
    mainContent.style('max-width', '960px');
    mainContent.style('text-align', 'center');
    mainContent.style('background', 'rgba(255, 255, 255, 0.8)');
    mainContent.style('border-radius', '10px');
    mainContent.style('color', '#333');

    // Add header
    let header = createElement('header');
    let title = createElement('h1', 'Your Art Portfolio').parent(header);

    // Add navigation
    let nav = createElement('nav').parent(header);
    let homeLink = createA('#', 'Home').parent(nav);
    let portfolioLink = createA('#', 'Portfolio').parent(nav);
    let aboutLink = createA('#', 'About').parent(nav);
    let contactLink = createA('#', 'Contact').parent(nav);

    // Add content container
    let contentContainer = createDiv('').addClass('content-container').parent(mainContent);
    contentContainer.style('margin', '20px 0');

    // Add artwork and description
    let artworkContainer = createDiv('').addClass('artwork').parent(contentContainer);
    let artworkImage = createImg('placeholder.jpg', 'Artwork Placeholder').parent(artworkContainer);
    artworkImage.style('max-width', '100%');
    artworkImage.style('height', 'auto');
    
    let descriptionContainer = createDiv('').addClass('description').parent(contentContainer);
    let descriptionText = createP('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor erat in enim sollicitudin, vel bibendum odio mattis. Sed consectetur libero et dolor eleifend, id faucibus sapien iaculis.').parent(descriptionContainer);
}

// Call this function in the setup of sketch.js
