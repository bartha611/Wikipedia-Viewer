import React, { Component } from 'react';
import './App.css';
import $ from 'jquery';

const enterStyle = {
  backgroundColor: '#ddd',
  color: 'black'
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      inputValue: ''
    };
    this.updateState = this.updateState.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleEnter = this.handleEnter.bind(this);
    this.handleArticle = this.handleArticle.bind(this);
  }
  componentDidMount() {
    document.addEventListener("keydown", this.handleEnter.bind(this));
  }
  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleEnter.bind(this));
  }
  updateState(e) {
    this.setState({
      inputValue: e.target.value
    })
  }
  handleEnter(event) {
    if(event.keyCode === 13) {
      this.handleSubmit();
      var submit = document.getElementById('submit');
      submit.style.backgroundColor = 'grey';
      setTimeout(() => {submit.style.backgroundColor = '#ddd'}, 50);
    }
  }
  handleArticle(e) {
    window.open(e.currentTarget.dataset.url);
  }
  handleSubmit() {
    var searchItem = this.state.inputValue;
    var that = this;
    if(this.state.inputValue) {
      $.ajax({
        url: "https://en.wikipedia.org/w/api.php",
        data: {
          action: "query",
          prop: "info|extracts",
          generator: "search",
          gsrlimit: 10,
          gsrsearch: searchItem,
          gsrnamespace: 0,
          origin: '*',
          format: 'json',
          inprop: "url",
          explaintext: true,
          exsentences: 2,
          exintro: 1,
          exlimit: 10,
        },
        error: function(req, error) {
          console.log(error)
      }
      }).done(function(response) {
         var containers = []; 
         Object.keys(response.query.pages).forEach(function(key) {
           var element = {};
           element.title = response.query.pages[key].title;
           element.extract = response.query.pages[key].extract;
           element.url = response.query.pages[key].fullurl;
           containers.push(element);
        });
          that.setState({
            data: containers
          });
      })};
  }
  render() {
    const buttons = this.state.data;
    return(
      <div id = "app">
        <div id = "search">
          <button id = "submit" type = "submit" onClick = {this.handleSubmit}
          onKeyDown = {this.handleEnter} tabIndex = '0'><i className = "fa fa-search fa-lg"></i></button>
          <input id = "searchBar" type = "text" placeholder = "search wiki" onChange = {this.updateState}/>
        </div>
        <div className = "results">
        {buttons.map((obj,index) => {
          return(
            <div onClick = {this.handleArticle} data-url = {obj.url} key = {index} className = "wiki-container">
              <div className = "titles"><b>{obj.title}</b></div>
              <div className = "info_extracts">{obj.extract}</div>
            </div>
            )
        })}
         </div>
      </div>
    )
  }
}

export default App;
