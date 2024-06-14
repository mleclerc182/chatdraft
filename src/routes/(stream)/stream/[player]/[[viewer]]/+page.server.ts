import type { PageServerLoad } from './$types';
import { GetPreviewStatus } from '$lib/server/previewHandler';
import { GetDraft, GetPreviewDraft } from '$lib/server/draftHandler';

export const ssr = false;

export const load = (async ({ params, locals, url }) => {
	let hide = url.searchParams.get('hide');
	if (hide != 'choice' && hide != 'deck') {
		hide = '';
	}

	const player: string = params.player;
	const draft = await GetDraft(player);
	const previewStatus = GetPreviewStatus(player);
	const previewDraft = await GetPreviewDraft();

	return {
		draft: draft?.toIDraft(),
		choice: draft?.currentChoice,
		player: player,
		hide: hide,
		previewStatus: previewStatus,
		previewDraft: previewDraft,
		bgOpacity: locals.user?.userPreferences?.bgOpacity,
		displayDeck: previewStatus
			? previewDraft.cards
			: params.viewer == 'viewer'
			? draft?.viewerDeck
			: draft?.cards,
		displayName: previewStatus
			? params.viewer == 'viewer'
				? '[Viewer]'
				: player
			: params.viewer == 'viewer'
			? draft?.viewerName
			: player
	};
}) satisfies PageServerLoad;
