describe('Estimation', ()=>{
    
    it('should store instance of context and element',()=>{

        const element = new FrameWatcher.Element(testHookId,testCodeId);
        const context = new FrameWatcher.Context();

        const estimation = new FrameWatcher.Estimation(element,context);

        expect(estimation.context).to.instanceof(FrameWatcher.Context);
        expect(estimation.element).to.instanceof(FrameWatcher.Element);

    });

    it('should calculate proper viewablity precent',()=>{

        const element = new FrameWatcher.Element(testHookId,testCodeId);
        const context = new FrameWatcher.Context();

        const estimation = new FrameWatcher.Estimation(element,context);
        const calculation = estimation.calculate();        

        expect(calculation).to.equal(1);

    });


});
