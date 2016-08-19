
describe('Runner', ()=>{
    
    const testHookId = 'hook-1';
    const testCodeId = 'code-test';
    const testPlacementId = 'placement-1';
    
    it('should store instance of context',()=>{

        const runner = new FrameWatcher.Runner();
        expect(runner.context).to.instanceof(FrameWatcher.Context);

    });

    it('should register and store element',()=>{
        
        const runner = new FrameWatcher.Runner();
        runner.debug = true;
        runner.registerElement(testHookId,testCodeId);

        expect(runner.elements).to.be.a('array');
        expect(runner.elements).to.be.not.empty;

    });

    it('should register and store many elements',()=>{
        
        const runner = new FrameWatcher.Runner();
        runner.debug = 1;
        runner.registerElement(testHookId,testCodeId);

        expect(runner.elements).to.be.a('array');
        expect(runner.elements).to.be.not.empty;

    });
    
});
