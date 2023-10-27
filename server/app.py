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

@app.route('/api/search_player', methods=['GET'])
def search_player():
    name_query = request.args.get('name', '').lower()
    matching_players = df[df[('Unnamed: 1_level_0', 'Player')].str.lower().str.contains(name_query)]
    players = matching_players[('Unnamed: 1_level_0', 'Player')].tolist()
    return jsonify({'players': players})

@app.route('/api/get_player_stats', methods=['GET'])
def get_player_stats():
    player_name = request.args.get('name')

    player_data = df[df[('Unnamed: 1_level_0', 'Player')] == player_name]

    formatted_stats = {
        'Player': player_data[('Unnamed: 1_level_0', 'Player')].values[0],
        'Team': player_data[('Unnamed: 2_level_0', 'Tm')].values[0],
        'Position': player_data[('Unnamed: 3_level_0', 'FantPos')].values[0],
        'Games_Played': player_data[('Games', 'G')].values[0],
        'Passing_Yds': player_data[('Passing', 'Yds')].values[0],
        'Passing_TD': player_data[('Passing', 'TD')].values[0],
        'Passing_Int': player_data[('Passing', 'Int')].values[0],
        'Rushing_Yds': player_data[('Rushing', 'Yds')].values[0],
        'Rushing_TD': player_data[('Rushing', 'TD')].values[0],
        'Receiving_Rec': player_data[('Receiving', 'Rec')].values[0],
        'VBD': player_data[('Fantasy', 'VBD')].values[0],
        'PosRank': player_data[('Fantasy', 'PosRank')].values[0],
        'FantPt': player_data[('Fantasy', 'FantPt')].values[0],
        'PPR': player_data[('Fantasy', 'PPR')].values[0]
    }

    return jsonify({'stats': formatted_stats})



if __name__ == '__main__':
    app.run(debug=True)