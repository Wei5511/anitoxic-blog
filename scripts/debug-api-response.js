const axios = require('axios');

async function check() {
    try {
        console.log('Checking /api/seasons...');
        const resSeasons = await axios.get('http://localhost:3000/api/seasons');
        const dataSeasons = resSeasons.data;
        const years = [...new Set(dataSeasons.data.map(i => i.year))];
        console.log('Years returned:', years.join(', '));

        console.log('\nChecking /api/database?query=Fate...');
        const resFate = await axios.get('http://localhost:3000/api/database?query=Fate');
        const dataFate = resFate.data;
        const fate = dataFate.data.find(a => a.title.includes('Fate/strange'));
        if (fate) {
            console.log('Fate Image URL:', fate.image_url);
        } else {
            console.log('Fate entry not found in API response.');
        }

    } catch (e) {
        console.error('Error:', e.message);
        if (e.response) console.error('Data:', e.response.data);
    }
}

check();
