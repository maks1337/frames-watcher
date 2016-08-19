describe('Strategies', ()=>{ 

    describe('Basic strategy', ()=>{

        it('defines view when at least 50% of element is visible for at least 1 second',()=>{

            const strategy = new FrameWatcher.StrategyCheck(new FrameWatcher.BasicStrategy());
            
            expect(strategy.run([0.2,0.3,0.2,0.1,0.6])).to.be.true;
            expect(strategy.run([1])).to.be.true;
            expect(strategy.run([0.2,0.5,0.2,0.1,0.5])).to.be.true;
            expect(strategy.run([0.2,1,0.2,1,1])).to.be.true;
            expect(strategy.run([0.2,0.4,0.3,0.1,0.2])).to.be.false;
            expect(strategy.run([0])).to.be.false;
        
        });

    });

    describe('Full strategy', ()=>{

        it('defines view when at least 100% of element is visible for at least 1 second',()=>{

            const strategy = new FrameWatcher.StrategyCheck(new FrameWatcher.FullStrategy());
            
            expect(strategy.run([0.2,0.3,0.2,0.1,0.6])).to.be.false;
            expect(strategy.run([1])).to.be.true;
            expect(strategy.run([0.2,0.5,0.2,0.1,0.5])).to.be.false;
            expect(strategy.run([0.2,1,0.2,1,1])).to.be.true;
            expect(strategy.run([0.2,0.4,0.3,0.1,0.2])).to.be.false;
            expect(strategy.run([0])).to.be.false;
        
        });

    });

    describe('Long strategy', ()=>{

        it('defines view when at least 100% of element is visible for at least 5 seconds',()=>{

            const strategy = new FrameWatcher.StrategyCheck(new FrameWatcher.LongStrategy());
            
            expect(strategy.run([1,0.3,0.2,0.1,0.6])).to.be.false;
            expect(strategy.run([0.4,1,1,1,1,1,1,0])).to.be.true;
            expect(strategy.run([0.2,0.5,0.2,0.1,0.5])).to.be.false;
            expect(strategy.run([0.2,1,0.2,1,1])).to.be.false;
            expect(strategy.run([0.2,0.4,0.3,0.1,0.2])).to.be.false;
            expect(strategy.run([0])).to.be.false;
        
        });

    });

});