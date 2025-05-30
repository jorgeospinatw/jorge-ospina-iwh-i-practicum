require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.
const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS;

// TODO: ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.

// * Code for Route 1 goes here
app.get('/', async (req, res) => {
    const propertiesToGet = 'firstname,lastname,email,favorite_food,favorite_music,favorite_movie';
    const contactsUrl = `https://api.hubspot.com/crm/v3/objects/contacts?properties=${propertiesToGet}`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }
    try {
        const resp = await axios.get(contactsUrl, { headers });
        const data = resp.data.results;
        res.render('homepage', { title: 'Contacts | HubSpot APIs', data });      
    } catch (error) {
        console.error(error);
    }
});

// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.

// * Code for Route 2 goes here
app.get('/update-form', async (req, res) => {
    const contactId = req.query.contactId;
    // Properties to fetch for the form
    const propertiesToGet = 'firstname,lastname,email,favorite_food,favorite_music,favorite_movie';
    const getContactUrl = `https://api.hubapi.com/crm/v3/objects/contacts/${contactId}?properties=${propertiesToGet}`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try {
        const resp = await axios.get(getContactUrl, { headers });
        const contactData = resp.data;
        res.render('update-form', { title: 'Update Contact | HubSpot APIs', contact: contactData });
    } catch (error) {
        console.error('Error fetching contact for update:', error.message);
        if (error.response) {
            console.error('Error details:', error.response.data);
        }
        res.status(500).send('Error fetching contact data. Please check the console.');
    }
});

// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.

// * Code for Route 3 goes here
app.post('/update-contact/:contactId', async (req, res) => {
    const contactId = req.params.contactId;
    const updatePayload = {
        properties: {
            "favorite_food": req.body.favorite_food,
            "favorite_music": req.body.favorite_music,
            "favorite_movie": req.body.favorite_movie
        }
    };

    const updateContactUrl = `https://api.hubapi.com/crm/v3/objects/contacts/${contactId}`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try {
        await axios.patch(updateContactUrl, updatePayload, { headers });
        res.redirect('/'); // Redirect to the homepage after successful update
    } catch (err) {
        console.error('Error updating contact:', err.message);
        if (err.response) {
            console.error('Error details:', err.response.data);
        }
        res.status(500).send('Error updating contact. Please check the console and ensure the custom properties exist in your HubSpot account.');
    }
});

app.get('/create-form', (req, res) => {
    res.render('create-form', { title: 'Create New Contact | HubSpot APIs' });
});

app.post('/create-contact', async (req, res) => {
    const createPayload = {
        properties: {
            "firstname": req.body.firstname,
            "lastname": req.body.lastname,
            "email": req.body.email,
            "favorite_food": req.body.favorite_food,
            "favorite_music": req.body.favorite_music,
            "favorite_movie": req.body.favorite_movie
        }
    };

    const createContactUrl = 'https://api.hubapi.com/crm/v3/objects/contacts';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try {
        await axios.post(createContactUrl, createPayload, { headers });
        res.redirect('/'); // Redirect to the homepage after successful creation
    } catch (err) {
        console.error('Error creating contact:', err.message);
        if (err.response) {
            console.error('Error details:', err.response.data);
        }
        res.status(500).send('Error creating contact. Please check the console. Ensure email is unique if required by HubSpot settings.');
    }
});

/** 
* * This is sample code to give you a reference for how you should structure your calls. 

* * App.get sample
app.get('/contacts', async (req, res) => {
    const contacts = 'https://api.hubspot.com/crm/v3/objects/contacts';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }
    try {
        const resp = await axios.get(contacts, { headers });
        const data = resp.data.results;
        res.render('contacts', { title: 'Contacts | HubSpot APIs', data });      
    } catch (error) {
        console.error(error);
    }
});

* * App.post sample
app.post('/update', async (req, res) => {
    const update = {
        properties: {
            "favorite_book": req.body.newVal
        }
    }

    const email = req.query.email;
    const updateContact = `https://api.hubapi.com/crm/v3/objects/contacts/${email}?idProperty=email`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try { 
        await axios.patch(updateContact, update, { headers } );
        res.redirect('back');
    } catch(err) {
        console.error(err);
    }

});
*/


// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));

