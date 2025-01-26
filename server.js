const express = require('express');
const bodyParser = require('body-parser');
const { Groq } = require('groq-sdk'); // Correct import

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Initialize Groq client
const groq = new Groq({
    apiKey: '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' // Replace with your actual Groq API key
});

app.post('/generate-story', async (req, res) => {
    const { event, genre } = req.body;

    if (!event || !genre) {
        return res.status(400).json({ error: 'Both event and genre are required.' });
    }

    try {
        const prompt = `Write a short fictional story under 500 words about ${event} in the ${genre} genre.`;
        console.log('Prompt:', prompt);

        // Use the correct method for generating completions
        const response = await groq.chat.completions.create({
            messages: [
                {
                    role: 'user', // The role is 'user' for the input prompt
                    content: prompt, // The prompt goes here
                },
            ],
            model: 'mixtral-8x7b-32768', // Use the correct model name
            max_tokens: 1000,
            temperature: 0.7,
        });

        console.log('API Response:', response);

        if (response.choices && response.choices.length > 0) {
            const story = response.choices[0].message.content.trim();
            res.json({ story });
        } else {
            res.status(500).json({ error: 'No story generated.' });
        }
    } catch (error) {
        console.error('Error generating story:', error);
        res.status(500).json({ error: error.message || 'Failed to generate story.' });
    }
});

function displayStoryWordByWord(story) {
    const storyOutput = document.getElementById('storyOutput');
    const words = story.split(' ');
    let index = 0;

    function addWord() {
        if (index < words.length) {
            const wordSpan = document.createElement('span');
            wordSpan.textContent = words[index] + ' ';
            wordSpan.classList.add('fade-in');
            storyOutput.appendChild(wordSpan);

            index++;
            setTimeout(addWord, 100);
        } else {
            // Add a blinking cursor at the end
            const cursor = document.createElement('span');
            cursor.classList.add('cursor');
            storyOutput.appendChild(cursor);
        }
    }

    addWord();
}

function scrollToBottom() {
    const isUserAtBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 50; // 50px threshold
    if (isUserAtBottom) {
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'smooth',
        });
    }
}

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});