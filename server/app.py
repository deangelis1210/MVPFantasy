from flask import Flask, jsonify, request
from bs4 import BeautifulSoup
import requests

app = Flask(__name__)

def extract_players_from_html(url):
    response = requests.get(url)
    if response.status_code == 200:
        soup = BeautifulSoup(response.text, 'html.parser')
        player_tags = soup.select('td[data-stat="player"] a')
        players = [tag.get_text() for tag in player_tags]
        return players
    else:
        return []

@app.route('/api/get_players_by_position', methods=['GET'])
def get_players_by_position():
    position = request.args.get('position')
    season = request.args.get('season', type=int, default=2023)

    # Define the URLs for different positions
    position_urls = {
        'QB': f'https://www.pro-football-reference.com/years/{season}/passing.htm',
        'RB': f'https://www.pro-football-reference.com/years/{season}/rushing.htm',
        'WR/TE': f'https://www.pro-football-reference.com/years/{season}/receiving.htm',
    }

    if position not in position_urls:
        return jsonify({'error': f'Invalid position: {position}'}), 400

    # Extract players from the HTML content of the specified position URL
    players = extract_players_from_html(position_urls[position])

    # Return a list of player names
    return jsonify({'players': players})

if __name__ == '__main__':
    app.run(debug=True)
