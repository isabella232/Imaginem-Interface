import React, { Component } from 'react';
import {Card, CardHeader, CardTitle, CardActions, CardMedia} from 'material-ui/Card';

import '../styles/GraphCard.css';

const styles = {
  cardMediaStyle: {
    height: 240
  },
  cardHeaderStyle: {
    height: 'auto'
  }
}

export default class GraphCard extends Component {
  render() {
    return (
      <Card>
        {
          this.props.cardHeader ? 
            <CardHeader className='card-header' {...this.props.cardHeader}/> : undefined 
        }
        <CardMedia>
            {this.props.children}
        </CardMedia>
        {
         this.props.cardActions ? 
            <CardActions>
                {this.props.cardActions}
            </CardActions> : undefined 
        }
      </Card>
    );
  }
}