var expect = chai.expect;
var should = chai.should();

describe('FrameElement',()=>{
    
    const TestElement = document.createElement('div');
    const TestWidth = 300;
    const TestHeight = 100;

    TestElement.style.width = TestWidth +'px';
    TestElement.style.height = TestHeight + 'px';

    document.getElementById('test-box').appendChild(TestElement);

    it('should store passed metadata about element',()=>{

        let id = 'id-test';
        let code = 'code-test';

        let fe = new FrameElement(id,code,TestElement);

        expect(fe.id).to.equal(id);
        expect(fe.code).to.equal(code);
      

    });

    it('should store passed html element',()=>{

        let fe = new FrameElement('','',TestElement);
        expect(fe.element).to.be.object;

    });

    it('should store proper rects data',()=>{

        let fe = new FrameElement('','',TestElement);
        fe.getRects();

        expect(fe.rects.width).to.equal(TestWidth);
        expect(fe.rects.height).to.equal(TestHeight);
        expect(fe.rects.top).to.equal(0);
        expect(fe.rects.left).to.equal(0);
        expect(fe.rects.right).to.equal(TestWidth);
        expect(fe.rects.bottom).to.equal(TestHeight);

    });

});
