// Create and style the submit file button
let submitButton = document.createElement('button');
submitButton.style.backgroundColor = 'green';
submitButton.style.color = 'white';
submitButton.style.padding = '5px';
submitButton.style.border = 'none';
submitButton.style.borderRadius = '5px';
submitButton.style.margin = '5px';
submitButton.innerText = 'Submit File';

// Create and style the progress bar
let progressContainer = document.createElement('div');
progressContainer.style.width = '99%';
progressContainer.style.height = '5px';
progressContainer.style.backgroundColor = 'grey';

let progressBar = document.createElement('div');
progressBar.style.width = '0%';
progressBar.style.height = '100%';
progressBar.style.backgroundColor = 'blue';
progressContainer.appendChild(progressBar);

// Create and style the chunk size input box
let chunkSizeLabel = document.createElement('label');
chunkSizeLabel.innerText = 'Chunk Size: ';
let chunkSizeInput = document.createElement('input');
chunkSizeInput.type = 'number';
chunkSizeInput.value = 15000;
chunkSizeInput.style.padding = '5px';
chunkSizeInput.style.margin = '5px';
chunkSizeInput.style.width = '200px';
chunkSizeInput.style.backgroundColor = 'white';
chunkSizeInput.style.color = 'black'; // Set the text color to black

// Function to chunk text into smaller parts
function chunkText(text, size, fileName) {
  const chunks = [];
  let chunkNumber = 1;
  let startIndex = 0;
  while (startIndex < text.length) {
    const endIndex = Math.min(startIndex + size, text.length);
    const chunk = text.slice(startIndex, endIndex);
    const chunkInfo = `Part ${chunkNumber}:${fileName}\n${chunk}`; // Modify this line to include the chunk number and file name
    chunks.push(chunkInfo);
    chunkNumber++;
    startIndex = endIndex;
  }
  return chunks;
}

// Button click event
submitButton.addEventListener('click', async () => {
  // Create file input and get file
  let fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = '.txt,.js,.py,.html,.css,.json,.csv';
  fileInput.click();
  fileInput.onchange = async (e) => {
    let file = e.target.files[0];
    let reader = new FileReader();
    reader.readAsText(file);
    reader.onload = async (e) => {
      let text = e.target.result;
      let chunkSize = parseInt(chunkSizeInput.value) || 15000; // Get the chunk size from the input box
      let fileName = file.name; // Get the actual file name
      let chunks = chunkText(text, chunkSize, fileName); // Split into chunks of the specified size
      await submitAllChunks(chunks);
    };
  };
});

// Async function for submitting a conversation chunk
async function submitConversationChunk(text, chunkNumber) {
  const textarea = document.querySelector("textarea[placeholder='Send a message.']");
  const enterKeyEvent = new KeyboardEvent("keydown", {
    bubbles: true,
    cancelable: true,
    keyCode: 13,
  });
  textarea.value = text;
  textarea.dispatchEvent(enterKeyEvent);
  await new Promise((resolve) => setTimeout(resolve, 4000)); // Wait for the chatbot to respond

  // Return the chatbot response
  return {
    chunkNumber,
    response: textarea.value.trim(),
  };
}

// Async function for submitting all conversation chunks
async function submitAllChunks(chunks) {
  let numChunks = chunks.length;
  const textarea = document.querySelector("textarea[placeholder='Send a message.']"); // Define textarea variable here
  for (let i = 0; i < numChunks; i++) {
    let chunk = chunks[i];
    let progress = ((i + 1) / numChunks) * 100;
    progressBar.style.width = `${progress}%`;

    let { chunkNumber, response } = await submitConversationChunk(chunk, i + 1);
    console.log(`Chatbot Response (Part ${chunkNumber}):`, response);

    // You can perform any logic with the chatbot response here

    // Clear the textarea for the next chunk
    textarea.value = "";

    // Introduce a delay between chunks
    await new Promise((resolve) => setTimeout(resolve, 4000));
  }

  // Once all chunks have been submitted, turn the progress bar green
  progressBar.style.backgroundColor = "green";

  // Generate a summary of the conversation
  let summary = textarea.value.trim();
  console.log("Conversation Summary:", summary);

  // You can perform any logic with the conversation summary here
}

// Find the parent container of the element containing placeholder="Send a message."
let sendMessageContainer = document.querySelector("textarea[placeholder='Send a message.']").parentElement;
if (sendMessageContainer) {
  // Create a container for the elements
  let container = document.createElement('div');
  container.style.marginBottom = '20px'; // Add a margin to create a gap between the elements and the chat GPT input

  // Append the elements to the container
  container.appendChild(submitButton);
  container.appendChild(chunkSizeLabel);
  container.appendChild(chunkSizeInput);
  container.appendChild(progressContainer);

  // Append the container before the parent container of the element containing placeholder="Send a message."
  sendMessageContainer.insertAdjacentElement('beforebegin', container);
}
