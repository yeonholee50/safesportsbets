import requests
from pymongo import MongoClient
"""
This is a one time use function the key, group, title, description, active, and has_outrights into a log
"""
def get_database():
    connection_string = "mongodb+srv://yeonholee50:<password>@cluster0.j2eo96c.mongodb.net/"
    client = MongoClient(connection_string)
    return client
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

    
<<<<<<< HEAD
    for sport_name in sport_names:
        url = f"https://odds.p.rapidapi.com/v4/sports/{sport_name[0]}/scores"

        querystring = {"regions":"us","oddsFormat":"decimal","markets":"h2h,spreads","dateFormat":"iso"}

        headers = {
            "X-RapidAPI-Key": "cf36c28ab2msh3578c681fa5368cp168942jsnfe34a3f1abc4",
            "X-RapidAPI-Host": "odds.p.rapidapi.com"
        }

        response = requests.get(url, headers=headers, params=querystring)
        results = response.json()
        
        for res in results:
            try:
                result = coll.insert_many([res])
                inserted_ids.append(result.inserted_ids)
            except:
                print("Data_is_invalid_format")
            
        
    client.close()
    return inserted_ids
      
=======
>>>>>>> parent of ec60837 (finished results api)


if __name__ == "__main__":
    main()