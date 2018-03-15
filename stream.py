# Import code from the Twython module
from twython import TwythonStreamer

# Set API keys and Authorisation Keys
APP_KEY = 'KqhuVMbOmSPcmsk5hyg10GhIb'
APP_SECRET = 'leeG4zajwKnCWskVJOuZoxgHAMqNJNLi6wVLc3VEthK0KMIBmd'
OAUTH_TOKEN = '1955200878-95tQE1kshN62pelgTAbILZgFKXz7cKnvBo1Eg1U'
OAUTH_TOKEN_SECRET = 'RWgGjSyZgCESJsfvopmrYBvMM89jgfydCyOWjoxBGkKPk'


class MyStreamer(TwythonStreamer):

    # On success print text from the data,
    # text is the body of the tweet which will contain the keyword
    def on_success(self, data):
        if 'text' in data:
            print(data['text'].encode('utf-8'))

    # On error print the error code and disconnect the streamer
    def on_error(self, status_code, data):
        print(status_code)

        # self.disconnect()


# Pipe API information into the streamer
stream = MyStreamer(APP_KEY, APP_SECRET,
                    OAUTH_TOKEN, OAUTH_TOKEN_SECRET)

# Track keywords seperated by commas and
# look for the most recent tweets (other arg is popular)
stream.statuses.filter(
    track='#uclanopenday, #uclan, uclan',
    result_type='recent')
