
describe('Sender', function () {

    describe('SenderSelect', function () {
        
        it('should implement right Sender object by given type', function () {
            
            expect(new FrameWatcher.SenderSelect('http',null).returnObject()).to.instanceof(FrameWatcher.HttpSender);
            expect(new FrameWatcher.SenderSelect('socket',null).returnObject()).to.instanceof(FrameWatcher.SocketSender);

        });
        
        
        it('should throw an error when given wrong type', function () {

            expect(() => new FrameWatcher.SenderSelect('soap',null).returnObject()).to.throw(Error);

        });

        it('should generate unique viewID when not passed', function () {

            const runner = new FrameWatcher.Runner('socket', predefinedUrl, predefinedCookie);
        
            runner.registerElement(testHookId,testCodeId);
            runner.checkElements(); 
        
            const data = runner.sender.prepareData();
    
            expect(data[0]['view']).to.be.a('string');
            expect(data[0]['view']).to.have.lengthOf(36);

        });
        
        
    });
    
    
});
