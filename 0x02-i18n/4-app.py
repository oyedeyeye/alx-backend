#!/usr/bin/env python3
"""Basic Babel Setup"""


from flask import Flask, render_template, request
from flask_babel import Babel, _


class Config:
    """ Flask Babel configuration Settings """
    LANGUAGES = ['en', 'fr']
    BABEL_DEFAULT_LOCALE = 'en'
    BABEL_DEFAULT_TIMEZONE = 'UTC'


app = Flask(__name__)
app.config.from_object(Config)
app.url_map.strict_slashes = False
babel = Babel(app)


@babel.localeselector
def get_locale() -> str:
    """Get locale for the webpage fom request header"""
    queries = request.query_string.decode('utf-8').split('&')
    query_table = dict(map(
        lambda x: (x if '=' in x else '{}='.format(x)).split('='), queries
    ))
    if 'locale' in query_table:
        if query_table['locale'] in app.config['LANGUAGES']:
            return query_table['locale']

    return request.accept_languages.best_match(app.config['LANGUAGES'])


@app.route('/')
def get_index() -> str:
    """Basic route"""
    return render_template('4-index.html')


if __name__ == '__main__':
    app.run(host='0.0.0.0', port='5000')
    app.run(debug=True)
