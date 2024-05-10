import requests
import os
import sys
"""
This is a one time use function the key, group, title, description, active, and has_outrights into a log
"""
def main():
    
    odds_by_key = {}
    with open("league_keys.txt", "r") as league_txt_file:
        lines = league_txt_file.readlines()
        
        for line in lines:
            line = line.split()
            key, group, title, active, has_outright = line[0], line[1], line[2], line[-2], line[-1]
            if active == 'True':
                url = f"https://odds.p.rapidapi.com/v4/sports/{key}/odds"

                querystring = {"regions":"us","oddsFormat":"decimal","markets":"h2h,spreads","dateFormat":"iso"}

                headers = {
                    "X-RapidAPI-Key": "cf36c28ab2msh3578c681fa5368cp168942jsnfe34a3f1abc4",
                    "X-RapidAPI-Host": "odds.p.rapidapi.com"
                }

                response = requests.get(url, headers=headers, params=querystring)
                odds = response.json()
                odds_by_key[key] = odds
        return odds_by_key

    """
    
    tried this but ppl can see the backend format and also some like championship don't have id so it poses an implementation problem. we can just 
    let the lower level decide what to do
    with open("league_odds.txt", "w") as file:
        for key in odds_by_key.keys():
            odds = odds_by_key[key]
            file.write(f"{key}\n")
            
            for odd in odds:
                file.write(f"{odd["id"]} {odd["sport_key"]} {odd["sport_title"]} {odd["commence_time"]} {odd["home_team"]} {odd["away_team"]} ")
                bookmakers = odd["bookmakers"]
                
                bookmaker = bookmakers[0]
                file.write(f"{bookmaker["key"]} {bookmaker["title"]} {bookmaker["last_update"]} ")
                market = bookmaker["markets"][0]
                file.write(f"{market["key"]} {market["last_update"]} {len(market["outcomes"])}\n")
                for outcome in market["outcomes"]:
                    file.write(f"{outcome["name"]} {outcome["price"]} \n")
    """      
                
                    
            
                

    


if __name__ == "__main__":
    main()