const wasm = import('./wasm_tracer');
const renderFractal = (fractalFactory, iterations) => {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    // ctx.clearRect(0, 0, canvas.width, canvas.height);
    const message = document.getElementById('progress-message');
    message.innerHTML = 'Computing fractal...';
    setTimeout(() => {
        const t0 = performance.now();
        const renderedData = fractalFactory(iterations);
        const height = renderedData.height();
        const width = renderedData.width();
        const pixels = renderedData.pixels();
        const imageData = new ImageData(new Uint8ClampedArray(pixels.buffer), width, height);
        ctx.putImageData(imageData, 0, 0);
        const t1 = performance.now();
        const delta = t1 - t0;
        renderedData.free();
        message.innerHTML = `Fractal generation took ${delta} milliseconds.`;
    }, 100);
};
wasm.then(({ FractalFactory }) => {
    const iterLabel = document.getElementById('iter-label');
    const slider = document.getElementById('iterations-slider');
    const applyButton = document.getElementById('apply-iterations');
    slider.value = '10';
    slider.addEventListener('change', event => {
        iterLabel.innerHTML = event.target.value;
    });
    applyButton.addEventListener('click', () => {
        const iterations = parseInt(slider.value, 10);
        renderFractal(FractalFactory.new, iterations);
    });
});
