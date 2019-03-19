import 'bootstrap/dist/css/bootstrap.css';
import React, { Component } from 'react';
import './App.css';
import $ from 'jquery';

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
          gsrlimit: 12,
          gsrsearch: searchItem,
          gsrnamespace: 0,
          origin: '*',
          format: 'json',
          inprop: "url",
          explaintext: true,
          exsentences: 1,
          exintro: 1,
          exlimit: 12,
        },
        error: function(req, error) {
          console.log(error)
      }
      }).done(function(response) {
         var containers = []; 
         console.log(response)
         Object.keys(response.query.pages).forEach(function(key,index) {
           var obj = response.query.pages[key];
           var element = {}
           element.title = obj.title
           element.extract = obj.extract
           element.url = obj.fullurl
           containers.push(element)
         })
          that.setState({
            data: containers
          });
      })};
  }
  render() {
    const buttons = this.state.data;
    const results = buttons.map((x,index) => {
      return index % 3 === 0 ? buttons.slice(index,index + 3): null
    }).filter(x => x != null)
    return(
      <div id = "app">
        <div id = "search">
          <button id = "submit" type = "submit" onClick = {this.handleSubmit}
          onKeyDown = {this.handleEnter} tabIndex = '0'><i className = "fa fa-search fa-lg"></i></button>
          <input id = "searchBar" type = "text" placeholder = "search wiki" onChange = {this.updateState}/>
        </div>
        <div className = "container">
        {results.map((obj,index) => {
            return (
              <div className = "text-center row">
              {obj.map(x => {
                return(
                    <div className = "col-md-4 box">
                      <a target = "_blank" href = {x.url}><div className = "titles">{x.title}</div></a>
                      <div className = "info-extracts">{x.extract}</div>
                    </div>
              )})}
              </div>
        )})}
         </div>
      </div>
    )
  }
}

export default App;
