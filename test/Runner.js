
describe('Runner', ()=>{
    
    const testHookId = 'hook-1';
    const testCodeId = 'code-test';
    const testPlacementId = 'placement-1';
    
    it('should store instance of context', function () {

        const runner = new FrameWatcher.Runner();
        expect(runner.context).to.instanceof(FrameWatcher.Context);

    });

    it('should register and store element', function () {
        
        const runner = new FrameWatcher.Runner();
        runner.debug = 0;
        runner.registerElement(testHookId,testCodeId);

        expect(runner.elements).to.be.a('array');
        expect(runner.elements).to.be.not.empty;

    });

    it('should register and store many elements', function () {
        
        const runner = new FrameWatcher.Runner();
        runner.debug = 0;
        runner.registerElement(testHookId,testCodeId);

        expect(runner.elements).to.be.a('array');
        expect(runner.elements).to.be.not.empty;

    });

    
    it('should register proper sender', function () {

        const runner = new FrameWatcher.Runner('socket', predefinedUrl, predefinedCookie, predefinedView);
        
        runner.registerElement(testHookId,testCodeId);
        runner.checkElements(); 
        
        const data = runner.sender.prepareData();
    
        expect(runner.sender).to.instanceof(FrameWatcher.SocketSender);

        expect(data).to.be.a('array');
        expect(data).to.be.not.empty;

        expect(data).to.have.lengthOf(1);

        expect(data[0]).to.have.property('cookie').and.equal(predefinedCookie);
        expect(data[0]).to.have.property('view').and.equal(predefinedView);
        expect(data[0]).to.have.property('placement').and.equal(testPlacementId);
        expect(data[0]).to.have.property('code').and.equal(testCodeId);

       
        
    });
    
    
});
