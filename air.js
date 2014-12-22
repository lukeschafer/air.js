(function() {
	var hubs = {};

	/**
	 * Represents an Air instance.
	 * @constructor
	 */
	function Air(hub) {
		if (!hub) hub = "hub_" + (autoHubName++);
		this._subscriptions = {};
		this._requestResponse = {};
		this.name = hub;
	}
	var autoHubName = 0;

	/** 
	* Create a new Air scope. 'Child' is a convenience thing, channels still need to be manually bridged
	* @param {string} name - Channel name
	* @returns {Air} The new Air
	*/
	Air.prototype.hub = function(hub) {
		if (hubs[hub]) return hubs[hub];
		
		var newhub = new Air(hub);
		hubs[newhub.name] = newhub
		return newhub;
	}
	
	/** 
	* Subscribe to a channel
	* @param {string} channel - Channel name
	* @param {Function} handler - Receiver of published message
	*/
	Air.prototype.subscribe = function(channel, handler) {
		if (!this._subscriptions[channel]) this._subscriptions[channel] = [];
		if (any(this._subscriptions[channel], function(sub) { return sub === handler; })) return;
		this._subscriptions[channel].push(handler);
	}
	
	/** 
	* Publish to a channel
	* @param {string} channel - Channel name
	* @param {*} [data] - Data to publish
	*/
	Air.prototype.publish = function(channel, data) {
		send(this._subscriptions, channel, false, data);
	}

	Air.prototype.bridgeSubscription = function(toHub, fromChannel, toChannel, map) {
		var me = this;
		console.log(typeof toChannel)
		if (typeof toChannel == 'function') {
			map = toChannel;
			toChannel = null;
		}
		if (!map) map = function(d) { return d; };
		this.subscribe(fromChannel, function(data, channel) {
			toHub.publish(toChannel || channel, map(data));
		});
	}

	Air.prototype.bridgeRequest = function(toHub, fromChannel, toChannel, map) {
		var me = this;
		if (!map) map = function(d) { return d; };
		me.replyTo(this, fromChannel, function(data, reply) {
			me.publish(toHub, toChannel, map(data));
		});
	}

	Air.prototype.replyTo = function(requestType, handler) {
		if (!this._requestResponse[requestType]) this._requestResponse[requestType] = [];
		if (any(this._requestResponse[requestType], function(rr) { return rr === handler; })) return;
		this._requestResponse[requestType].push(handler);
	}
	
	/** 
	* Request some data.
	* @param {string} requestType - Request type
	* @param {*} [data] - Data required for request. If not set, replyTo is the second argument
	* @param {(string|Function)} [replyTo] - Reply destination, can be either a channel (to publish to) or a callback. If not set, replies are ignored
	*/
	Air.prototype.request = function(requestType, data, replyTo) {
		var me = this;
			//if only 2 args, assume no input data
		if (!replyTo) {
			replyTo = data;
			data = null;
		}
			
		//if replyTo is string, then it's to reply to a channel not a function
		if (typeof replyTo == "string") {
			var replyDestination = replyTo;
			replyTo = function(reply) { me.publish(replyDestination, reply); }
		}
		//if no reply destination, assume it goes to the ether.
		if (!replyTo) replyTo = function(){}
		return send(this	._requestResponse, requestType, true, data, replyTo);
	}
	
	Air.prototype.reset = init;

	//expose
	function init() {
		hubs = {};
		var a = new Air('global');
		hubs.global = a;
		if (typeof module !== 'undefined' && module && typeof module.exports !== 'undefined') module.exports = a;
		if (typeof window !== 'undefined') window.air = a;
		air = a;
		autoHubName = 0;
	}
	var air = null;
	init();
	
	//helpers
	function any(lst, predicate) {
			for(var i = 0, l = lst.length; i < l; i++) {
			if (predicate(lst[i])) return true;
		}
		return false;
	};
	
	function send(receivers, channel, firstOnly, arg1, arg2) {
		function sendToReceiver(receiver) {
			if (receiver && receiver.length) {
				for (var i = 0, len = receiver.length; i < len; i++)  {
					nextTick((function(i) {
						return function() {
							if (arg2) //will always be set for request/reply
								receiver[i](arg1, arg2, channel);
							else
								receiver[i](arg1, channel);
						};
					})(i));
					if (firstOnly) return true;
				}
				return true;
			}
		}
		var sentExplicit = sendToReceiver(receivers[channel]);
		if (sentExplicit && firstOnly) return true;

		var sentAll = sendToReceiver(receivers['all']);
		return (sentExplicit || sentAll);
	}

	var nextTick = null;
	if (typeof process != 'undefined' && process.nextTick) nextTick = process.nextTick;
	if (!nextTick && window && window.setImmediate) nextTick = window.setImmediate;
	if (!nextTick && window && window.setTimeout) nextTick = function(fn) { window.setTimeout(fn, 0); };
})()