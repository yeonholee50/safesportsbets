document.addEventListener('DOMContentLoaded', () => {
    // Fetch league data from the backend
    fetch('backend/receive/league_keys.txt')
        .then(response => response.text())
        .then(data => {
            const leaguesBySport = categorizeLeaguesBySport(data);
            displayNavigation(leaguesBySport);
        })
        .catch(error => console.error('Error fetching data:', error));

    function categorizeLeaguesBySport(data) {
        const leaguesBySport = {};
        const lines = data.split('\n');
        lines.forEach(line => {
            const [leagueKey, sport] = line.trim().split(' ');
            if (sport in leaguesBySport) {
                leaguesBySport[sport].push(leagueKey);
            } else {
                leaguesBySport[sport] = [leagueKey];
            }
        });
        
        return leaguesBySport;
    }

    function displayNavigation(leaguesBySport) {
        const navBar = document.getElementById('nav-bar');
        for (const sport in leaguesBySport) {
            const sportItem = document.createElement('li');
            sportItem.textContent = sport;
    
            const leagueList = document.createElement('ul');
            leagueList.classList.add('league-list');
    
            leaguesBySport[sport].forEach(league => {
                const leagueItem = document.createElement('li');
                leagueItem.textContent = league;
                leagueList.appendChild(leagueItem);
            });
    
            sportItem.appendChild(leagueList);
            navBar.appendChild(sportItem);
    
            // Show/hide league list when hovering over sportItem
            sportItem.addEventListener('mouseenter', () => {
                leagueList.style.display = 'block';
            });
    
            sportItem.addEventListener('mouseleave', () => {
                leagueList.style.display = 'none';
            });
        }
    }
    
    

    function displayLeagues(leagues) {
        const app = document.getElementById('app');
        app.innerHTML = ''; // Clear previous content

        const leagueList = document.createElement('ul');
        leagueList.classList.add('league-list');

        leagues.forEach(league => {
            const leagueItem = document.createElement('li');
            leagueItem.textContent = league;
            leagueList.appendChild(leagueItem);
        });

        app.appendChild(leagueList);
    
    }
});

