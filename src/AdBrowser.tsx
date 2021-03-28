import React, { Component } from 'react';
import { Accordion, Button, Card, Col, Container, Dropdown, Form, Row } from 'react-bootstrap';
import ReactWordcloud from 'react-wordcloud';
import Slider from 'rc-slider';
import { url } from './url';
// import "/rc-slider/assets/index.css"; // copied into App.css
import { MHNavBar } from './NavBar';
import { VehicleAdvert } from './interfaces.d';
import { Scatter } from 'react-chartjs-2';
import { maxNumAllAds, getAdsList } from './getAdverts';

const lowestAgeRange = 1960;
const highestAgeRange = 2025;

const lowestPriceRange = 0;
const highestPriceRange = 60000;

const lowestBerthRange = 0;
const highestBerthRange = 8;

const lowestMilesRange = 0;
const highestMilesRange = 200000;

const { Range } = Slider;

class SliderRange extends React.Component<{
  name: string,
  lowestVal: number,
  highestVal: number,
  lowestClick: number,
  highestClick: number,
  callback: (arg: { value: number[] }) => void,
},{
  lowerBound: number,
  upperBound: number,
  value: number[]
}>{
  private wholeNumber(val: number){
    return Math.round(
      (this.props.highestVal - this.props.lowestVal) * val / (this.props.highestClick - this.props.lowestClick) + 
      this.props.lowestVal);
  }

  constructor(props: {
    name: string,
    lowestVal: number,
    highestVal: number,
    lowestClick: number,
    highestClick: number,
    callback: (arg: { value: number[] }) => void,
  }){
    super(props);
    this.state = {
      lowerBound: this.props.lowestClick,
      upperBound: this.props.highestClick,
      value: [this.props.lowestClick, this.props.highestClick],
    };
  }

  onSliderChange = (value:number[]) => {
    // console.log(`change to value = ${value}`);
    this.setState({
      value,
      lowerBound: value[0],
      upperBound: value[1],
    });
    // this.props.callback({ value: [this.convertToYear(this.state.lowerBound), this.convertToYear(this.state.upperBound)] });
  };
  onSliderFinalChange = (value:number[]) => {
    // console.log(`final change to value = ${value}`);
    this.setState({
      value,
    });
    // report to caller
    this.props.callback({ 
      value: [this.wholeNumber(this.state.lowerBound), this.wholeNumber(this.state.upperBound)] 
    });
  };

  render() {
    return (
      <div>
        <Container 
          style={{ 
            paddingLeft: "10px"
          }}>
          <div>{this.props.name}: {this.wholeNumber(this.state.value[0])}-{this.wholeNumber(this.state.value[1])}</div>
        </Container>
        <Container 
          style={{ 
            paddingTop: "10px",
            paddingLeft: "20px",
            paddingBottom: "20px",
          }}>
          <Range
            min={this.props.lowestClick}
            max={this.props.highestClick}
            allowCross={false}
            value={this.state.value}
            railStyle={{
              height: 4
            }}
            onChange={this.onSliderChange}
            onAfterChange={this.onSliderFinalChange}
            handleStyle={[{
              height: 20,
              width: 20,
              marginLeft: 0,
              marginTop: -10,
              backgroundColor: "blue",
              border: 0
            },{
              height: 20,
              width: 20,
              marginLeft: 0,
              marginTop: -10,
              backgroundColor: "blue",
              border: 0
            }]}
          />
        </Container>
      </div>
    );
  }
}

