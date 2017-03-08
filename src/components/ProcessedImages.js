import React from 'react';
import Services from '../serviceClients/fetchImageData';
import GraphCard from './GraphCard';
import parallelAsync from 'async/parallel'
import {WidthProvider, Responsive} from 'react-grid-layout';
import InfiniteScroll from 'react-infinite-scroller';
import TermsFilter from './TermsFilter';
import injectTapEventPlugin from 'react-tap-event-plugin';
import '../styles/ProcessedImages.css';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

injectTapEventPlugin();

var ResponsiveReactGridLayout = WidthProvider(Responsive);
const GRID_WIDTH = 3;

const ResponseHandler = (error, response, body, callback) => {
    if(!error && response.statusCode === 200 && body && !body.errors) {
        callback(undefined, body);
    }else{
        const errMsg = `[${error}] occured while processing graphql request`;
        callback(errMsg, undefined);
    }
};

export default React.createClass({   
    getDefaultProps() {
      return {
        className: "layout",
        cols: {lg: 9, md: 6, sm: 3, xs: 3, xxs: 3},
        rowHeight: 240,
        imageLimit: 10
      };
    },
    getInitialState(){
        return {
            tags: [],
            selectedTags: [],
            images: [],
            offset: 0
        };
    },
    // We're using the cols coming back from this to calculate where to add new items.
    onBreakpointChange(breakpoint, cols) {
        this.setState({
            breakpoint: breakpoint,
            cols: cols,

        });
    },
    imageGridTransformer(image, index, imageCount){
        return Object.assign({}, {
            url: image.url, 
            general_classification_output: image.general_classification_output,
            facecrop_output: image.facecrop_output,
            facedetection: image.facedetection,
            timestamp: image.timestamp,
            id: image.id,
            i: 'n' + (imageCount + index),
            x: (imageCount + index) * GRID_WIDTH % (this.state.cols || 9),
            y: Infinity, // puts it at the bottom
            w: GRID_WIDTH,
            h: 2
        });
    },
    appendImagesToState(appendedImages){
        const {images} = this.state;
        
        return images.concat(appendedImages.map((image, index)=>this.imageGridTransformer(image, index, images.length)));
    },
    mutateState(imageSet, tags, selectedTags, replaceImageList){
        let hasMoreItems = false;
        const {imageLimit} = this.props;
        let images;
        const loaded = true;
        let {offset} = this.state;

        if(!replaceImageList){
            offset += imageLimit;
            images = this.appendImagesToState(imageSet);
        }else{
            offset = 0;
            images = imageSet.map((image, index)=>this.imageGridTransformer(image, index, 0))
        }

        if(imageSet.length > 0 && imageSet.length % imageLimit === 0){
            hasMoreItems = true;
        }

        this.setState({images, loaded, offset, selectedTags, hasMoreItems, tags});
    },
    loadItems(offset, tags, selectedTags, replaceImageList){
        const {imageLimit} = this.props;
        replaceImageList = replaceImageList || false;

        Services.fetchBatchImages(offset, imageLimit, selectedTags, (err2, imgResponse, imgBody) => {
            const {batches} = imgBody;

            if(!err2 && imgResponse.statusCode === 200) {
                this.mutateState(batches, tags, selectedTags, replaceImageList);
            }else{
                console.error('An error occured pushing the queue messages');
            }
        });
    },
    componentDidMount(){
        const {imageLimit} = this.props;
        let offset = 0;

        parallelAsync({
            images: callback => {
                    Services.fetchBatchImages(offset, imageLimit, [], (error, response, body) => ResponseHandler(error, response, body, callback))
            },
            filters: callback => {
                    Services.fetchFilterList((err, response, body) => ResponseHandler(err, response, body, callback))
            }
        }, (error, results) => {
                    if(!error && Object.keys(results).length === 2){
                        const { images, filters } = results;
                        this.mutateState(images.batches, filters.filters, []);
                    }else {
                        console.error(`[${error}] occured while fetching image data from rest services`);
                    }
        });
    },
    selectionHandler(values, name){
        const {tags} = this.state;
        this.loadItems(0, tags, values, true);
    },
    removeChipHandler(chip) {
        let {selectedTags, tags} = this.state;
        const targetElement = selectedTags.findIndex(tag=>tag.value.label === chip.label && tag.value.type === chip.type);

        if(targetElement > -1){
            selectedTags.splice(targetElement, 1);
            this.loadItems(0, tags, selectedTags, true);
        }
    },
    onChipTouch(label, type){
        let {tags} = this.state;
        this.loadItems(0, tags, [{label: label, value: {label, type}}], true);
    },
    render(){
        const loader = <div>Loading images&hellip; <i className="fa fa-refresh fa-spin fa-3x fa-fw" aria-hidden="true"></i></div>;
        const {tags, selectedTags, offset, hasMoreItems} = this.state;
        
        if (!this.state.loaded) {
            return (<div className="loadingPage"><p>Loading images&hellip; <i className="fa fa-refresh fa-spin fa-3x fa-fw" aria-hidden="true"></i></p></div>);
        }
    
        const {images} = this.state;
        return (
           <div className="container-fluid text-left">
             <div className="col-lg-12">
                <TermsFilter tags={tags}
                             selectedTags={selectedTags}
                             onTermSelection={this.selectionHandler}
                             onTermRemove={this.removeChipHandler} />
                <div className="row">
                    <div className="dashboard-grid">
                        <InfiniteScroll pageStart={0}
                                threshold={200}
                                loadMore={()=>this.loadItems(offset, tags, selectedTags)}
                                hasMore={hasMoreItems}
                                loader={loader} >
                            <ResponsiveReactGridLayout {...this.props} onBreakpointChange={this.onBreakpointChange} >
                                {
                                 images.map((image, index)=>{
                                    const {x, y, h, w} = image;
                                    const layoutProps = {x, y, h, w};

                                    return <div key={image.i} data-grid={layoutProps} className="thumbnail article" >
                                                <GraphCard image={image} 
                                                           onChipTouch={this.onChipTouch}/>
                                           </div>
                                })}
                            </ResponsiveReactGridLayout>
                        </InfiniteScroll>
                    </div>
                </div>
            </div>    
          </div>  
        );
    } 
});