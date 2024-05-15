document.addEventListener('DOMContentLoaded', () => {
    
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
        console.log(leaguesBySport);
        return leaguesBySport;
    }

    function displayNavigation(leaguesBySport) {
        const navBar = document.getElementById('nav-bar');
        for (const sport in leaguesBySport) {
            const sportLink = document.createElement('div');
            sportLink.textContent = sport;
            sportLink.classList.add('sport-link');
    
            const leagueList = document.createElement('ul');
            leagueList.classList.add('league-list');
            leaguesBySport[sport].forEach(league => {
                const leagueItem = document.createElement('li');
                leagueItem.textContent = league;
                leagueList.appendChild(leagueItem);
            });
    
            sportLink.appendChild(leagueList);
    
            navBar.appendChild(sportLink);
        }
    }
    

    
});

