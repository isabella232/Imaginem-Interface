import React, { Component } from 'react';
import { Link, IndexLink  } from 'react-router';
import '../styles/Header.css';
import logo from '../images/logo.png';

const styles = {
    icon: {
        marginLeft: 20
    }
}
const DEFAULT_TITLE = "IMAGINEM";

export default class Header extends Component {
    render() {
        const title = this.props.title || DEFAULT_TITLE;
        
        return (
        <nav className="navbar navbar-trans" role="navigation">
            <div>
                <div className="navbar-header">
                    <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#navbar-collapsible">
                        <span className="sr-only">Toggle navigation</span>
                        <span className="icon-bar"></span>
                        <span className="icon-bar"></span>
                        <span className="icon-bar"></span>
                    </button>
                    <a className="navbar-brand text-danger" href="#">
                            <img role="presentation" src={logo} style={{display: 'inline'}} height="52" />
                            <span style={styles.icon} className="brandLabel">{title}</span>
                    </a>
                </div>
                <div className="navbar-collapse collapse" id="navbar-collapsible">
                    <ul className="nav navbar-nav navbar-left">
                        <li><IndexLink to={`/`} activeClassName="current">UPLOAD</IndexLink></li>
                        <li><Link to={`results`} activeClassName="current">RESULTS</Link></li>
                    </ul>
                </div>
            </div>
        </nav>
        );
  }
}