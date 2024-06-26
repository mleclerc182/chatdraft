<script lang="ts">
	import { enhance } from '$app/forms';
	import { Accordion, AccordionItem, clipboard, popup } from '@skeletonlabs/skeleton';
	import type { PageData } from './$types';
	import { page } from '$app/stores';
	import { title } from '$lib/title';
	import { OtdStatus } from '$lib/snap/draft';

	export let data: PageData;
	export let form;

	title.set('Oro Chat Draft - Organizer');
</script>

<svelte:head>
	<meta
		name="description"
		content="Oro Chat Draft is a fun app for letting Twitch Chat draft a Marvel Snap Deck for a streamer to play."
	/>
	<meta
		name="robots"
		content="follow, index, max-snippet:-1, max-video-preview:-1, max-image-preview:large"
	/>
</svelte:head>

<section class="p-4">
	<section class="space-y-4">
		<h1 class="h1">Organizer</h1>
		<p>Read only view for organization details.</p>
		<h2 class="h2">One Time Drafts</h2>
		<form method="POST" action="?/viewOtdBatch" use:enhance>
			<label for="otdraftBatchTag" class="label font-bold">Batch Tag</label>
			<select class="select w-64 invalid:text-gray-500" name="otdraftBatchTag" required>
				<option disabled selected value="">Select OTD Batch</option>
				{#each data.otdBatches || [] as otdBatch}
					<option value={otdBatch.tag} selected={form?.otdBatch?.tag == otdBatch.tag}>
						{otdBatch.tag}
					</option>
				{/each}
			</select>
			<button class="btn variant-filled-primary">View</button>
			{#if form?.otdBatchTagMissing}
				<p class="text-error-500 font-bold">No OTD batch tag selected.</p>
			{/if}
		</form>
	</section>
	{#if form?.otdBatch}
		<hr class="m-4" />
		<h3 class="h3">Batch Details</h3>
		<p><b>Tag:</b> {form.otdBatch.tag}</p>
		<p><b>Expiration:</b> {form.otdBatch.expiration.toLocaleDateString()}</p>
		<p><b>Count:</b> {form.otdBatch.drafts.length}</p>
		<p><b>Timer:</b> {form.otdBatch.draftExpiration} minutes</p>
		<p>
			<b>Organizers:</b>
			{form.otdBatch.organizers.map((organizer) => organizer.channelName).join(', ')}
		</p>
		<Accordion regionControl="flex-row-reverse gap-4 text-primary-500 font-bold">
			<AccordionItem>
				<svelte:fragment slot="summary">Card Pool</svelte:fragment>
				<svelte:fragment slot="content">
					<p class="text-wrap">{form.otdBatch.cardPool.replaceAll(',', ', ')}</p>
				</svelte:fragment>
			</AccordionItem>
		</Accordion>
		<h3 class="h3">Drafts Dashboard</h3>
		<div class="table-container">
			<table class="table table-hover table-compact text-center border-collapse w-min">
				<thead>
					<tr>
						<th class="table-cell-fit">Status</th>
						<th class="table-cell-fit text-center">User</th>
						<th class="text-center table-cell-fit">Started</th>
						<th class="text-center table-cell-fit">Finished</th>
						<th class="text-left table-cell">OTD Link</th>
						<th class="text-left table-cell">Copy</th>
					</tr>
				</thead>
				<tbody>
					{#each form.otdBatch.drafts as draft, index}
						<tr class="align-middle">
							<td class="table-cell-fit !align-middle">
								{#if form.otdStatuses}
									{#if form.otdStatuses[index] == OtdStatus.Unused}
										<iconify-icon
											icon="mdi:play"
											width="24"
											height="24"
											style="color: transparent"
											use:popup={{
												event: 'hover',
												target: form.otdStatuses[index],
												placement: 'top'
											}}
											class="align-middle"
										/>
										<div
											class="card p-4 variant-filled-secondary duration-0"
											data-popup={form.otdStatuses[index]}
										>
											<b>Unused</b>
											<div class="arrow variant-filled-secondary" />
										</div>
									{:else if form.otdStatuses[index] == OtdStatus.Started}
										<iconify-icon
											icon="mdi:play"
											width="24"
											height="24"
											style="color: yellow"
											use:popup={{
												event: 'hover',
												target: form.otdStatuses[index],
												placement: 'top'
											}}
											class="align-middle"
										/>
										<div
											class="card p-4 variant-filled-secondary duration-0"
											data-popup={form.otdStatuses[index]}
										>
											<b>Started</b>
											<div class="arrow variant-filled-secondary" />
										</div>
									{:else if form.otdStatuses[index] == OtdStatus.Finished}
										<iconify-icon
											icon="foundation:check"
											width="24"
											height="24"
											style="color: green"
											inline
											use:popup={{
												event: 'hover',
												target: form.otdStatuses[index],
												placement: 'top'
											}}
											class="align-middle"
										/>
										<div
											class="card p-4 variant-filled-secondary duration-0"
											data-popup={form.otdStatuses[index]}
										>
											<b>Finished</b>
											<div class="arrow variant-filled-secondary" />
										</div>
									{:else if form.otdStatuses[index] == OtdStatus.LinkExpired}
										<iconify-icon
											icon="foundation:x"
											width="24"
											height="24"
											style="color: red"
											inline
											use:popup={{
												event: 'hover',
												target: form.otdStatuses[index],
												placement: 'top'
											}}
											class="align-middle"
										/>
										<div
											class="card p-4 variant-filled-secondary duration-0"
											data-popup={form.otdStatuses[index]}
										>
											<b>Link Expired</b>
											<div class="arrow variant-filled-secondary" />
										</div>
									{:else if form.otdStatuses[index] == OtdStatus.DraftExpired}
										<iconify-icon
											icon="foundation:x-circle"
											width="24"
											height="24"
											style="color: red"
											use:popup={{
												event: 'hover',
												target: form.otdStatuses[index],
												placement: 'top'
											}}
											class="align-middle"
										/>
										<div
											class="card p-4 variant-filled-secondary duration-0"
											data-popup={form.otdStatuses[index]}
										>
											<b>Draft Expired</b>
											<div class="arrow variant-filled-secondary" />
										</div>
									{/if}
								{/if}
							</td>
							<td class="table-cell-fit !whitespace-nowrap !align-middle">
								{#if draft.user}
									{draft.user}
								{/if}
							</td>
							<td class="table-cell-fit !whitespace-normal lg:!whitespace-nowrap !align-middle">
								{draft.startedAt?.toLocaleString() || ''}
							</td>
							<td class="table-cell-fit !whitespace-normal lg:!whitespace-nowrap !align-middle">
								{draft.finishedAt?.toLocaleString() || ''}
							</td>
							<td class="table-cell whitespace-nowrap !align-middle text-left">
								<a class="anchor" href="{$page.url.origin}/otdraft?code={draft.id}" target="_blank">
									{draft.id}
								</a>
							</td>
							<td class="!align-middle">
								<button
									on:click|preventDefault
									class="btn p-0"
									use:clipboard={`${$page.url.origin}/otdraft?code=${draft.id}`}
								>
									<iconify-icon
										icon="clarity:copy-to-clipboard-line"
										width="24"
										height="24"
										style="color: rgba(var(--color-primary-500) / 1)"
										flip="horizontal"
									/>
								</button>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
</section>
