describe("Request/Response specs", function() {
	beforeEach(function() {
		air.reset();
	});
	it('should return response to callback', function(done) {
		air.replyTo('foo', function(bar, cb) {
			cb(7);
		});
		air.request('foo', function(d) {
			expect(d).toBe(7);
			done();
		});	
	});

	it('should return response to subscription', function(done) {
		air.replyTo('foo', function(bar, cb) {
			cb(7);
		});
		air.subscribe('bar', function(d) {
			expect(d).toBe(7);
			done();
		})
		air.request('foo', 'bar');	
	});

	it('should get response from first responder only', function(done) {
		var secondWasCalled = false;
		air.replyTo('foo', function(bar, cb) {
			cb(7);
		});
		air.replyTo('foo', function(bar, cb) {
			secondWasCalled = true;
			cb(8);
		});
		air.request('foo', function(d) {
			expect(d).toBe(7);
			setTimeout(function(){
				expect(secondWasCalled).toBe(false)
				done();
			},10);
		});
	});
});