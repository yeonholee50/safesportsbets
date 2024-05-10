import os

"""
each league is currently under different sport. we need to cateogrize them by same sport by looking at similarity
this will be useful when we later categorize each league into an actual recognizable sport for tabs in frontend display
"""
def main():
    """
    weill be sports[soccer] = [ligue1, premierleague, seriea, mls ...]
    """
    sports = {}
    with open("receive/league_keys.txt", "r") as file:
        lines = file.readlines()
        for line in lines:
            league = line.split()[0]
            sport = league.split("_")[0]
            if sport in sports.keys():
                sports[sport].append(league)
            else:
                sports[sport] = [league]
            
        
    return sport
        
        
        


if __name__ == "__main__":
    main()

