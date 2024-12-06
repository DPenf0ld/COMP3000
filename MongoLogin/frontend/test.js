let exampleEmailIndex = 0;

const exampleEmailInstructions = [
    {
        title: "Welcome to the Email Inbox!",
        content: "This exercise will help improve your skills in identifying emails that are fraudulent attempts to steal sensitive information. These are known as phishing emails. These emails often contain suspicious links or attachments designed to trick you."
    },
    {
        title: "What are Phishing Emails?",
        content: "Phishing emails aim to deceive recipients into believing they are from legitimate sources. They use techniques such as fake sender addresses, urgent language, and malicious links or attachments."
    },
    {
        title: "Types of Phishing Emails",
        content: "There are many types of phishing emails, but we will look at the most common types. Each has unique methods but shares the goal of extracting sensitive information."
    },
];

//update the model content based on the current page
function updateEmailInstructions(exampleEmailIndex) {
    //gets the title and content
    document.querySelector('.example-title').textContent = exampleEmailInstructions[exampleEmailIndex].title;
    document.querySelector('.example-content').innerHTML = exampleEmailInstructions[exampleEmailIndex].content; //inner HTML to allow for line breaks

    // Update title and content
    titleElement.textContent = pages[currentPage].title;
    contentElement.innerHTML = pages[currentPage].content;

    // Manage button visibility
    prevButton.classList.toggle('hidden', currentPage === 0);
    nextButton.classList.toggle('hidden', currentPage === pages.length - 1);
    confirmButton.classList.toggle('hidden', currentPage !== pages.length - 1);
}

// Add event listeners 
prevButton.addEventListener('click', () => {
    if (currentPage > 0) {
        examplEmailIndex--;
        updateEmailInstructions();
    }
});

nextButton.addEventListener('click', () => {
    if (currentPage < pages.length - 1) {
        examplEmailIndex++;
        updateEmailInstructions();
    }
});
