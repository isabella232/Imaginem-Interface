import React, { Component } from 'react';
import { Link, IndexLink  } from 'react-router';
import '../styles/Header.css';
import logo from '../images/logo.png';

const DEFAULT_TITLE = "IMAGINEM";

export default class Header extends Component {
    render() {
        const title = this.props.title || DEFAULT_TITLE;
        
        return (
        <nav className="navbar navbar-trans" role="navigation">
            <div className="container-fluid">
                <div className="navbar-header">
                    <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                        <span className="sr-only">Toggle navigation</span>
                        <span className="icon-bar"></span>
                        <span className="icon-bar"></span>
                        <span className="icon-bar"></span>
                    </button>
                    <a className="navbar-brand text-danger" href="#">
                                <span className="brandLabel">{title}</span>
                    </a>
                </div>
                <div id="navbar" className="navbar-collapse collapse">
                        <ul className="nav navbar-nav navbar-left">
                            <li><IndexLink to={`/`} activeClassName="current">UPLOAD</IndexLink></li>
                            <li><Link to={`results`} activeClassName="current">RESULTS</Link></li>
                        </ul>
                        <div className="nav navbar-nav navbar-right">
                            <img role="presentation" src={logo} style={{display: 'inline', marginBottom: '12px'}} height="52" />
                        </div>
                </div>
            </div>
        </nav>
      );
  }
}