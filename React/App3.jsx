import React from 'react';
import ReactDOM from 'react-dom';
var $ = require('jquery');

var Input = React.createClass({
  render: function() {
    return(
        <div>
          <Query />
          <SubmitButton/>
        </div>
    )
  }
});

var Query = React.createClass({
  render: function() {
    return(
      <input type="text" id = "query"/>
    )
  }
});

var SubmitButton = React.createClass({

  getInitialState: function(){
    return{
      toggle: false,
      sourceUrl:''
    }
  },
  handleClick: function(){
    var arg = document.getElementById('query').value;
    this.setState({
      toggle: true,
      sourceUrl: "http://127.0.0.1:8088/api/" +arg

    });
  },

  render: function() {
    var display;
    if(this.state.toggle){
      display = <WikiLinks source= {this.state.sourceUrl} />;
    }
    return(
      <div>
        <input type="submit" value = "search" onClick={this.handleClick}/>
        {display}
      </div>

    )
  }
});


var WikiLinks = React.createClass({
  propTypes: {
    links: React.PropTypes.array
  },
  getInitialState: function() {
    return {
      links: (this.props.links || []),

    };
  },

  componentDidMount: function() {
    this.serverRequest = $.get(this.props.source, function (result) {
      var obj=(JSON.parse(result));
      for(var i=0; i<obj[3].length ;i++){
          this.state.links.push(obj[3][i]);
      }

      this.setState({
        links: this.state.links,
      });
    }.bind(this));

  },

  componentWillUnmount: function() {
    this.serverRequest.abort();
  },

  render: function() {
    return(
        <Url urls={this.state.links} />
    )
  }
});

var Url = React.createClass({
  getInitialState: function(){
    return{
      toggle: false,
      dataUrl:''
    }
  },
  handleClick: function(targetUrl){
    var arg = targetUrl;
    var split = arg.split('/');
    this.setState({
      toggle: true,
      dataUrl: "http://127.0.0.1:8088/api/detail/"+ split[4]
    });
  },

  render: function(){
    var display;
    if(this.state.toggle){
      display = <WikiData source= {this.state.dataUrl} />;
    }
    return(
      <div>
        <table>
            {this.props.urls.map(function(url1){
                  return <tr> <a href='#' id={url1} onClick={() => this.handleClick(url1)}> {url1}</a> </tr>;
              }.bind(this))
            }
        </table>

        {display}
      </div>
    )
  }
});

var WikiData = React.createClass({
  getInitialState: function() {
    return {
      data:''

    };
  },

  componentDidMount: function() {
    this.serverRequest = $.get(this.props.source, function (result) {
      result= result.slice(5,result.length-1);
      var obj=(JSON.parse(result));
      var markup = obj.parse.text["*"];
			var blurb = $('<div></div>').html(markup);

            // remove links as they will not work
      blurb.find('a').each(function() { $(this).replaceWith($(this).html()); });

            // remove any references
      blurb.find('sup').remove();

            // remove cite error
      blurb.find('.mw-ext-cite-error').remove();
      $('#app2').html($(blurb).find('p'));
      this.setState({
        data: 'This data is from wiki api'
      });

    }.bind(this));
  },

  componentWillUnmount: function() {
    this.serverRequest.abort();
  },

  render: function() {
    return(
        <div>
        {this.state.data}
        </div>
    )
  }
});
ReactDOM.render(
  <Input/>,
  document.getElementById('app1')
);
