document.addEventListener('DOMContentLoaded', () => {
    const sportsContainer = document.getElementById('sports-container');

    // Fetch data from the backend
    fetch('/api/leagues-by-sport') // Replace with the correct API endpoint
        .then(response => response.json())
        .then(data => {
            displaySports(data);
        })
        .catch(error => console.error('Error fetching data:', error));

    function displaySports(sports) {
        for (const [sport, leagues] of Object.entries(sports)) {
            const sportSection = document.createElement('div');
            sportSection.classList.add('sport-section');

            const sportTitle = document.createElement('h2');
            sportTitle.classList.add('sport-title');
            sportTitle.textContent = sport;
            sportSection.appendChild(sportTitle);

            leagues.forEach(league => {
                const leagueDiv = document.createElement('div');
                leagueDiv.classList.add('league');

                const leagueTitle = document.createElement('div');
                leagueTitle.classList.add('league-title');
                leagueTitle.textContent = league.title;
                leagueDiv.appendChild(leagueTitle);

                const oddsDiv = document.createElement('div');
                oddsDiv.classList.add('odds');
                oddsDiv.textContent = `Odds: ${league.odds || 'N/A'}`;
                leagueDiv.appendChild(oddsDiv);

                const resultsDiv = document.createElement('div');
                resultsDiv.classList.add('results');
                resultsDiv.textContent = `Results: ${league.results || 'N/A'}`;
                leagueDiv.appendChild(resultsDiv);

                sportSection.appendChild(leagueDiv);
            });

            sportsContainer.appendChild(sportSection);
        }
    }
});
