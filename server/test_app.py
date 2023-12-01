import unittest
from app import app

class TestApp(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True
    
    def test_get_players_by_position(self):
        response = self.app.get('/api/get_players_by_position?position=QB')
        data = response.get_json()
        self.assertEqual(response.status_code, 200, f'Expected response code 200, received {response.status_code}')
        self.assertIn('players', data, 'Expected response to contain players key')

    def test_get_player_names(self):
        response = self.app.get('/api/player-names')
        data = response.get_json()
        self.assertEqual(response.status_code, 200, f'Expected response code 200, received {response.status_code}')
        self.assertIn('player_names', data, 'Expected response to contain player_names key')

    def test_search_player(self):
        response = self.app.get('/api/search_player?name=Patrick')
        data = response.get_json()
        self.assertEqual(response.status_code, 200, f'Expected response code 200, received {response.status_code}')
        self.assertIn('players', data, 'Expected response to contain players key')

        # Additional assertion for specific values
        self.assertIn('Patrick Mahomes', data['players'], 'Expected Patrick Mahomes in the list of players')

    def test_get_player_stats(self):
        response = self.app.get('/api/get_player_stats?name=Patrick Mahomes')
        data = response.get_json()
        self.assertEqual(response.status_code, 200, f'Expected response code 200, received {response.status_code}')
        self.assertIn('stats', data, 'Expected response to contain stats key')

        # Additional assertion for specific values
        self.assertEqual(data['stats']['Player'], 'Patrick Mahomes', 'Expected Player name to be Patrick Mahomes')

if __name__ == '__main__':
    loader = unittest.TestLoader()
    suite = loader.loadTestsFromTestCase(TestApp)
    runner = unittest.TextTestRunner()
    result = runner.run(suite)

    # Check if all tests passed and print a custom message
    if result.wasSuccessful():
        print("ALL TESTS PASSED")
    else:
        print("SOME TESTS FAILED")
