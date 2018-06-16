
# MMM-uber

![Alt text](/img/uber-screenshot.png?raw=true "A preview of the Uber module.")

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
| ```ride_types```| The ride type for time and cost estimates. The latest release allows for multiple ride types to be displayed through one module. Add to the ```config: {}``` section. <br> **Possible values:** ```'UberPool'```, ```'UberXL'```, ```'Select'```, ```'Black'```, ```'Black SUV'```. <br> **Default value:** ```'uberX'```. <br> **Examples:** ```ride_types: [ 'POOL' ]``` or ```ride_types: [ 'uberX', 'uberXL' ]```|
