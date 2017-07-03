'use strict';

/* Magic Mirror
 * Module: MMM-uber
 *
 * By Kyle Kelly
 * MIT Licensed.
 */

const NodeHelper = require('node_helper');
var request = require('request');
var moment = require('moment');

module.exports = NodeHelper.create({

	start: function() {
		var self = this;
		console.log("Starting node helper for: " + this.name);

		this.config = null;
	},

	getData: function() {
		var self = this;
		
		request({
			url: "https://api.uber.com/v1/estimates/time?start_latitude=" + this.config.lat + "&start_longitude=" + this.config.lng,
			method: 'GET',
			headers: {
		        'Authorization': 'Token ' + this.config.uberServerToken,
		        'Accept-Language': 'en_US',
		        'Content-Type': 'application/json'
		    },
		}, function (error, response, body) {
			
			if (!error && response.statusCode == 200) {
				self.sendSocketNotification("TIME", body);
			}
			else {
				self.sendSocketNotification("ERROR", "In TIME request with status code: " + response.statusCode);
			}
		});

		request({
			url: "https://api.uber.com/v1/estimates/price?start_latitude=" + this.config.lat + "&start_longitude=" + this.config.lng + "&end_latitude=" + this.config.lat + "&end_longitude=" + this.config.lng,
			method: 'GET',
			headers: {
				'Authorization': 'Token ' + this.config.uberServerToken,
		        'Accept-Language': 'en_US',
		        'Content-Type': 'application/json'
		    },
		}, function (error, response, body) {
			
			if (!error && response.statusCode == 200) {
				self.sendSocketNotification("PRICE", body);
			}
			else {
				self.sendSocketNotification("ERROR", "In PRICE request with status code: " + response.statusCode);
			}
		});

		setTimeout(function() { self.getData(); }, this.config.updateInterval);
		
	},

	socketNotificationReceived: function(notification, payload) {
		if (notification === 'CONFIG') {
			this.config = payload;
			this.getData();
		}
	}
});
