<script lang="ts">
  import FileInputs from './components/FileInputs.svelte';
  import Canvas from './components/Canvas.svelte';

  let canvasSection: HTMLElement;
  let canvasComponent: any & { canvas: HTMLCanvasElement };
  let triangleHeight = 200;

  let previewVisible = false;

  let loadedImages: Array<{ src: string | null; alt: string | null }> = [];
  let imageElements: HTMLImageElement[] = [];

  let canvasReady = false;

  let drawCuttingLines = false;
  let drawFoldingLines = false;

  async function onFilesChange({ detail: fileList }: { detail: File[] }) {
    imageElements = []; // make canvas not ready while images are loading
    loadedImages.forEach((img) => {
      if (img?.src != null) {
        URL.revokeObjectURL(img.src);
      }
    });
    loadedImages = fileList.map((file) => ({
      src: file == null ? null : URL.createObjectURL(file),
      alt: file?.name ?? null,
    }));
    imageElements = await Promise.all(
      loadedImages.map((img) => loadIntoImage(img?.src ?? null))
    );
  }

  function loadIntoImage(source: string | null): Promise<HTMLImageElement> {
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
    link.target = '_blank';
    link.click();
  }
</script>

<p>
  The app will then transform your images to fit the flextangle template. Please
  note that the cutting is based on the largest possible hexagon in the center
  of each image. To make sure you have the desired outcome, you can upload
  squared images that are at least
  {triangleHeight}&times;{triangleHeight}px in size.
</p>
<p>
  Simply select four images with the boxes below. If you select more than one
  file, they are put into the subsequent boxes.
</p>

<section>
  <FileInputs images="{loadedImages}" on:filesChange="{onFilesChange}" />
</section>

<section>
  <label>
    <input type="checkbox" bind:checked="{drawCuttingLines}" />
    Draw cutting lines
  </label>
  <label>
    <input type="checkbox" bind:checked="{drawFoldingLines}" />
    Draw folding lines
  </label>
</section>

<section>
  <p>
    {#if canvasReady}
      <strong>Your template is ready!</strong>
    {:else}Please select 4 images before continuing.{/if}<br />
    Download the image or verify the outcome in the preview beforehand.
  </p>
</section>
<section>
  <button
    class="btn box-shadow"
    disabled="{!canvasReady}"
    on:click="{downloadAsImage}">Download template</button>
  <button
    class="btn box-shadow"
    disabled="{!canvasReady}"
    on:click="{togglePreview}">{previewVisible ? 'Hide' : 'Show'}
    preview</button>
</section>
<section hidden="{!previewVisible}" bind:this="{canvasSection}">
  <Canvas
    bind:this="{canvasComponent}"
    drawables="{imageElements}"
    drawCuttingLines="{drawCuttingLines}"
    drawFoldingLines="{drawFoldingLines}"
    triangleHeight="{triangleHeight}"
    on:finish="{onFinish}" />
</section>
<section>
  <p>
    Print the template and follow the
    <a href="https://i.imgur.com/9Fmn6Da.mp4" rel="noopener">cutting and folding
      instructions</a>.<br />
    Lastly make sure you share this website with your family and friends, if you
    like it.
  </p>
</section>

<style>
  section {
    margin: 64px 0;
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
    background-color: rgb(0, 100, 200);
    color: #ffffff;
    cursor: pointer;
    transition: background-color 0.22s;
  }

  .btn:hover {
    background-color: hsl(210, 100%, 30%);
  }

  .btn + .btn {
    color: rgb(0, 100, 200);
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

  @media (max-width: 599px) {
    section {
      margin: 32px 0;
    }

    .btn {
      display: block;
      width: 80%;
      margin: 16px auto;
    }
  }
</style>
