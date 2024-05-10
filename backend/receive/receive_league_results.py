import requests


"""
This is a one time use function the key, group, title, description, active, and has_outrights into a log
"""
def main():
    scores_by_key = {}
    with open("league_keys.txt", "r") as league_txt_file:
        lines = league_txt_file.readlines()
        
        for line in lines:
            line = line.split()
            key, group, title, active, has_outright = line[0], line[1], line[2], line[-2], line[-1]
            if active == 'True':
                url = f"https://odds.p.rapidapi.com/v4/sports/{key}/scores"

                querystring = {"regions":"us","oddsFormat":"decimal","markets":"h2h,spreads","dateFormat":"iso"}

                headers = {
                    "X-RapidAPI-Key": "cf36c28ab2msh3578c681fa5368cp168942jsnfe34a3f1abc4",
                    "X-RapidAPI-Host": "odds.p.rapidapi.com"
                }

                response = requests.get(url, headers=headers, params=querystring)
                odds = response.json()
                scores_by_key[key] = odds
        return scores_by_key

    


if __name__ == "__main__":
    main()