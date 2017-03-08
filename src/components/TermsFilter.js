import React from 'react';
import Chip from 'material-ui/Chip';
import SuperSelectField from 'material-ui-superselectfield/lib/SuperSelectField';
import '../styles/TermsFilter.css';
import Avatar from 'material-ui/Avatar';

const styles = {
    filterControl: {
        width: '100%'
    },
    menuItemStyle: {
        whiteSpace: 'normal',
        display: 'flex',
        justifyContent: 'space-between',
        lineHeight: 'normal'
    },
    menuLabel: {
        color: '#fff',
        fontWeight: 600
    }
};


const defaultHintText = <span style={styles.menuLabel}>Filter</span>;
const TermsFilter = React.createClass({
    getInitialState(){      
      return{
          selectedTags: [],
          tags: []
      };
    },
    componentDidMount(){
        this.mutateState(this.props);
    },
    mutateState(payload){
        let mutatedTags = [];
        const {selectedTags, tags} = payload;
        Object.keys(tags).forEach(type=>{
            tags[type].forEach(label=> mutatedTags.push({label, type}));
        });

        this.setState({selectedTags: selectedTags, tags: mutatedTags});
    },
    componentWillReceiveProps(nextProps) {
        this.mutateState(nextProps);
    },
    renderChips() {
        const {selectedTags} = this.state;

        return (
        <div className="chips">
            {selectedTags.map(({ value, label }) => <Chip key={label} 
                                                          style={{ margin: 2 }} 
                                                          onRequestDelete={(event) => this.props.onTermRemove(value)}>
                                                            <Avatar size={28}>{value.type.substring(0, 1).toUpperCase()}</Avatar>
                                                            {label}
                                                    </Chip>)}
        </div>
        );
    },
    _select: "selectFilter",
    handleSelectRenderer(values, hintText) {
        if (this.refs[this._select] && this.refs[this._select].state.isOpen === false 
           && this.props.selectedTags.length !== this.state.selectedTags.length ) {
            this.props.onTermSelection(values, this._select);
        }
        return hintText;
    },
    render() {
        const {selectedTags, tags} = this.state;

        let dataSource = tags.sort((a, b) => (a.label.toLowerCase() > b.label.toLowerCase()) || (a.label.toLowerCase() === b.label.toLowerCase()) - 1);
            dataSource = dataSource.map((tag, index) => {
                const tagLabel = `${tag.type.substring(0, 1)} - ${tag.label.toLowerCase()}`;
                return (
                    <div key={tagLabel} value={tag} label={tag.label.toLowerCase()} style={styles.menuItemStyle}>
                        <div>
                            <span style={{ fontWeight: 'bold' }}>{tag.label}</span><br />
                            <span style={{ fontSize: 12 }}>{tag.type}</span>
                        </div>
                    </div>
                );
            });

        return (
            <div className="row">
              <div className="col-md-9 hidden-sm">
                 <div id="tags">
                  {this.renderChips()}
                 </div>
              </div>
              <div className="col-md-3 col-sm-12">
                <div id="select">
                  {dataSource && dataSource.length > 0 ? 
                    <SuperSelectField
                            ref={this._select}
                            name={this._select}
                            hintText={this.props.hintText || defaultHintText}
                            multiple
                            onChange={(selectedValues) => this.setState({ 'selectedTags': selectedValues })}
                            showAutocompleteTreshold={5}
                            selectionsRenderer={this.handleSelectRenderer}
                            value={selectedTags}
                            style={styles.filterControl} >
                        {dataSource}
                    </SuperSelectField> : undefined}
               </div>
             </div>
           </div>
        );
    }
});

TermsFilter.propTypes = {
  	tags: React.PropTypes.object.isRequired,
    selectedTags: React.PropTypes.array.isRequired,
    onTermSelection: React.PropTypes.func.isRequired,
    onTermRemove: React.PropTypes.func,
    hintText: React.PropTypes.string
}

export default TermsFilter;