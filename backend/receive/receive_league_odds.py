import requests
import os
import sys
from pymongo import MongoClient

"""
This is a once per day operation
"""
def get_database():
    connection_string = "mongodb+srv://yeonholee50:YeonHo1010@cluster0.j2eo96c.mongodb.net/"
    client = MongoClient(connection_string)
    return client
def main():
    client = get_database()
    db = client.sports
    coll = db.league_names
    cursor = coll.find()
    sport_names = set()
    for doc in cursor:
        if (doc['group'], doc['active']) not in sport_names:
            sport_names.add((doc['group'], doc['active']))
    client.close()
    """
    Now we store today's odds into db
    """
    inserted_ids = []
    client = get_database()
    db = client.sports
    coll = db.odds
    coll.drop()
    for sport_name in sport_names:
        if sport_name[-1] == True:
            url = f"https://odds.p.rapidapi.com/v4/sports/{sport_name[0]}/odds"

            querystring = {"regions":"us","oddsFormat":"decimal","markets":"h2h,spreads","dateFormat":"iso"}

            headers = {
                "X-RapidAPI-Key": "cf36c28ab2msh3578c681fa5368cp168942jsnfe34a3f1abc4",
                "X-RapidAPI-Host": "odds.p.rapidapi.com"
            }

            response = requests.get(url, headers=headers, params=querystring)
            odds = response.json()
            
            for odd in odds:
                try:
                    result = coll.insert_many([odd])
                    inserted_ids.append(result.inserted_ids)
                except:
                    print("Odds Not Valid")
            
        
    client.close()
    return inserted_ids
      


if __name__ == "__main__":
    main()