<script lang="ts">
  import FileInputs from './components/FileInputs.svelte';
  import Canvas from './components/Canvas.svelte';

  let canvasSection: HTMLElement;
  let canvasComponent: any & { canvas: HTMLCanvasElement };
  let showLines = true;
  let triangleHeight = 200;

  let previewVisible = false;
  const created = '__TIMESTAMP__'; // replaced by rollup
  const version = '__VERSION__'; // replaced by rollup

  let loadedImages: Array<{ src: string; alt: string }> = [];
  let imageElements: HTMLImageElement[] = [];

  let canvasReady = false;

  async function onFilesChange({ detail: fileList }) {
    imageElements = []; // make canvas not ready while images are loading
    loadedImages.forEach((img) => URL.revokeObjectURL(img.src));
    loadedImages = fileList.map((file) => ({
      src: file == null ? null : URL.createObjectURL(file),
      alt: file?.name,
    }));
    imageElements = await Promise.all(
      loadedImages.map((img) => loadIntoImage(img.src))
    );
  }

  function loadIntoImage(source: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      if (source == null) {
        return Promise.resolve(null);
      }
      const image = new Image();
      image.addEventListener('load', () => resolve(image), { once: true });
      image.addEventListener('error', (err) => reject(err), { once: true });
      image.src = source;
    });
  }

  function onFinish() {
    canvasReady = true;
  }

  function togglePreview() {
    previewVisible = !previewVisible;
    if (previewVisible) {
      setTimeout(() => canvasSection.scrollIntoView());
    }
  }
  function downloadAsImage() {
    const link = document.createElement('a');
    link.download = 'flextangle-template.png';
    link.href = canvasComponent.canvas.toDataURL('image/png');
    link.target = '_blank'
    link.click();
  }
</script>

<svelte:head>
  <meta name="dc.created" content="{created}" />
  <meta name="version" content="{version}" />
</svelte:head>

<div class="content">
  <header class="container">
    <h1>Flextangler <small>beta</small></h1>
    <p>
      <strong>Flextangler</strong>
      is a web app that helps you create flextangles with your own images.
      <strong>None of your files are sent to a server! All processing is done in
        your browser.</strong>
      In fact, you can use this website completely offline.
    </p>
    <p>
      The app will then transform your images to fit the flextangle template.
      Please note that the cutting is based on the largest possible hexagon in
      the center of each image. To make sure you have the desired outcome, you
      can upload squared images that are at least 250&times;250px in size.
    </p>
    <p>
      Simply select four images with the boxes below. If you
      select more than one file, they are put into the subsequent boxes.
    </p>
  </header>

  <main class="container">
    <section>
      <FileInputs images="{loadedImages}" on:filesChange="{onFilesChange}" />
    </section>

<section>
      <p>
        {#if canvasReady}
          <strong>Your template is ready!</strong>
          {:else}
          Please select 4 images before continuing.
          {/if}<br/>
        Download the image or verify the outcome in the preview beforehand.
      </p>
    </section>
    <section id="actions">
      <button class="btn box-shadow" disabled="{!canvasReady}" on:click={downloadAsImage}>Download template</button>
      <button class="btn box-shadow" disabled="{!canvasReady}" on:click={togglePreview}>{previewVisible ? 'Hide' : 'Show'} preview</button>
    </section>
    <section hidden="{!previewVisible}" bind:this={canvasSection}>
      <Canvas
        bind:this={canvasComponent}
        drawables="{imageElements}"
        triangleHeight="{triangleHeight}"
        showLines="{showLines}"
        on:finish={onFinish}/>
    </section>
    <section>
      <p>Print the template and follow the
      <a href="https://i.imgur.com/9Fmn6Da.mp4" rel="noopener">cutting and folding instructions</a>.<br/>
        Lastly make sure you share this website with your family and friends, if you like it.</p>
    </section>
  </main>
  <footer class="container">
    Created by
    <a href="https://github.com/JanMalch" rel="noopener">JanMalch 👨🏻‍💻</a>
    and Lorenz 🧠 &bullet;
    <a href="https://github.com/JanMalch/flextangler" rel="noopener">Source Code</a>
    &bullet;
    <a
      href="https://github.com/JanMalch/flextangler/blob/master/CHANGELOG.md"
      rel="noopener">v{version}</a>
    &bullet; &copy; JanMalch,
    {new Date().getFullYear()}
  </footer>
</div>

<style>
  .content {
    display: grid;
    grid-template-columns: auto;
    grid-template-rows: auto 1fr auto;
    height: 100%;
  }

  h1 {
    display: flex;
    align-items: baseline;
    justify-content: center;
  }

  h1 > small {
    font-size: 10px;
    text-transform: uppercase;
    opacity: 0.6;
  }

  header,
  footer,
  p {
    text-align: center;
  }

  p {
    width: 84ch;
    margin-left: auto;
    margin-right: auto;
    font-size: 18px;
    line-height: 1.65;
  }

  header > p:last-child {
    margin-bottom: 0;
  }

  p > a {
    font-weight: 500;
  }

  main > section {
    margin: 64px 0;
  }

  details {
      text-align: center; /* center canvas */
  }

  details > summary {
      list-style-type: none;
      outline: none;
  }

  details > summary strong {
      cursor: pointer;
  }

  details > summary strong:hover {
      text-decoration: underline;
  }

  details summary::-webkit-details-marker {
      display:none;
  }

  #actions {
      text-align: center;
  }

  .btn {
      text-decoration: none;
      text-transform: uppercase;
      font-size: 18px;
      border-radius: 4px;
      padding: 16px 32px;
      margin-right: 16px;
      border: none;
      outline: none;
      font-weight: 500;
      letter-spacing: 0.5px;
      background-color: rgb(0,100,200);
      color: #ffffff;
      cursor: pointer;
      transition: background-color 0.22s;
  }

  .btn:hover {
      background-color: hsl(210, 100%, 30%);
  }

  .btn + .btn {
      color: rgb(0,100,200);
      background-color: #ffffff;
  }

  .btn + .btn:hover {
      background-color: #f3f3f3;
  }

  .btn:disabled:hover,
  .btn:disabled {
      background-color: #cccccc;
      color: #aaaaaa;
      cursor: not-allowed;
  }

  footer {
    padding: 32px 0;
    opacity: 0.9;
    font-size: 0.9em;
  }
</style>
