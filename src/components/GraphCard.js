import React, { Component } from 'react';
import Chip from 'material-ui/Chip';
import Avatar from 'material-ui/Avatar';
import Slider from'react-slick';
import moment from 'moment';
import {blue300, indigo900} from 'material-ui/styles/colors';
import '../styles/ProcessedImages.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css'

const MAX_DISPLAYED_TAGS = 12;
const CONFIDENT_SCORE = 0.85;
const styles = {
    chip: {
        margin: 4,
      },
    wrapper: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    sliderContainer: {
        margin: '0 auto',
        padding: '40px',
        paddingBottom: '10px',
        width: '80%',
        color: '#333',
        background: '#3f3f4f',
        borderRadius: '1cm'
    },
    timeLabel: {
        fontSize: '12px'
    },
    sectionLabel: {
      fontWeight: 700
    }
};

const sliderSettings = {
      dots: true,
      infinite: false,
      slidesToShow: 2,
      slidesToScroll: 1
};

class FaceCarousel extends Component {
   render(){
     const {image} = this.props;

     if(image.facecrop_output && image.facecrop_output.facesUrls && image.facecrop_output.facesUrls.length > 0){
        let imageMap = new Map(image.facecrop_output.facesUrls.map(url => {
                    let urlSplit = url.split("/");
                    let imageId = urlSplit[urlSplit.length - 1].split(".")[0];
                    return [imageId, {url}]
        }));

        image.facedetection.faces.forEach(face=>{
                    let imageData = imageMap.get(face.FaceId);
                    imageMap.set(face.FaceId, Object.assign({}, imageData, face));
        });

        let thumbnails = [];

        for (let [imgGuid, imageDetails] of imageMap.entries()) {
            thumbnails.push(<div key={imgGuid}>
                                        <div className="facial-labels">
                                            <span className="label label-info facial-label-text">Age&nbsp;<span className="badge">{Math.round(imageDetails.FaceAttributes.Age)}</span></span>
                                        </div>
                                        <div className="facial-labels">
                                            <span className="label label-info facial-label-text">Gender&nbsp;<span className="badge">{imageDetails.FaceAttributes.Gender}</span></span>
                                        </div>
                                        <img width={100} role="presentation" height={100} src={imageDetails.url}/>
                            </div>);
        }

        return <div className="row" style={styles.sliderContainer}>
                        <Slider {...sliderSettings}> 
                                {thumbnails}
                        </Slider>
                </div>
     }else{
       return <div />
     }
   }
}

class GraphCard extends Component {
  renderChip(data, tagType, avatarField) {
        

        let additionalAvatarProps = {}, additionalChipProps = {};

        if(data[avatarField] > CONFIDENT_SCORE){
            additionalAvatarProps = {
                color: blue300, 
                backgroundColor: indigo900
            };
            additionalChipProps = {
                backgroundColor: blue300
            };
        }
        return (
            <Chip
                onTouchTap={(event) => this.handleChipTouch(data.name, tagType)}
                key={data.name}
                style={styles.chip}
                {...additionalChipProps}>
                    {avatarField ? 
                    <Avatar size={28} 
                            {...additionalAvatarProps}>
                                    {Math.round(data[avatarField]*100)}</Avatar> : undefined}
                    {data.name}
            </Chip>
        );
  }
  handleChipTouch(label, tagType){
    if(tagType === "tags" || tagType === "categories"){
        this.props.onChipTouch(label, tagType);
    }
  }
  render() {
    const {image} = this.props;
    const cardHeader = image.general_classification_output && image.general_classification_output.description.captions && image.general_classification_output.description.captions.length > 0 ? image.general_classification_output.description.captions[0].text : "Uploaded Image";
    const subtitle = moment(image.timestamp).fromNow();
        
    return <div>
                    <div className="col-xs-6 col-md-3">
                        <a className="thumbnail">
                            <img src={image.url} role="presentation" style={{width: 'inherit', height: 'inherit'}}/>
                        </a>
                    </div>
                    <div className="caption" >
                        <h3 className="article-header">{cardHeader}</h3>
                        <div style={styles.timeLabel}>{subtitle}</div>
                        <div className="detected-face-title">DETECTED FACE(S)</div>
                        <FaceCarousel image={image} />
                        <div className="row container-fluid">
                            <div className="col-lg-12">
                              {(image.general_classification_output.tags && image.general_classification_output.tags.length > 0) ?
                              <div className="row">
                                <div className="col-lg-12">
                                  <div style={styles.sectionLabel}>KEY DETECTIONS</div>
                                  <div style={styles.wrapper}>
                                      {image.general_classification_output.tags.map(label=>this.renderChip(label, 'tags', 'confidence'))}    
                                  </div>
                                </div>
                              </div>
                              : undefined}
                              {(image.general_classification_output.categories && image.general_classification_output.categories.length > 0) ?
                              <div className="row">
                                 <div className="col-lg-3">
                                    <div style={styles.sectionLabel}>CATEGORIES</div>
                                    <div style={styles.wrapper}>
                                        {image.general_classification_output.categories.map(label=>this.renderChip(label, 'categories', 'score'))}    
                                    </div>
                                  </div>
                                  <div className="col-lg-9">
                                    <div style={styles.sectionLabel}>OTHER DETECTIONS</div>
                                    <div style={styles.wrapper}>
                                        {image.general_classification_output.description.tags.slice(0, MAX_DISPLAYED_TAGS).map(label=>this.renderChip(Object.assign({}, {name: label}), 'descriptions', false))}    
                                    </div>
                                  </div>
                               </div>
                              : undefined }
                            </div>
                        </div>
                    </div>
               </div>;
  }
}

GraphCard.propTypes = {
    onChipTouch: React.PropTypes.func.isRequired
}

export default GraphCard;