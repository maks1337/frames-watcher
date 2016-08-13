describe('Element',()=>{

    const TestElement = document.createElement('div');
    const TestHook = document.createElement('div');

    const TestWidth = 500;
    const TestHeight = 300;

    TestElement.setAttribute('id',testPlacementId);
    TestHook.setAttribute('id',testHookId);

    TestElement.style.width = TestWidth +'px';
    TestElement.style.height = TestHeight + 'px';
    TestElement.style.background = 'red';

    document.getElementById('test-box').appendChild(TestElement);
    
    TestElement.appendChild(TestHook);

    it('should store passed metadata about element',()=>{

        let fe = new FrameWatcher.Element(testHookId,testCodeId);

        expect(fe.id).to.equal(testPlacementId);
        expect(fe.code).to.equal(testCodeId);
      
    });

    it('should be able to find hook\'s parent and store frame element',()=>{

        let fe = new FrameWatcher.Element(testHookId,testCodeId);
        expect(fe.element).to.be.object;
        expect(fe.element).to.have.property('id');
        expect(fe.element.id).to.be.equal(testPlacementId);

    });

    it('should store proper rects data',()=>{

        let fe = new FrameWatcher.Element(testHookId,testCodeId);
        fe.getRects();

        expect(() => fe.getRects.bind(fe)).to.not.throw(Error);

        expect(fe.rects.width).to.equal(TestWidth);
        expect(fe.rects.height).to.equal(TestHeight);
        expect(fe.rects.top).to.equal(0);
        expect(fe.rects.left).to.equal(0);
        expect(fe.rects.right).to.equal(TestWidth);
        expect(fe.rects.bottom).to.equal(TestHeight);

    });

});