import React, { Component } from 'react';
import queryString from 'query-string';
import { battle } from '../utils/api';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import PlayerPreview from './PlayerPreview';
import Loading from './Loading';

function Profile (props) {
    let info = props.info;
    return (
        <PlayerPreview avatar={info.avatar_url} username={info.login}>
            <ul className='space-list-items'>
                {info.name && <li>{info.name}</li>}
                {info.location && <li>{info.company}</li>}
                {info.company && <li>{info.name}</li>}
                <li>Followers: {info.followers}</li>
                <li>Following: {info.following}</li>
                <li>Public Repos: {info.public_repos}</li>
                {info.blog && <li><a href={info.blog}>{info.blog}</a></li>}
            </ul>
        </PlayerPreview>
    )
}

Profile.propTypes = {
    info: PropTypes.object.isRequired,
}

function Player (props) {
    return (
        <div>
            <h1 className='header'>{props.label}</h1>
            <h3 style = {{textAlign: 'center'}}>Score: {props.score}</h3>
            <Profile info={props.profile}/>
        </div>
    )

}

Player.propTypes = {
    label: PropTypes.string.isRequired,
    score: PropTypes.number.isRequired,
    profile: PropTypes.object.isRequired
};


class Results extends Component {
    constructor(props) {
        super(props);

        this.state = {
            winner: null,
            loser: null,
            error: null,
            loading: true
        }
    }
    componentDidMount() {
        let players = queryString.parse(this.props.location.search);
        battle([
            players.playerOneName,
            players.playerTwoName
        ]).then(function(results) {
                if(!results) {
                    return this.setState(() => {
                        return {
                            error: 'there was an error',
                            loading: false
                        }
                    });
                }

                this.setState(() =>  {
                   return {
                       error: null,
                       winner: results[0],
                       loser: results[1],
                       loading: false
                   }
                });
        }.bind(this));
    }
    render() {
        let error = this.state.error,
            winner = this.state.winner,
            loser = this.state.loser,
            loading = this.state.loading;

        if(loading) {
            return <Loading />
        }

        if(error) {
            return (
                <div>
                    <p>error</p>
                    <Link to='/battle'>Reset</Link>
                </div>

            )
        }

        return (
            <div className='row'>
                <Player
                    label='Winner'
                    score={winner.score}
                    profile={winner.profile}
                />
                <Player
                    label='Loser'
                    score={loser.score}
                    profile={loser.profile}
                />
            </div>
        )
    }
}

export default Results;