class ThreeSlider extends React.Component<{
  name: string,
  first: string,
  second: string,
  third: string,
  callback: (val:string)=>void,
},{
  value: number,
}> {
  constructor(props:{
    name: string,
    first: string,
    second: string,
    third: string,
    callback: (val:string)=>void,
  }) {
    super(props);
    this.state = {
      value: 0
    };
  }
  onSliderChange = (value:number) => {
    // console.log(`on slider change ${value}`);
    this.setState(
      {
        value
      },
      () => {
        // console.log(this.state.value);
        this.props.callback(this.marks[this.state.value]);
      }
    );
  };
  private marks: any = {
    0: this.props.first,
    1: this.props.second,
    2: this.props.third,
  };
  render() {
    return (
      <div>
        <Container 
          style={{ 
            paddingLeft: "10px"
          }}>
          <div>{this.props.name}: {this.marks[this.state.value]}</div>
        </Container>
        <Container 
          style={{ 
            paddingTop: "10px",
            paddingLeft: "20px",
            paddingBottom: "40px",
          }}>
          <Slider
            min={0}
            max={2}
            marks={this.marks}
            value={this.state.value}
            onChange={this.onSliderChange}
            railStyle={{
              height: 4
            }}
            handleStyle={{
              height: 20,
              width: 20,
              marginLeft: 0,
              marginTop: -10,
              backgroundColor: "blue",
              border: 0
            }}
            trackStyle={{
              background: "none"
            }}
        />
        </Container>
      </div>
    );
  }
}

