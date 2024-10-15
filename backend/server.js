const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5515;

app.use(cors());
app.use(express.json());

const { Vonage } = require('@vonage/server-sdk')
const vonage = new Vonage({
  apiKey: "",
  apiSecret: ""
})



app.get('/', (req, res) => {
  res.send('Hello from the backend!');
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

async function sendSMS(to, from, text) {
    await vonage.sms.send({ to, from, text })
        .then(resp => {
            console.log('Message sent successfully');
            console.log(resp);
        })
        .catch(err => {
            console.log('There was an error sending the messages.');
            console.error(err);
        });
}
app.post('/api/submit-form', async(req, res) => {
    const formData = req.body;
    
    const query = `
    Only respond with JSON object. You are an experienced programmer with JSON and a health 
    expert with over 20 years of experience for the rest of this chat. For the rest of this chat you will input the responses I need into the JSON Object given below. Don't reply if you understand.JSON file
    }Only respond with JSON object and stick strictly to this json format. Limit response to 300 tokens maximum. Be very concise.`;

    queryTwo = `Only respond with JSON object. The user wants to improve their ${formData.goal} training. Insert various types of ${formData.goal} training 
    exercises in the ${formData.goal} part of the JSON object from for sub categories: easy, medium, and hard. With names and descriptions only.
    Read through this prompt step by step. Only respond with JSON object. Only have a single quote at either end of the JSON object. Again, limit
    response to 300 tokens maximum.`;

{

    }
    const options = {
        method: 'POST',
        headers: {
            Authorization: '<TOKEN>',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "model": "llama-3.1-sonar-small-128k-online",
            "messages": [
                {"role": "system", "content": query},
                {"role": "user", "content": queryTwo}  // Use the user's input here
            ],
            "max_tokens": 700,
            "temperature": 0.2,
            "top_p": 0.9,
            "return_citations": false,
            "search_domain_filter": ["perplexity.ai"],
            "return_images": false,
            "return_related_questions": false,
            "search_recency_filter": "month",
            "top_k": 0,
            "stream": false,
            "presence_penalty": 0,
            "frequency_penalty": 1
        })
    };

    const apiResponse = await fetch('https://api.perplexity.ai/chat/completions', options);
    const apiData = await apiResponse.json();

    let content = apiData.choices[0].message.content;
    //console.log(content);
    if (content.includes('json')) {
        content = content.replace('json', '');
    } 
    if (content.includes('\'')) {
         content = content.replaceAll('\'', '');
    }
    if (content.includes('\`')) {
        content = content.replaceAll('\`', '');
    }
   

    //console.log(content);
    //content += "\'";
    //content = "\'" + content;
    
        parsedContent = JSON.parse(content);
        console.log(parsedContent);

    
   
     

    // Function to generate user-friendly text
    let resultArr = [];
    let result = "";
 
    // ordered from easy to hard
    let easyString = " ";
    let mediumString = " ";
    let hardString = " ";
    for (const category in parsedContent) {
        console.log(category);
        
        // for (const exercise in parsedContent.easy) {
        //     easyString += exercise.name + ": " + exercise.description + "/n";
        // }
        // for (const exercise in parsedContent.medium) {
        //     mediumString += exercise.name + ": " + exercise.description + "/n";
        // }
        // for (const exercise in parsedContent.hard) {
        //     hardString += exercise.name + ": " + exercise.description + "/n";
        // }
        for (const level in parsedContent[category]) {
            result = "";
            result += `\n  ${level.charAt(0).toUpperCase() + level.slice(1)} exercises:\n`;
            parsedContent[category][level].forEach(exercise => {
            result += `   - ${exercise.name}: ${exercise.description}\n`;
        });
        resultArr.push(result);
        }
    }

    resultArr = resultArr.filter((value, index) => resultArr.indexOf(value) === index);

    easyString = resultArr[0];
    mediumString = resultArr[1];
    hardString = resultArr[2];

   console.log(resultArr);
   console.log(easyString);
   console.log(mediumString);
   console.log(hardString);

    //console.log(parsedContent.goalName.hard[0].name + ": " + parsedContent.goalName.hard[0].description);
    
    // for (let i = 0; i < parsedContent.goalName.hard.length; i++) {
    //     console.log(parsedContent.goalName.hard[i]);
    //     console.log(parsedContent.goalName.hard[i]);
    //     console.log(parsedContent.goalName.hard[i]);
    // }
    res.json({ 
      message: 'Form data received and processed successfully',
      aiResponse: content,
      easy: easyString,
      medium: mediumString,
      hard: hardString
    });

});
 
app.post('/api/submit-form2', async(req, res) => {
    form = req.body;
    console.log(req.body);
    console.log(form.phoneNumber);
    console.log(form.difficulty);
    const from = "13024867168";
    const to = form.phoneNumber;
    const text = form.difficulty;
    try {
        await sendSMS(to, from, text);
        res.json({ message: 'SMS sent successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to send SMS' });
    }
    
});
