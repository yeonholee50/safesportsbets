import requests
from pymongo import MongoClient
"""
This is a one time use function the key, group, title, description, active, and puts api call into mongodb
since 500 is limit for rapidapi per month, one time call to api per month and infinite calls via mongodb is much more scalable for other
api calls like live odds
"""
def get_database():
    connection_string = "mongodb+srv://yeonholee50:YeonHo1010@cluster0.j2eo96c.mongodb.net/"
    client = MongoClient(connection_string)
    return client

def main():
    
    url = "https://odds.p.rapidapi.com/v4/sports"

    querystring = {"all":"true"}

    headers = {
        "X-RapidAPI-Key": "cf36c28ab2msh3578c681fa5368cp168942jsnfe34a3f1abc4",
        "X-RapidAPI-Host": "odds.p.rapidapi.com"
    }

    response = requests.get(url, headers=headers, params=querystring)
    leagues = response.json()
    client = get_database()
    
    db = client.sports
    results = []
    for league in leagues:
        result = db.league_names.insert_many([league])
        results.append(result)
    client.close()
    return results
    


    


if __name__ == "__main__":
    main()