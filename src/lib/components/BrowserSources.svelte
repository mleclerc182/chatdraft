<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import { Tab, TabGroup } from '@skeletonlabs/skeleton';
	import BrowserSourceComponent from './BrowserSourceComponent.svelte';
	import ChatDraftSlideToggle from './ChatDraftSlideToggle.svelte';

	export let user: string | undefined;
	export let previewMode: boolean = false;
	export let full_source_configured: boolean = false;
	export let deck_sources_configured: boolean = false;
	export let choices_sources_configured: boolean = false;
	let togglePreviewSaveBtn: HTMLButtonElement;

	let tabSet: number = 0;
</script>

<p class="mt-4">
	The chat draft overlay is provided via browser source. The overlay has been designed pseudo
	responsive and will appear differently at different resolutions. Additionally, the overlay can be
	presented as combined (simple) or separate (advanced).
</p>

<TabGroup>
	<Tab bind:group={tabSet} name="combinedTab" value={0}>
		<span>Combined</span>
	</Tab>
	<Tab bind:group={tabSet} name="choiceTab" value={1}>
		<span>Choices</span>
	</Tab>
	<Tab bind:group={tabSet} name="deckTab" value={2}>
		<span>Deck</span>
	</Tab>
	<Tab bind:group={tabSet} name="viewerTab" value={3}>
		<span>Viewer Deck</span>
	</Tab>
	<svelte:fragment slot="panel">
		<div class="card p-2">
			{#if tabSet === 0}
				<BrowserSourceComponent
					url={`${$page.url.origin}/stream/${user}`}
					layerName="Oro%20Chat%20Draft"
					height={854}
					width={500}
				/>
			{:else if tabSet === 1}
				<BrowserSourceComponent
					url={`${$page.url.origin}/stream/${user}?hide=deck`}
					layerName="Oro%20Chat%20Draft%20Choices"
					height={439}
					width={500}
				/>
			{:else if tabSet === 2}
				<BrowserSourceComponent
					url={`${$page.url.origin}/stream/${user}?hide=choice`}
					layerName="Oro%20Chat%20Draft%20Deck"
					height={475}
					width={500}
				/>
			{:else if tabSet === 3}
				<BrowserSourceComponent
					url={`${$page.url.origin}/stream/${user}/viewer?hide=choice`}
					layerName="Oro%20Chat%20Draft%20Viewer%20Deck"
					height={475}
					width={500}
				/>
			{/if}
		</div>
	</svelte:fragment>
</TabGroup>
<div class="grid grid-cols-3 mb-4 mt-2">
	<p class="text-center">
		{#if full_source_configured}
			<iconify-icon icon="foundation:check" width="24" height="24" style="color: green" inline />
			Combined connected!
		{:else}
			<iconify-icon
				icon="material-symbols:circle"
				width="24"
				height="24"
				style="color: red"
				inline
			/>
			Combined not connected
		{/if}
	</p>
	<p class="text-center">
		{#if choices_sources_configured}
			<iconify-icon icon="foundation:check" width="24" height="24" style="color: green" inline />
			Choices connected!
		{:else}
			<iconify-icon
				icon="material-symbols:circle"
				width="24"
				height="24"
				style="color: red"
				inline
			/>
			Choices not connected
		{/if}
	</p>
	<p class="text-center">
		{#if deck_sources_configured}
			<iconify-icon icon="foundation:check" width="24" height="24" style="color: green" inline />
			Deck connected!
		{:else}
			<iconify-icon
				icon="material-symbols:circle"
				width="24"
				height="24"
				style="color: red"
				inline
			/>
			Deck not connected
		{/if}
	</p>
</div>
<div class="m-4">
	<h3 class="h3">Preview Mode</h3>
	<p class="mt-2">
		When a draft is not active, the browser sources will be completely transparent. Preview mode
		fills the browser sources with an example draft. Once a real draft is started, preview mode will
		be automatically disabled.
	</p>
	<form method="post" use:enhance action="?/togglePreview" class="mt-2">
		<ChatDraftSlideToggle
			label="Preview Mode"
			name="previewmode"
			bind:checked={previewMode}
			on:change={() => togglePreviewSaveBtn.click()}
			active="bg-primary-500"
		/>
		<button bind:this={togglePreviewSaveBtn} class="hidden collapse"> Submit </button>
	</form>
</div>
