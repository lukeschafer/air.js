describe("Subscription specs", function() {
	beforeEach(function() {
		air.reset();
	});
	it('should publish event to a subscriber', function(done) {
		air.subscribe('foo', function(bar) {
			expect(bar).toBe(3)
			done();
		});
		air.publish('foo', 3);	
	});

	it('should publish event to multiple subscribers', function(done) {
		var i = 0;
		air.subscribe('foo', function(bar) {
			expect(bar).toBe(3)
			i++;
			if (i == 2)	done();
		});
		air.subscribe('foo', function(bar) {
			expect(bar).toBe(3)
			i++;
			if (i == 2)	done();
		});	
		air.publish('foo', 3);	
	});
});