<script lang="ts">
	import { clipboard } from '@skeletonlabs/skeleton';

	const gameStateFile =
		'c:\\Users\\%USERNAME%\\AppData\\LocalLow\\Second Dinner\\SNAP\\Standalone\\States\\nvprod\\CollectionState.json';
	export let collectionComplete: boolean;
	let collectionFile: HTMLInputElement;

	function Submit(e: Event) {
		if (!collectionFile.files || collectionFile.files.length < 1) {
			e.preventDefault();
		}
	}
</script>

Click this button to copy the default path on Windows for Marvel Snap's Collection state file:
<button
	class="btn btn-icon variant-filled-primary"
	on:click|preventDefault
	use:clipboard={gameStateFile}
>
	<iconify-icon icon="clarity:copy-to-clipboard-line" width="24" height="24" flip="horizontal" />
</button>
<br />
<input
	bind:this={collectionFile}
	name="collection"
	class="mt-2 input w-1/4"
	type="file"
	accept=".json"
/>
<br />
<button class="btn btn-md variant-filled-primary mt-2" on:click={Submit}>Upload Collection</button>
{#if !collectionComplete}
	<button class="btn btn-md variant-outline-warning" formaction="?/resetCollection"
		>Reset to Collection Complete</button
	>
{/if}
