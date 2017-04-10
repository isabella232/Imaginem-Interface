import React, { Component } from 'react';
import { Link, IndexLink  } from 'react-router';
import '../styles/Home.css';

export default class LandingContent extends Component {
    render() {        
        return (
            <div>
                <div>
                    <h1>Welcome to Imaginem (Latin for image)</h1>
                    <h3>Imaginem is an open source, serverless framework for processing images through a number of computer vision classifiers, including face recognition and matching.</h3>
                </div>
                <br/>
                <br/>
                <div className="content">
                    <p>
                        When we set out to build Imaginem, we wanted it to be easy to configure, deploy and customize. That is why Imaginem is built on the <a href="https://azure.microsoft.com/en-us/services/functions/">Azure Functions</a> serverless framework. 
                        The serverless architecture allows developers to quickly add new steps to the pipeline by simply writing a new Function and adding it your Function App. 
                        <br/>
                        <br/>
                        For the sample framework and demo that is live on this site, we built several functions that utilize <a href="https://www.microsoft.com/cognitive-services/">Microsoft Cognitive Services</a>. By default, it makes use of the Face API and Computer Vision API. We chose to use these
                        becuase they are easily accessible, easy to use and provide a powerful representation of the types of image classificatiosn that we're trying to demonstrate. Since the frmaeowkr is open source, feel free to use any service or executable that fits your needs.
                    </p>
                    <p>
                        If you're interested in using Imaginem, please feel free to check out the <a href="/#/upload">demo</a> and clone the GitHub <a href="https://github.com/CatalystCode/Imaginem">repository</a>.
                    </p>
                </div>
            </div>
      );
  }
}