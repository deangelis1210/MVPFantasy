from flask import Flask, jsonify, request
from bs4 import BeautifulSoup
import requests
import pandas as pd 
from io import StringIO

app = Flask(__name__)
url = "https://www.pro-football-reference.com/years/2023/fantasy.htm#fantasy"
response = requests.get(url)

if response.status_code == 200:
    soup = BeautifulSoup(response.content, 'html.parser')
    table = soup.find('table')

    html_content = str(table)
    df = pd.read_html(StringIO(html_content), header=[0, 1])[0]


rb_players = df[df[('Unnamed: 3_level_0', 'FantPos')] == 'RB']
#print(rb_players)

def get_players_by_position_filter(position):
    filtered_players = df[df[('Unnamed: 3_level_0', 'FantPos')] == position]
    return filtered_players[('Unnamed: 1_level_0', 'Player')].tolist()

@app.route('/api/get_players_by_position', methods=['GET'])
def get_players_by_position():
    position = request.args.get('position', 'All Players')
    if position == 'All Players':
        players = get_player_names()
    else:
        players = get_players_by_position_filter(position)
    return jsonify({'players': players})


def get_player_names():
    player_names = df[('Unnamed: 1_level_0', 'Player')]
    return player_names.tolist()

@app.route('/api/player-names', methods=['GET'])
def api_player_names():
    player_names = get_player_names()
    return jsonify({'player_names': player_names})

if __name__ == '__main__':
    app.run(debug=True)
