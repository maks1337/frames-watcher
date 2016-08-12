describe('Context',()=>{

    it('should store context size', ()=>{
        
        const context = new FrameWatcher.Context();

        expect(context.width).to.equal(window.innerWidth);
        expect(context.height).to.equal(window.innerHeight);

    });    

    it('should store metadata of context', ()=>{   

        const context = new FrameWatcher.Context(); 

        expect(context.iframe).to.be.false;
        expect(context.url).to.be.a('string');
        expect(context.domain).to.be.a('string');

    });

});