function wordFreq(input: string) {
  const allWords = input.replace(/[.,/#!$%^&*;:{}=\-_`~()"[\]]/g, ' ').split(/\s/)
    .map((w: string) => {
      return w.toLowerCase();
    }
  );
  const sw = require('stopword');
  const mostWords = sw.removeStopwords(allWords);
  const words = sw.removeStopwords(mostWords,
      [
      '&', '-', '_', '[]',
      'x',
      '1', '2', '3', '4', '5', '6', '7', '8', '9', '0',
      'one', 'two', 'three',
      'no', 'per', 'not', 'its', 'giving', 'so', '\'', 'go',
      'when',
      'need', 'use', 'will',
      ]
    );

  const freqMap: {
    text: string,
    value: number,
  }[] = [];
  words.forEach(function(w: string) {
    const pairs = freqMap.filter((pr)=>{ 
      return pr.text === w;
    });
    if(pairs.length === 0){
      freqMap.push({
        text: w,
        value: 1,
      })
      // console.log(`1st occurrence of ${w}`);
    } else {
      // console.log(`${pairs[0].value + 1}th occurrence of ${w}`);
      pairs[0].value = pairs[0].value + 1;
    }
  });

  return freqMap;
}

function getTextForWordcloud(row: VehicleAdvert): string {
  if(row.title === undefined){
    return row.description;
  } else {
    return `${row.title} ${row.subtitle} ${row.transmission} ${row.year} ${row.spec}`;
  }
}



interface AdBrowserState {
  allVehicleAds: VehicleAdvert[],
  filteredVehicleAds: VehicleAdvert[],
  minImageIndex: number;
  maxImageIndex: number;
  wordcloudWords: {
    text: string,
    value: number,
  }[];
  filterWords: string[],
  transmissionFilter: string,
  lowYearBound: number,
  highYearBound: number,
  lowPriceBound: number,
  highPriceBound: number,
  lowBerthBound: number,
  highBerthBound: number,
  lowMilesBound: number,
  highMilesBound: number,
  adCountMessage: string,
}
interface AdBrowserProps {
}

export class AdBrowser extends Component<AdBrowserProps, AdBrowserState>{

  private dropdownFilters = [
    'wetroom', 'separate shower', 'fixed bed', 
    'alko heating', 'blown heating', 'solar panel', 'satellite system'
  ];
  public constructor(props: AdBrowserProps) {
    super(props);
    this.state = {
      allVehicleAds: [],
      filteredVehicleAds: [],
      minImageIndex: 0,
      maxImageIndex: 5,
      wordcloudWords: [],
      filterWords: [],
      transmissionFilter: '',
      lowYearBound: lowestAgeRange,
      highYearBound: highestAgeRange,
      lowPriceBound: lowestPriceRange,
      highPriceBound: highestPriceRange,
      lowBerthBound: lowestBerthRange,
      highBerthBound: highestBerthRange,
      lowMilesBound: lowestMilesRange,
      highMilesBound: highestMilesRange,
      adCountMessage: 'Loading ads...',
    }
    this.refreshData(true); // do visit DB
  }

  render(){
    const numAds = this.state.filteredVehicleAds.length;

    var customTooltips = function(this: any, tooltip: any) {
      // console.log(`in customTooltips`);

			// Tooltip Element
			var tooltipEl = document.getElementById('chartjs-tooltip');

			if (!tooltipEl) {
        // console.log(`no tooltipEl - create one`);
				tooltipEl = document.createElement('div');
				tooltipEl.id = 'chartjs-tooltip';
				tooltipEl.innerHTML = '<table></table>';
				this._chart.canvas.parentNode.appendChild(tooltipEl);
			}

			// Hide if no tooltip
			if (tooltip.opacity === 0) {
        // console.log(`zero opacity - quit`);
				tooltipEl.style.opacity = "0";
				return;
			}

			// Set caret Position
			tooltipEl.classList.remove('above', 'below', 'no-transform');
			if (tooltip.yAlign) {
				tooltipEl.classList.add(tooltip.yAlign);
			} else {
				tooltipEl.classList.add('no-transform');
			}

			function getBody(bodyItem: any) {
				return bodyItem.lines;
			}

			// Set Text
			if (tooltip.body) {
        //  console.log(`tooltip has body`);
				var titleLines = tooltip.title || [];
				var bodyLines = tooltip.body.map(getBody);

				var innerHtml = '';

				titleLines.forEach(function(title: any) {
					innerHtml += title+' ';
				});

				bodyLines.forEach(function(body: any, i: any) {
					innerHtml += body+' ';
				});

				var tableRoot = tooltipEl.querySelector('table');
        if(tableRoot){
  				tableRoot.innerHTML = innerHtml;
			  }
      } else {
        // console.log(`tooltip has no body`);
      }

      var thisObj: any = this;

			var positionY = thisObj._chart.canvas.offsetTop;
			var positionX = thisObj._chart.canvas.offsetLeft;

			// Display, position, and set styles for font
			tooltipEl.style.opacity = "1";
			tooltipEl.style.left = positionX + tooltip.caretX + 'px';
			tooltipEl.style.top = positionY + tooltip.caretY + 'px';
			tooltipEl.style.fontFamily = tooltip._bodyFontFamily;
			tooltipEl.style.fontSize = tooltip.bodyFontSize + 'px';
			tooltipEl.style.fontStyle = tooltip._bodyFontStyle;
			tooltipEl.style.padding = tooltip.yPadding + 'px ' + tooltip.xPadding + 'px';
		};

    return (
    <>
    <MHNavBar/>
    <h2>{this.state.adCountMessage}</h2>
    <Accordion>
      <Card>
        <Card.Header>
          <Accordion.Toggle  as={Card.Header} eventKey="ShowImages">
            Show van images
          </Accordion.Toggle>
        </Card.Header>
        <Accordion.Collapse eventKey="ShowImages">
          <Container>
            <div>
              display from {this.state.minImageIndex + 1} to {this.state.maxImageIndex + 1}
              <p>
              <Button onClick={(e:any)=>{
                e.preventDefault();
                //const oldMin = this.state.minImageIndex;
                const oldMax = this.state.maxImageIndex;
                //let newMin = oldMin
                let newMax = Math.min(oldMax + 1, numAds - 1);
                // console.log(`show ${this.state.minImageIndex} to ${newMax}`);
                this.setState({
                  maxImageIndex: newMax,
                });
              }}>
                Show more images
              </Button>
              <Button onClick={(e:any)=>{
                e.preventDefault();
                const oldMin = this.state.minImageIndex;
                const oldMax = this.state.maxImageIndex;
                //let newMin = oldMin
                let newMax = Math.max(Math.max(oldMax - 1, 0), oldMin);
                // console.log(`show ${this.state.minImageIndex} to ${newMax}`);
                this.setState({
                  maxImageIndex: newMax,
                });
              }}>
                Show fewer images
              </Button>
              <Button onClick={(e:any)=>{
                e.preventDefault();
                const oldMin = this.state.minImageIndex;
                const oldMax = this.state.maxImageIndex;
                const step = oldMax - oldMin + 1;
                let newMin = Math.max(oldMin - step, 0);
                let newMax = newMin + (oldMax - oldMin);
                // console.log(`show ${newMin} to ${newMax}`);
                this.setState({
                  minImageIndex: newMin,
                  maxImageIndex: newMax,
                });
              }}>
                Show prev images
              </Button>
              <Button onClick={(e:any)=>{
                e.preventDefault();
                const oldMin = this.state.minImageIndex;
                const oldMax = this.state.maxImageIndex;
                const step = oldMax - oldMin + 1;
                let newMax = Math.min(oldMax + step, numAds - 1);
                let newMin = newMax - (oldMax - oldMin);
                // console.log(`show ${newMin} to ${newMax}`);
                this.setState({
                  minImageIndex: newMin,
                  maxImageIndex: newMax,
                });
              }}>
                Show next images
              </Button>
              </p>
            </div>
            {
            Array.from(
              { length: (Math.min(numAds-1, this.state.maxImageIndex) - 
                        Math.min(numAds, this.state.minImageIndex)) + 1}, 
              (_, i) =>  Math.min(numAds, this.state.minImageIndex) + i
            ).map((i)=>{
            //  console.log(`i is ${i}`);
            //  return i;
            //}).map((i)=>{
              return this.state.filteredVehicleAds[i];
            }).map((row) => {
              return (
                <a
                  href={`/advert/${row.adID}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                <img
                  alt={'a vehicle'}
                  src={`${url}image?${new URLSearchParams({
                    id: row.imageID,
                  })}`}
                  height={100}
                ></img>
                </a>
                );
              }
            )
            }
          </Container>
        </Accordion.Collapse>
      </Card>
    </Accordion>
    <Accordion defaultActiveKey="Filters">
      <Card>
        <Card.Header>
          <Accordion.Toggle  as={Card.Header} eventKey="Filters">
            Set search filters
          </Accordion.Toggle>
        </Card.Header>
        <Accordion.Collapse eventKey="Filters">
          <Container>
            <Row>
              <Col xs={6} md={4}>
              </Col>
              <Col xs={6} md={4}>
              </Col>
            </Row>
            <Row>
              <Col xs={6} md={4}>
                <SliderRange 
                  name="Price"
                  lowestVal={lowestPriceRange}
                  highestVal={highestPriceRange}
                  lowestClick={0}
                  highestClick={100}
                  callback={(
                    args: {
                      value: number[]
                    }
                  )=>{
                    //console.log(`in callback ${JSON.stringify(args)}`);
                    this.setState(
                      {
                        lowPriceBound: args.value[0],
                        highPriceBound: args.value[1],
                      },
                      ()=>{
                        return this.refreshData(false); // do not viti DB
                      }
                    );
                  }}
                />
              </Col>
              <Col xs={6} md={4}>
                <ThreeSlider name="Gearbox" first="Any" second="Manual" third="Automatic"
                  callback={(val: string)=>{
                    // console.log(`click on transmission; set ${val.toLowerCase()}`);
                    this.setState(
                      {
                        transmissionFilter: val.toLowerCase(),
                      },
                      ()=>{
                        return this.refreshData(false); // do not viti DB
                      }
                    );
                  }}
                />
              </Col>
            </Row>

            <Row>
              <Col xs={6} md={4}>
                <SliderRange 
                  name="Berth"
                  lowestVal={lowestBerthRange}
                  highestVal={highestBerthRange}
                  lowestClick={lowestBerthRange}
                  highestClick={highestBerthRange}
                  callback={(
                    args: {
                      value: number[]
                    }
                  )=>{
                    //console.log(`in callback ${JSON.stringify(args)}`);
                    this.setState(
                      { 
                        lowBerthBound: args.value[0],
                        highBerthBound: args.value[1],
                      },
                      ()=>{
                        return this.refreshData(false); // do not viti DB
                      }
                    );
                  }}
                />

              </Col>
              <Col xs={6} md={4}>
                <SliderRange 
                  name="Miles"
                  lowestVal={lowestMilesRange}
                  highestVal={highestMilesRange}
                  lowestClick={0}
                  highestClick={100}
                  callback={(
                    args: {
                      value: number[]
                    }
                  )=>{
                    //console.log(`in callback ${JSON.stringify(args)}`);
                    this.setState(
                      {
                        lowMilesBound: args.value[0],
                        highMilesBound: args.value[1],
                      },
                      ()=>{
                        return this.refreshData(false); // do not viti DB
                      }
                    );
                  }}
                />
              </Col>
            </Row>
{/*
            <Row>
              <Col xs={6} md={4}>

              </Col>
              <Col xs={6} md={4}>
                <SliderRange 
                  name="Age"
                  lowestVal={lowestAgeRange}
                  highestVal={highestAgeRange}
                  lowestClick={0}
                  highestClick={highestAgeRange - lowestAgeRange}
                  callback={(
                    args: {
                      value: number[]
                    }
                  )=>{
                    this.setState(
                      {
                        lowYearBound: args.value[0],
                        highYearBound: args.value[1],
                      },
                      ()=>{
                        return this.refreshData(false); // do not viti DB
                      }
                    );

                />
              </Col>
            </Row>
            <Row>
              <Col xs={6} md={4}>

              </Col>
              <Col xs={6} md={4}>

              </Col>
            </Row>
*/}
            <Row>
              <Col>
                <Form.Control id="filterWord" type="text" placeholder="Filter word" />
              </Col>
              <Col>
                <Button onClick={(e:any)=>{
                  e.preventDefault();
                  let id = "filterWord";
                  const filterWord = document.getElementById(id);
                  if(filterWord === null){
                    console.log(`didn't find element with ID = ${id}`);
                    return;
                  }

                  let newWord = (filterWord as HTMLInputElement).value;
                  this.state.filterWords.push(newWord.toLowerCase());
                  this.refreshData(false); // do not viti DB
                }}>
                  Add filter word
                </Button>
              </Col>        
              <Col>
                <Dropdown>
                  <Dropdown.Toggle id="dropdown-filter">
                    Select filter word
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                  {Array.from({ length: this.dropdownFilters.length })
                    .map((_, index) => {
                    return (
                      <Dropdown.Item onSelect={()=>{
                        // console.log(`click! ${this.dropdownFilters[index]}`);
                        this.state.filterWords.push(this.dropdownFilters[index].toLowerCase());
                        this.refreshData(false); // do not viti DB
                      }}>{`${this.dropdownFilters[index]}`}</Dropdown.Item>
                    )}
                  )}
                  </Dropdown.Menu>
                </Dropdown>
              </Col>
              <Col>
                <Button onClick={(e:any)=>{
                  e.preventDefault();
                  this.setState({
                    filterWords: [],
                  },
                  ()=>
                  {
                    this.refreshData(false); // do not viti DB
                  })
                }}>
                  Clear filter words
                </Button>
              </Col>
            </Row>
            <Row>
              <Col>
                {(this.state.filterWords.length > 0) ? 
                  (<div><h2>Filter by words: {JSON.stringify(this.state.filterWords)}</h2></div>) : ''}
              </Col>
            </Row>
          </Container>
        </Accordion.Collapse>
      </Card>
    </Accordion>

    <Accordion>
      <Card>
        <Card.Header>
          <Accordion.Toggle  as={Card.Header} eventKey="Scatter plot">
            Scatter plot
          </Accordion.Toggle>
        </Card.Header>
        <Accordion.Collapse eventKey="Scatter plot">
          <Scatter
            options={{
              events: ['click', 'mousemove'],
              tooltips: {
                // Disable the on-canvas tooltip
                enabled: false,
                mode: 'index',
                position: 'nearest',
                custom: customTooltips,
                callbacks: {
                  label: function(tooltipItem: any, data: any) {
                    console.log(`tooltipItem.datasetIndex = ${tooltipItem.datasetIndex}`);
                    var labelText = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].myLabel || 'no label found';
                    // data.datasets[0].data.length
                    return labelText;
                  }
                }
              }
            }}
            data={{
              datasets: [
                {
                  label: 'Price vs age',
                  data: 
                    this.state.filteredVehicleAds.filter((ad)=>{
                      let plotYear = parseInt(ad.year);
                      let plotPrice = parseInt(ad.price);
                      if(isNaN(plotYear)){
                        return false;
                      }
                      if(isNaN(plotPrice)){
                        return false;
                      }
                      return true;
                    }).map((ad)=>{
                      let plotYear = parseInt(ad.year);
                      let plotPrice = parseInt(ad.price);
                      return {
                        x: plotYear,
                        y: plotPrice,
                        myLabel: `<a href=${ad.weblink} target="_blank" rel="noopener noreferrer">${ad.title} </a>`,
                      };
                    })
                  ,
                  backgroundColor: 'rgba(255, 99, 132, 1)',
                },
              ],
            }}
          >
          </Scatter> 
        </Accordion.Collapse>
      </Card>
    </Accordion>
{/*
<Accordion>
      <Card>
        <Card.Header>
          <Accordion.Toggle  as={Card.Header} eventKey="Word cloud">
            Word cloud
          </Accordion.Toggle>
        </Card.Header>
        <Accordion.Collapse eventKey="Word cloud">
*/}
          <Container>
            <ReactWordcloud 
              words={this.state.wordcloudWords} 
              options={{
                rotations: 3,
                fontSizes: [16, 32],
                deterministic: true,
                enableTooltip: false,
              }}
              callbacks={{
                onWordClick: (e)=>{
                  // console.log(`click! ${e.text}`);
                  this.state.filterWords.push(e.text);
                  this.refreshData(false); // do not viti DB
                }
              }}
            ></ReactWordcloud>
          </Container>
{/*
        </Accordion.Collapse>
      </Card>
    </Accordion>
*/}    
    </>
    );
  }

  filterAndDisplay(allRows: VehicleAdvert[]){
    // console.log('filter ad list');
    const filteredRows: VehicleAdvert[] = allRows
    .filter((x)=>{
      if( this.state.transmissionFilter === '' 
      || this.state.transmissionFilter === 'any' ){
        return true; // accept everything
      }
      if(!x.transmission){
        return false;
      }

      const result = x.transmission === this.state.transmissionFilter;
      return result;
    })
    .filter((x)=>{
      // console.log(`this.state.lowYearBound = ${this.state.lowYearBound}`);
      if(!x.year || x.year.length < 4){
        if(this.state.lowYearBound === lowestAgeRange &&
          this.state.highYearBound === highestAgeRange ){
            return true; // include everything
          } else {
            return false; // exclude non-specified ages
          }
      }
      try{
        const year = parseInt(x.year.substring(0,4));
        // console.log(`year is ${year}, low = ${this.state.lowYearBound}, high = ${this.state.highYearBound}`);
        const inrange = (year >= this.state.lowYearBound) && (year <= this.state.highYearBound);
        //if(inrange){
        //  console.log(`year ${year} is between ${this.state.lowYearBound} and ${this.state.highYearBound}`)
        //}
        return inrange;
      } catch( err: any){
        return true;
      }
    })
    .filter((x)=>{
      // console.log(`this.state.lowPriceBound = ${this.state.lowPriceBound}`);
      if(x.price.length === 0){
        if(this.state.lowPriceBound === lowestPriceRange &&
          this.state.highPriceBound === highestPriceRange ){
            return true; // include everything
          } else {
            return false; // exclude non-specified ages
          }
      }
      try{
        const price = parseInt(x.price.replace(/,/g,''));
        // console.log(`price is ${price}, low = ${this.state.lowPriceBound}, high = ${this.state.highPriceBound}`);
        const inrange = (price >= this.state.lowPriceBound) && (price <= this.state.highPriceBound);
        //if(inrange){
        //  console.log(`in range = ${inrange}`);
        //}
        return inrange;
      } catch( err: any){
        return true;
      }
    })
    .filter((x)=>{
      // console.log(`this.state.lowBerthBound = ${this.state.lowBerthBound}`);
      const berth = parseInt(x.berth);

      if(isNaN(berth)){
        if(this.state.lowBerthBound === lowestBerthRange &&
          this.state.highBerthBound === highestBerthRange ){
          return true; // include everything
        } else {
          return false; // exclude non-specified ages
        }
      }
      // console.log(`price is ${price}, low = ${this.state.lowPriceBound}, high = ${this.state.highPriceBound}`);
      const inrange = (berth >= this.state.lowBerthBound) && (berth <= this.state.highBerthBound);
      //if(inrange){
      //  console.log(`in range = ${inrange}`);
      //}
      return inrange;
    })
    .filter((x)=>{
      // console.log(`this.state.lowBerthBound = ${this.state.lowBerthBound}`);
      let miles;
      if(x.miles){
        miles = parseInt(x.miles.replace(/,/g,''));
      }

      if(!miles || isNaN(miles)){
        if(this.state.lowMilesBound === lowestMilesRange &&
          this.state.highMilesBound === highestMilesRange ){
          return true; // include everything
        } else {
          return false; // exclude non-specified ages
        }
      }
      // console.log(`price is ${price}, low = ${this.state.lowPriceBound}, high = ${this.state.highPriceBound}`);
      const inrange = (miles >= this.state.lowMilesBound) && (miles <= this.state.highMilesBound);
      //if(inrange){
      //  console.log(`in range = ${inrange}`);
      //}
      return inrange;
    })  
    .filter((x)=>{
      if( this.state.filterWords.length === 0 ){
        return true; // accept everything
      }
      const desc = x.description.replace(/"/g,'').replace(/:/g,' ').toLowerCase();
      // console.log(`check description ${desc}`);

      for( let i = 0; i < this.state.filterWords.length; i = i + 1 ){
        const w = this.state.filterWords[i];
        // console.log(`check filter word ${w}`);
        if(!desc.includes(w)){
          //console.log(`description ${x.description}}`);
          //console.log(`reject description ${desc}}`);
          return false; // reject as doesn't contain filter word
        } else {
          // console.log(`contains ${w}, OK`);
        }
      }
      // console.log(`accept description ${adData.description.substring(0, 10)}...}`);
      return true;          
    });
    // console.log(`display ${filteredRows.length} ads in the table`)
    const oldMin = this.state.minImageIndex;
    const oldMax = this.state.maxImageIndex;
    this.setState({ 
      adCountMessage: `Showing ${filteredRows.length} adverts\n`,
      allVehicleAds: allRows,
      filteredVehicleAds: filteredRows,
      minImageIndex: 0,
      maxImageIndex: Math.min(oldMax - oldMin, filteredRows.length - 1),
    });
  }

  async getFilteredAdsList(
    maxNumAds: number,
    visitDB: boolean,
  ): Promise<void> {
    // console.log(`url for REST requests = ${url}`);
    if(!visitDB){
      this.filterAndDisplay(this.state.allVehicleAds);
      return;
    }
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');

    this.setState({
      adCountMessage: 'Loading adverts from the cloud...',
    });


    return getAdsList((allAds: VehicleAdvert[])=>{
      this.filterAndDisplay(allAds);
    });
  }

  async refreshData(
    visitDB: boolean,
  ){
    // console.log(`in refreshData`);
    await this.getFilteredAdsList(maxNumAllAds, visitDB);
    // console.log(`go calculate freqs`);9o0

    const freqs = wordFreq(JSON.stringify(this.state.filteredVehicleAds.map((row) => {
      return getTextForWordcloud(row);
    })));
    // console.log(`freqs are ${freqs}`);
    this.setState({
      wordcloudWords : freqs
    });

    // console.log(`const adsData = ${JSON.stringify(this.state.adTableRows)}`);
  }

}
