'use strict';

/* Magic Mirror
 * Module: MMM-lyft
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

		this.started = false;
		this.config = null;
	},

	getData: function() {
		var self = this;
						
		request({
			url: "https://api.uber.com/v1/estimates/time",
			method: 'GET',
			headers: {
		        "Authorization": "Token " + self.config.uberServerToken
		    },
		    data: {
		        start_latitude: self.config.lat,
		        start_longitude: self.config.lng,
		        product_id: self.product_id
		    },
		}, function (error, response, body) {
			
			if (!error && response.statusCode == 200) {
				self.sendSocketNotification("TIME", body);
			}
		});

		request({
			url: "https://api.uber.com/v1/estimates/price",
			method: 'GET',
			headers: {
				        "Authorization": "Token " + self.config.uberServerToken
		    },
		    data: {
		        start_latitude: self.config.lat,
		        start_longitude: self.config.lng,

		        end_latitude: self.config.lat,
		        end_longitude: self.config.lng
		    },
		}, function (error, response, body) {
			
			if (!error && response.statusCode == 200) {
				self.sendSocketNotification("PRICE", body);
			}
		});

		setTimeout(function() { self.getData(); }, this.config.updateInterval);
	},

	socketNotificationReceived: function(notification, payload) {
		var self = this;
		if (notification === 'CONFIG' && self.started == false) {
			self.config = payload;
			self.getData();
			self.started = true;
		}
	}
});
