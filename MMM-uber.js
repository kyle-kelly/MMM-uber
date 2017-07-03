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
		ride_type: "uberX",
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
		this.uberTime = null;
		this.uberSurge = null;

		this.loaded = false;
		Log.log("Sending CONFIG to node_helper.js in " + this.name);
		Log.log("Payload: " + this.config);
		this.sendSocketNotification('CONFIG', this.config);
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
				
				if(rtime.display_name === this.config.ride_type){
					// convert estimated seconds to minutes
					this.uberTime = rtime.estimate / 60;
					break;
				}
			}
		}

		// go through the price data to find the uberX product
		else if (FLAG === "PRICE"){
			Log.log("Price:");
			Log.log(result);
			for( var i=0, count = result.prices.length; i< count; i++) {
				var rprice = result.prices[i];

				if(rprice.display_name === this.config.ride_type){
					// grab the surge pricing
					this.uberSurge = rprice.surge_multiplier;
					break;
				}
			}
		}
	},

	// Override dom generator.
	getDom: function() {
		var wrapper = document.createElement("div");

		var uber = document.createElement("div");
		uber.className = "uberButton";
		
		var uberIcon = document.createElement("img");
		uberIcon.className = "badge";
		uberIcon.src = "modules/MMM-uber/UBER_API_Badges_1x_22px.png";

		var uberText = document.createElement("span");

		if(this.loaded) {
			var myText = this.config.ride_type + " in "+ this.uberTime +" min ";
			Log.log("ubersurge: " + this.uberSurge);
			// only show the surge pricing if it is above 1.0
			if(typeof this.uberSurge !== "undefined" && this.uberSurge > 1.0){
				myText += " - " + this.uberSurge + "X surge pricing";
			}
			uberText.innerHTML = myText;
		} else {
			// Loading message
			uberText.innerHTML = "Checking Uber status ...";
		}

		uber.appendChild(uberIcon);
		uber.appendChild(uberText);
		
		wrapper.appendChild(uber);
		return wrapper;
	},

	socketNotificationReceived: function(notification, payload) {
		//Log.log(this.name + " received a socket notification: " + notification + " - Payload: " + payload);
		if (notification === "TIME") {
			this.processUber("TIME", JSON.parse(payload));
			this.updateDom(this.config.animationSpeed);
		}
		else if (notification === "PRICE") {
			this.processUber("PRICE", JSON.parse(payload));
			this.loaded = true;
			this.updateDom(this.config.animationSpeed);
		}
	}

});
