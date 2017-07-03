# MMM-uber

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
The client ID and client secret are acquired through Uber by [registering as a devloper](https://developer.uber.com/). 

## Configuration Options

The following properties can be configured:

| Options | Description|
| --- | --- |
|```header```| Can be changed to any **string** or left **blank**: ```' '``` |
| ```ride_type```| The ride type for time and cost estimates. <br> **Possible values:** ```'Pool'```, ```'uberXL'```, ```'SELECT'```, ```'BLACK'```, ```'SUV'```, ```'ASSIST'```, ```'WAV'```, ```'TAXI'```. <br> **Default value:** ```'uberX'```.|