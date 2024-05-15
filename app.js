fetch('backend/receive/league_keys.txt')
    .then(response => response.text())
    .then(data => {
        const leagues = data.split('\n').map(line => line.split(' '));
        const sports = new Map();

        // Group leagues by sport
        leagues.forEach(league => {
            const sport = league[0].split('_')[0];
            if (!sports.has(sport)) {
                sports.set(sport, []);
            }
            sports.get(sport).push({ name: league[0], display: league.slice(1, -2).join(' ') });
        });

        // Generate table
        const tableContainer = document.getElementById('table-container');
        const table = document.createElement('table');

        // Header row
        const headerRow = table.insertRow();
        const headerCell = document.createElement('th');
        headerCell.textContent = 'Sport';
        headerRow.appendChild(headerCell);

        sports.forEach((leagues, sport) => {
            const row = table.insertRow();
            const sportCell = row.insertCell();
            sportCell.textContent = sport.charAt(0).toUpperCase() + sport.slice(1);

            // Add dropdown for leagues
            const dropdownCell = row.insertCell();
            const dropdown = document.createElement('select');

            // Add default option
            const defaultOption = document.createElement('option');
            defaultOption.textContent = 'Select One';
            defaultOption.disabled = true;
            defaultOption.selected = true;
            dropdown.appendChild(defaultOption);

            leagues.forEach(league => {
                const option = document.createElement('option');
                option.textContent = league.display;
                option.value = league.name; // Store league name as value
                dropdown.appendChild(option);
            });

            // Event listener for dropdown change
            dropdown.addEventListener('change', function() {
                const selectedLeague = this.value;
                if (selectedLeague !== 'Select One') {
                    window.location.href = `https://yeonholee50.github.io/safesportsbets/${selectedLeague}.html`;
                }
            });

            dropdownCell.appendChild(dropdown);
        });

        tableContainer.appendChild(table);
    })
    .catch(error => console.error('Error fetching league data:', error));


