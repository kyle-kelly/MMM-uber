# MMM-uber

![Alt](https://github.com/kyle-kelly/MMM-uber/tree/master/img "A preview of the Uber module.")

A module for the [Magic Mirror](https://magicmirror.builders/). This module displays ETA and surge pricing for Uber.

The module is loosely based on [another Uber module](https://github.com/derickson/MMderickson/tree/master/uber) that I could not get working due to a CORS error. 

## Installation

To install, clone this repository into your modules folder. Then add the following to your configuration file:
```
{
	module: 'MMM-uber',
	position: 'top_left',
	header: 'Uber (DC)',
	config: {
		lat: XX.XXXX,  // use your exact pickup loaction
		lng: XX.XXXX, // use your exact pickup loaction
		uberServerToken: '<your Uber service token>',
	}
},
```
The Uber server token is acquired through Uber by [registering as a devloper](https://developer.uber.com/). 

## Configuration Options

The following properties can be configured:

| Options | Description|
| --- | --- |
|```header```| Can be changed to any **string** or left **blank**: ```' '``` |
| ```ride_type```| The ride type for time and cost estimates. Add to the ```config: {}``` section. <br> **Possible values:** ```'POOL'```, ```'uberXL'```, ```'SELECT'```, ```'BLACK'```, ```'SUV'```, ```'ASSIST'```, ```'WAV'```, ```'TAXI'```. <br> **Default value:** ```'uberX'```.|