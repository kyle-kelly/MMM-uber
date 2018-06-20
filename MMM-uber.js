/* global Module */

/* Magic Mirror
 * Module: Uber
 * 
 * Shows the time and surge pricing for UberX
 *
 * By Kyle Kelly
 * based on MagicMirror work by Michael Teeuw http://michaelteeuw.nl
 * and by derickson https://github.com/derickson/MMderickson/tree/master/uber
 * MIT Licensed.
 */

Module.register("MMM-uber",{

	// Default module config.
	defaults: {
		lat: null,
		lng: null,
		ride_types: [ 'UberX' ],
		uberServerToken: null,

		updateInterval: 5 * 60 * 1000, // every 5 minutes
		animationSpeed: 1000,
	},

	// Define required scripts.
	getScripts: function() {
		return ["moment.js", "https://code.jquery.com/jquery-2.2.3.min.js"];
	},

	// Define required styles.
	getStyles: function() {
		return ["MMM-uber.css"];
	},

	start: function() {
		Log.info("Starting module: " + this.name);

		// Set locale.
		moment.locale(config.language);

		// variables that will be loaded from service
		this.uberTimes = [];
		this.uberSurges = [];

		this.time_loaded = null;
		this.price_loaded = null;
		this.dataID = null;

		Log.log("Sending CONFIG to node_helper.js in " + this.name);
		Log.log("Payload: " + this.config);
		this.sendSocketNotification('CONFIG', this.config);
		this.sendSocketNotification('DATA', null);
		this.dataTimer();
	},

	// start interval timer to update data every 5 minutes
	dataTimer: function() {
		var self = this;
		this.dataID = setInterval(function() { self.sendSocketNotification('DATA', null); }, this.config.updateInterval);
	},

	// unload the results from uber services
	processUber: function(FLAG, result) {
		var self = this;
		Log.log("ProcessUber");

		// go through the time data to find the uberX product
		if (FLAG === "TIME"){
			Log.log("Time:");
			Log.log(result);
			for (var i = 0, count = result.times.length; i < count ; i++) {

				var rtime = result.times[i];
				
				// iterate through each ride type in config list
	            for (var ride_idx = 0; ride_idx < this.config.ride_types.length; ride_idx++) {
					
					if(rtime.display_name === this.config.ride_types[ride_idx]){
						// convert estimated seconds to minutes
						this.uberTimes[ride_idx] = rtime.estimate / 60;
						Log.log("Uber time = " + this.uberTimes[ride_idx]);
					}
				}
			}
		}

		// go through the price data to find the uberX product
		else if (FLAG === "PRICE"){
			Log.log("Price:");
			Log.log(result);
			for( var i=0, count = result.prices.length; i< count; i++) {
				var rprice = result.prices[i];

				// iterate through each ride type in config list
	            for (var price_idx = 0; price_idx < this.config.ride_types.length; price_idx++) {

					if(rprice.display_name === this.config.ride_types[price_idx]){
						// grab the surge pricing
						this.uberSurges[price_idx] = rprice.surge_multiplier;
						Log.log("Uber surge = " + this.uberSurges[price_idx]);
					}
				}
			}
		}
	},

	// Override dom generator.
	getDom: function() {
		var wrapper = document.createElement("div");

		// iterate through each ride type in config list
        for (var element_idx = 0; element_idx < this.config.ride_types.length; element_idx++) {

			var uber = document.createElement("div");
			uber.className = "uberButton";
			
			var uberIcon = document.createElement("img");
			uberIcon.className = "badge";
			uberIcon.src = "modules/MMM-uber/UBER_API_Badges_1x_22px.png";

			var uberText = document.createElement("span");

			if(this.time_loaded && this.price_loaded) {
				
				var myText = this.config.ride_types[element_idx] + " in "+ this.uberTimes[element_idx] +" min ";
				
				// only show the surge pricing if it is above 1.0
				if(typeof this.uberSurges[element_idx] !== "undefined" && this.uberSurges > 1.0){
					myText += " - " + this.uberSurges[element_idx] + "X surge pricing";
				}
				uberText.innerHTML = myText;
			} 
			else {
				// Loading message
				uberText.innerHTML = "Checking Uber status ...";
			}

			uber.appendChild(uberIcon);
			uber.appendChild(uberText);
			
			wrapper.appendChild(uber);
		}
		
		return wrapper;
	},

	socketNotificationReceived: function(notification, payload) {
		//Log.log(this.name + " received a socket notification: " + notification + " - Payload: " + payload);
		if (notification === "TIME") {
			this.processUber("TIME", JSON.parse(payload));
			this.time_loaded = true;
			this.updateDom(this.config.animationSpeed);
		}
		else if (notification === "PRICE") {
			this.processUber("PRICE", JSON.parse(payload));
			this.price_loaded = true;
			this.updateDom(this.config.animationSpeed);
		}
		else if (notification === "TIME_ERROR" || notification === "PRICE_ERROR") {
			// Stop update intervals, clear vars and wait 5 minutes to try and get another token
			clearInterval(this.dataID);
			this.dataID = null;
			this.time_loaded = false;
			this.price_loaded = false;
			this.updateDom(this.config.animationSpeed);
			this.dataTimer();
		}
	}

});
