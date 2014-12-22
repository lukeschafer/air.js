describe("Bridge Subscriptions specs", function() {
	beforeEach(function() {
		air.reset();
	});

	it('should bridge subscriptions from another hub', function(done) {
		var origin = air.hub('origin');
		var destination = air.hub('destination');

		origin.bridgeSubscription(destination, 'foo');

		destination.subscribe('foo', function(bar) {
			expect(bar).toBe(5);
			done();
		})

		origin.publish('foo', 5)
	});
	
	it('should bridge subscriptions from another hub with mapper', function(done) {
		var origin = air.hub('origin');
		var destination = air.hub('destination');

		origin.bridgeSubscription(destination, 'foo', function(input) { return input+1; });

		destination.subscribe('foo', function(bar) {
			expect(bar).toBe(6);
			done();
		})

		origin.publish('foo', 5)
	});

	it('should bridge subscriptions to different channel', function(done) {
		var origin = air.hub('origin');
		var destination = air.hub('destination');

		origin.bridgeSubscription(destination, 'foo', 'bar');

		destination.subscribe('bar', function(bar) {
			expect(bar).toBe(5);
			done();
		})

		origin.publish('foo', 5)
	});

	it('should bridge subscriptions to different channel with mapper', function(done) {
		var origin = air.hub('origin');
		var destination = air.hub('destination');

		origin.bridgeSubscription(destination, 'foo', 'bar', function(input) { return input+1; });

		destination.subscribe('bar', function(bar) {
			expect(bar).toBe(6);
			done();
		})

		origin.publish('foo', 5)
	});
});