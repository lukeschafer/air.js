describe("Hub specs", function() {
	beforeEach(function() {
		air.reset();
	});

	it('should allow creation of hub', function() {
		var newhub = air.hub('test');
		expect(!!newhub).toBe(true, 'should exist');
		expect(newhub == air).toBe(false, 'should not be same as global instance');
		expect(typeof newhub.subscribe == 'function').toBe(true);
	});

	it('should allow explicit access to global hub', function() {
		var newhub = air.hub('global');
		expect(!!newhub).toBe(true, 'should exist');
		expect(newhub == air).toBe(true, 'should be same as global instance');
	});

	it('should allow hubs with default name', function() {
		var newhub = air.hub();
		expect(!!newhub).toBe(true, 'should exist');
		expect(newhub.name).toBe('hub_0')
		expect(newhub == air).toBe(false, 'should not be same as global instance');
	});

	it('should publish event to a subscriber on hub', function(done) {
		var hub = air.hub('baz');
		hub.subscribe('foo', function(bar) {
			expect(bar).toEqual(3)
			done();
		});
		hub.publish('foo', 3);	
	});
});