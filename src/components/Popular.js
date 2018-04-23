import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { fetchPopularRepos } from '../utils/api';

function SelectLanguage(props) {
    let languages = ['All', 'JavaScript', 'Java', 'Swift', 'PHP', 'CSS'];
    return (
        <ul className='languages'>
            {languages.map(language =>
                <li
                    style={language === props.selectedLanguage ? { color : '#d0021b'} : null}
                    onClick={props.onSelect.bind(null, language)}
                    key={language}>{language}
                </li>
            )}
        </ul>
    );
}

SelectLanguage.propTypes = {
    selectedLanguage: PropTypes.string.isRequired,
    onSelect: PropTypes.func.isRequired
};

function RepoGrid(props) {
    return (
        <ul className='popular-list'>
            {props.repos.map((repo, index) =>
                <li key={repo.name} className="popular-item">
                    <div className="popular-rank">#{index + 1}</div>
                    <ul className="space-list-items">
                        <li>
                            <img className="avatar"
                                 src={repo.owner.avatar_url}
                                 alt={'Avatar for ' + repo.owner.login} />
                        </li>
                        <li><a href={repo.html_url}>{repo.name}</a></li>
                        <li>@{repo.owner.login}</li>
                        <li>{repo.stargazers_count} stars</li>
                    </ul>
                </li>
            )}
        </ul>
    )
}

RepoGrid.propTypes = {
    repos: PropTypes.array.isRequired
};

class Popular extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedLanguage : 'All',
            repos : null
        };

        this.updateLanguage = this.updateLanguage.bind(this);
    }

    componentDidMount() {
       this.updateLanguage(this.state.selectedLanguage);
    }

    updateLanguage(lang) {
        this.setState(() => ({
            selectedLanguage: lang,
            repos: null
        }));

        fetchPopularRepos(lang)
            .then(repos => {
                this.setState(() => ({
                    repos: repos
                }));
            });
    }

    render() {
        return (
            <div>
                <SelectLanguage selectedLanguage={this.state.selectedLanguage} onSelect={this.updateLanguage}/>
                {!this.state.repos ? <p>LOADING</p> :
                <RepoGrid repos={this.state.repos} />}
            </div>

        );
    }
}

export default Popular;