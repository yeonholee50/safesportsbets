import requests


def main():
    
    url = "https://odds.p.rapidapi.com/v4/sports/upcoming/odds"

    querystring = {"regions":"us","oddsFormat":"decimal","markets":"h2h,spreads","dateFormat":"iso"}

    headers = {
        "X-RapidAPI-Key": "cf36c28ab2msh3578c681fa5368cp168942jsnfe34a3f1abc4",
        "X-RapidAPI-Host": "odds.p.rapidapi.com"
    }

    response = requests.get(url, headers=headers, params=querystring)

    print(response.json())


if __name__ == "__main__":
    main()