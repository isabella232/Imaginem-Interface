import React from 'react';
import Services from '../serviceClients/fetchImageData';
import GraphCard from './GraphCard';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import moment from 'moment';
import injectTapEventPlugin from 'react-tap-event-plugin';
import Chip from 'material-ui/Chip';
import Avatar from 'material-ui/Avatar';
import {WidthProvider, Responsive} from 'react-grid-layout';
import InfiniteScroll from 'react-infinite-scroller';
import Slider from'react-slick';
import '../styles/ProcessedImages.css';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css'
var ResponsiveReactGridLayout = WidthProvider(Responsive);

injectTapEventPlugin();

const styles = {
    label:{ 
        color: '#fff',
    },
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
        background: '#3f3f4f'
    }
};

const sliderSettings = {
      dots: true,
      infinite: false,
      slidesToShow: 3,
      slidesToScroll: 2
};

export default React.createClass({
    getInitialState(){      
      return{
          images: [],
          batchList: [],
          hasMoreItems: true,
          offset: 0,
          items: [0, 1, 2, 3, 4].map(function(i, key, list) {
            return {i: i.toString(), x: i * 2, y: 0, w: 2, h: 2, add: i === (list.length - 1).toString()};
          }),
      };
    },
    getDefaultProps() {
      return {
        className: "layout",
        cols: {lg: 12, md: 9, sm: 6, xs: 3, xxs: 3},
        rowHeight: 240,
        imageLimit: 10,
      };
    },
    // We're using the cols coming back from this to calculate where to add new items.
    onBreakpointChange(breakpoint, cols) {
        this.setState({
            breakpoint: breakpoint,
            cols: cols
        });
    },
    appendImagesToState(images){
        let imageCount = this.state.images.length;
        let width = 3;

        return this.state.images.concat(images.map((image, index)=>Object.assign({}, {
            url: image.url, 
            general_classification_output: image.general_classification_output,
            facecrop_output: image.facecrop_output,
            facedetection: image.facedetection,
            timestamp: image.timestamp,
            id: image.id,
            i: 'n' + (imageCount + index),
            x: (imageCount + index) * width % (this.state.cols || 12),
            y: Infinity, // puts it at the bottom
            w: width,
            h: 2
        })));
    },
    loadItems(){
        var {offset} = this.state;
        const {imageLimit} = this.props;

        Services.fecthBatchImages(offset, imageLimit, (err2, imgResponse, imgBody) => {
            const {batches} = imgBody;
            let hasMoreItems = false;
            if(!err2 && imgResponse.statusCode === 200) {
                if(batches.length === 0 || batches.length % imageLimit === 0){
                    hasMoreItems = true;
                }
                const images = this.appendImagesToState(batches), loaded = true;
                offset += imageLimit;

                this.setState({images, loaded, offset, hasMoreItems});
            }else{
                console.error('An error occured pushing the queue messages');
            }
        });
    },
    componentDidMount(){
        this.loadItems();
    },
    renderFaceCarousel(image){
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
                thumbnails.push(<div>
                                    <div className="facial-labels">
                                        <span className="label label-info facial-label-text">Age&nbsp;<span className="badge">{Math.round(imageDetails.FaceAttributes.Age)}</span></span>
                                    </div>
                                    <div className="facial-labels">
                                        <span className="label label-info facial-label-text">Gender&nbsp;<span className="badge">{imageDetails.FaceAttributes.Gender}</span></span>
                                    </div>
                                    <img width={100} height={100} src={imageDetails.url}/>
                                </div>);
            }

            return <div className="row" style={styles.sliderContainer}>
                        <Slider {...sliderSettings}> 
                            {thumbnails}
                        </Slider>
                    </div>
        }else{
            return undefined;
        }
    },
    renderCard(image){
        const cardHeader = image.general_classification_output && image.general_classification_output.description.captions && image.general_classification_output.description.captions.length > 0 ? image.general_classification_output.description.captions[0].text : "Uploaded Image";
        const {x, y, h, w} = image;
        const layoutProps = {x, y, h, w};
        const subtitle = moment(image.timestamp).fromNow();
        
        return <div key={image.i} data-grid={layoutProps} className="thumbnail article">
                    <div className="col-xs-6 col-md-3">
                        <a className="thumbnail">
                            <img src={image.url} style={{width: 'inherit', height: 'inherit'}}/>
                        </a>
                    </div>
                    <div className="caption" >
                        <h3 className="article-header">{cardHeader}</h3>
                        <div>{subtitle}</div>
                        <div className="detected-face-title">DETECTED FACE(S)</div>
                        {this.renderFaceCarousel(image)}
                        <p className="source">
                            <div>TAGS</div>
                            <div className="well well-sm" style={styles.wrapper}>
                                {image.general_classification_output.tags.map(label=>this.renderChip(label, 'confidence'))}    
                            </div>
                            <div>CATEGORIES</div>
                            <div className="well well-sm" style={styles.wrapper}>
                                {image.general_classification_output.categories.map(label=>this.renderChip(label, 'score'))}    
                            </div>
                        </p>
                    </div>
               </div>;
    },
    renderChip(data, avatarField) {
        return (
            <Chip
                onTouchTap={(event) => {}}
                key={data.name}
                style={styles.chip}>
                <Avatar size={28}>{Math.round(data[avatarField]*100)}</Avatar>
                {data.name}
            </Chip>
        );
    },
    render(){
        const loader = <div>Loading images&hellip; <i className="fa fa-refresh fa-spin fa-3x fa-fw" aria-hidden="true"></i></div>;

        if (!this.state.loaded) {
            return (<div className="loadingPage"><p>Loading images&hellip; <i className="fa fa-refresh fa-spin fa-3x fa-fw" aria-hidden="true"></i></p></div>);
        }
    
        const {batchList, images} = this.state;
        return (
           <div className="container-fluid text-left">
             <div className="col-lg-12">
                <div className="row">
                        <SelectField key="dateSelection" 
                                 underlineStyle={{borderColor: '#337ab7', borderBottom: 'solid 3px'}} 
                                 floatingLabelText="Feature Filter"
                                 floatingLabelStyle={styles.label}
                                 labelStyle={{fontWeight: 600, color:'#2ebd59'}} 
                                 value={this.state.selectedBatch} 
                                 onChange={this.handleChange}>
                                    {batchList ? batchList.map(batch => <MenuItem key={batch.batch_id} 
                                                                              value={batch.batch_id} 
                                                                              primaryText={`${moment(batch.timestamp).fromNow()}`}/>) : undefined}
                        </SelectField>
                </div>
                <div className="row">
                    <div className="dashboard-grid">
                        <InfiniteScroll
                                pageStart={0}
                                threshold={200}
                                loadMore={this.loadItems}
                                hasMore={this.state.hasMoreItems}
                                loader={loader} >
                            <ResponsiveReactGridLayout {...this.props} 
                                                       onBreakpointChange={this.onBreakpointChange} >
                                {images.map(this.renderCard)}
                            </ResponsiveReactGridLayout>
                        </InfiniteScroll>
                    </div>
                </div>
            </div>    
          </div>  
        );
    } 
});