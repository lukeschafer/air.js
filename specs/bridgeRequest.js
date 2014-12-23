describe("Bridge Requests specs", function() {
	beforeEach(function() {
		air.reset();
	});

	it('should bridge requests from another hub', function(done) {
		var origin = air.hub('origin');
		var destination = air.hub('destination');

		origin.bridgeRequest(destination, 'foo');

		destination.replyTo('foo', function(d, cb) { cb(5); });

		origin.request('foo', function(bar) {
			expect(bar).toBe(5);
			done();
		})
	});
	
	it('should bridge requests from another hub with mapper', function(done) {
		var origin = air.hub('origin');
		var destination = air.hub('destination');

		origin.bridgeRequest(destination, 'foo', function(d) { return d+1; });

		destination.replyTo('foo', function(d, cb) { cb(d + 1); });

		origin.request('foo', 5, function(bar) {
			expect(bar).toBe(7);
			done();
		})
	});

	it('should bridge requests to different request type', function(done) {
		var origin = air.hub('origin');
		var destination = air.hub('destination');

		origin.bridgeRequest(destination, 'foo', 'bar');

		destination.replyTo('bar', function(d, cb) { cb(5); });

		origin.request('foo', function(bar) {
			expect(bar).toBe(5);
			done();
		})
	});

	it('should bridge subscriptions to different request type with mapper', function(done) {
		var origin = air.hub('origin');
		var destination = air.hub('destination');

		origin.bridgeRequest(destination, 'foo', 'bar', function(d) { return d+1; });

		destination.replyTo('bar', function(d, cb) { cb(d + 1); });

		origin.request('foo', 5, function(bar) {
			expect(bar).toBe(7);
			done();
		})
	});

	it('should bridge subscriptions to different request type with mapper and respond to channel', function(done) {
		var origin = air.hub('origin');
		var destination = air.hub('destination');

		origin.bridgeRequest(destination, 'foo', 'bar', function(d) { return d+1; });

		destination.replyTo('bar', function(d, cb) { cb(d + 1); });

		origin.subscribe('baz', function(bar) {
			expect(bar).toBe(7);
			done();
		});

		origin.request('foo', 5, 'baz');
	});
});