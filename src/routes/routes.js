import { Route, IndexRoute } from 'react-router'
import App from './App';
import {HomePage} from './HomePage';
import {EntryPage} from './EntryPage';
import {ResultsPage} from './ResultsPage';
import React from 'react';

export const routes = (
    <Route path="/" component={App} icon="fa fa-share-alt-square fa">
            <IndexRoute component={HomePage}/>
            <Route path="upload" component={EntryPage} />
            <Route path="results" component={ResultsPage} />
    </Route>
);
