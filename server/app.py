from flask import Flask, jsonify, request
from bs4 import BeautifulSoup
import requests
import pandas as pd 
from io import StringIO
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error
import numpy as np


app = Flask(__name__)
url = "https://www.pro-football-reference.com/years/2023/fantasy.htm#fantasy"
response = requests.get(url)

if response.status_code == 200:
    soup = BeautifulSoup(response.content, 'html.parser')
    table = soup.find('table')

    html_content = str(table)
    df = pd.read_html(StringIO(html_content), header=[0, 1])[0]
    print(df)

    
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

    if player_data.empty:
        return jsonify({'error': 'Player not found'}), 404
    
    features = player_data[[
        ('Passing', 'Yds'), ('Passing', 'TD'), ('Rushing', 'Yds'), ('Rushing', 'TD')
    ]]
    target = player_data[('Fantasy', 'FantPt')].astype(float)  # Adjust the column level accordingly

    model = LinearRegression()
    model.fit(features, target)

    player_data[('Passing', 'Yds')] = pd.to_numeric(player_data[('Passing', 'Yds')], errors='coerce').fillna(0)
    player_data[('Passing', 'TD')] = pd.to_numeric(player_data[('Passing', 'TD')], errors='coerce').fillna(0)
    player_data[('Rushing', 'Yds')] = pd.to_numeric(player_data[('Rushing', 'Yds')], errors='coerce').fillna(0)
    player_data[('Rushing', 'TD')] = pd.to_numeric(player_data[('Rushing', 'TD')], errors='coerce').fillna(0)

    new_game_data = np.array([
        [player_data[('Passing', 'Yds')].iloc[0], player_data[('Passing', 'TD')].iloc[0],
         player_data[('Rushing', 'Yds')].iloc[0], player_data[('Rushing', 'TD')].iloc[0]]
    ])
    
    projected_points = model.predict(new_game_data)

    formatted_stats = {
        'Player': player_data[('Unnamed: 1_level_0', 'Player')].values[0],
        'Team': player_data[('Unnamed: 2_level_0', 'Tm')].values[0],
        'Position': player_data[('Unnamed: 3_level_0', 'FantPos')].values[0],
        'Passing_Yds': int(player_data[('Passing', 'Yds')].values[0]),
        'Passing_TD': int(player_data[('Passing', 'TD')].values[0]),
        'Passing_Int': int(player_data[('Passing', 'Int')].values[0]),
        'Rushing_Yds': int(player_data[('Rushing', 'Yds')].values[0]),
        'Rushing_TD': int(player_data[('Rushing', 'TD')].values[0]),
        'Receiving_Rec': int(player_data[('Receiving', 'Rec')].values[0]),
        'VBD': float(player_data[('Fantasy', 'VBD')].values[0]),
        'PosRank': int(player_data[('Fantasy', 'PosRank')].values[0]),
        'FantPt': float(player_data[('Fantasy', 'FantPt')].values[0]),
        'PPR': float(player_data[('Fantasy', 'PPR')].values[0]),
        'Projected_Score': round(float(projected_points[0]) / float(player_data[('Games', 'G')]))  
    }

    return jsonify({'stats': formatted_stats})


if __name__ == '__main__':
    app.run(debug=True)


if __name__ == '__main__':
    app.run(debug=True) 

