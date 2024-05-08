import requests


"""
This is a one time use function the key, group, title, description, active, and has_outrights into a log
"""
def main():

    url = "https://odds.p.rapidapi.com/v4/sports"

    querystring = {"all":"true"}

    headers = {
        "X-RapidAPI-Key": "cf36c28ab2msh3578c681fa5368cp168942jsnfe34a3f1abc4",
        "X-RapidAPI-Host": "odds.p.rapidapi.com"
    }

    response = requests.get(url, headers=headers, params=querystring)
    leagues = response.json()
    with open("league_keys.txt", "w") as file:
        for league in leagues:
            file.write(f"{league["key"]} {league["group"]} {league["title"]} {league["description"]} {league["active"]} {league["has_outrights"]}\n")

    


if __name__ == "__main__":
    main()