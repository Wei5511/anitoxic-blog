// Test AniList API with sample MAL IDs

async function testAnilistAPI() {
    const testMalIds = [5114, 11757, 16498, 9253, 11061]; // 5 sample anime from 2010-2012

    console.log('=== Testing AniList API ===\n');

    const query = `
    query ($malId: Int) {
      Media(idMal: $malId, type: ANIME) {
        id
        idMal
        title {
          romaji
          english
          native
        }
        synonyms
        description(asHtml: false)
      }
    }
    `;

    for (const malId of testMalIds) {
        try {
            const response = await fetch('https://graphql.anilist.co', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    query: query,
                    variables: { malId: malId }
                })
            });

            const json = await response.json();

            if (json.data && json.data.Media) {
                const media = json.data.Media;
                console.log(`\n--- MAL ID: ${malId} ---`);
                console.log(`Romaji: ${media.title.romaji}`);
                console.log(`English: ${media.title.english || 'N/A'}`);
                console.log(`Native: ${media.title.native}`);
                console.log(`Synonyms: ${media.synonyms.length > 0 ? media.synonyms.slice(0, 3).join(', ') : 'None'}`);

                // Check for Chinese in synonyms
                const chineseSynonyms = media.synonyms.filter(s => /[\u4e00-\u9fa5]/.test(s));
                if (chineseSynonyms.length > 0) {
                    console.log(`✅ Chinese found: ${chineseSynonyms[0]}`);
                } else {
                    console.log(`⚠️  No Chinese title found`);
                }

                console.log(`Description: ${media.description ? media.description.substring(0, 80) + '...' : 'N/A'}`);
            } else {
                console.log(`\n❌ MAL ID ${malId}: Not found`);
            }

            // Rate limiting
            await new Promise(resolve => setTimeout(resolve, 700));

        } catch (error) {
            console.error(`\n❌ Error for MAL ID ${malId}:`, error.message);
        }
    }

    console.log('\n=== Test Complete ===');
}

testAnilistAPI();
