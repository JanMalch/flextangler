<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let images: { src: string | null; alt: string | null }[] = [];

  const dispatch = createEventDispatcher();

  let files: Array<File | null> = Array(4).fill(null);

  function onInputChange(event: Event, index: number) {
    const selectedFiles = Array.from((event.target as HTMLInputElement).files!);
    files = Array(4)
      .fill(null)
      .map((_, i) => {
        if (i < index || i >= index + selectedFiles.length) {
          return files[i];
        }
        return selectedFiles[i - index];
      });
    dispatch('filesChange', files);
  }
</script>

<form>
  {#each { length: 4 } as _, i}
    <div class="box-shadow">
      {#if images[i]?.src != null}
        <img src="{images[i].src ?? undefined}" alt="{images[i].alt}}" />
      {/if}
      <label for="file-{i}">
        {images[i]?.src == null ? `Select one ${i !== 3 ? 'or more' : ''} image${i === 3 ? '' : 's'}.` : 'Swap image.'}
      </label>
      <input
        id="file-{i}"
        type="file"
        accept="image/*"
        multiple="{i !== 3}"
        on:change="{(ev) => onInputChange(ev, i)}" />
    </div>
  {/each}
</form>

<style>
  form {
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    flex-wrap: wrap;
  }

  div {
    border-radius: 4px;
    background-color: #ffffff;
    position: relative;
    overflow: hidden;
    height: 8em;
    width: 8em;
  }

  label {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(255, 255, 255, 0.8);
    transition: opacity 0.3s, background-color 0.3s;
    padding: 16px;
    font-size: 1.25em;
    text-align: center;
    display: grid;
    place-items: center;
    cursor: pointer;
  }

  label:hover {
    background-color: rgba(240, 240, 240, 0.8);
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  img + label {
    opacity: 0;
  }

  img + label:hover {
    background-color: rgba(255, 255, 255, 0.8);
  }

  div:hover > img + label {
    opacity: 1;
  }

  input {
    width: 0.1px;
    height: 0.1px;
    opacity: 0;
    overflow: hidden;
    position: absolute;
    z-index: -1;
    top: -9999px;
    left: -9999px;
  }

  @media (max-width: 599px) {
    div {
      margin: 1em;
    }
  }
</style>
