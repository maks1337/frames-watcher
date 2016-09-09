const cookie = 'cookie-1';
const view = 'view-1';
const url = 'http://localhost';

function generateTestElements(width = 0, height = 0 , top = 0, left = 0, id = 'xxx'){

    const TestElement = document.createElement('div');
    const TestHook = document.createElement('div');

    TestElement.setAttribute('id',`e_${id}`);
    TestHook.setAttribute('id',`hook-${id}`);
    TestHook.classList.add("hook");

    TestElement.style.width = `${width}px`;
    TestElement.style.height = `${height}px`;
    TestElement.style.top = `${top}px`;
    TestElement.style.left = `${left}px`;
    TestElement.style.background = 'red';
    TestElement.style.position = 'absolute';

    document.getElementById('test-box').appendChild(TestElement);

    TestElement.appendChild(TestHook);
    TestElement.innerHTML += `e-${id}`;
 
}

for (var i = 0; i < 3; i++) {
    const width = 200;
    const height = 200;
    generateTestElements(
        width, 
        height,
        ((i*height)+10),
        ((i*width)+10),
        i
    );
}

if (typeof FrameWatcherRunner === 'undefined') {
    var FrameWatcherRunner = new FrameWatcher.Runner('console', 'http://localhost', cookie, view);
}

document.querySelectorAll(".hook").forEach((a,b,c) => {
    FrameWatcherRunner.registerElement(a.id,'implementation-test');
});