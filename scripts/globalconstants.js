window.page = document.URL;
const testMode = true;
const url = testMode
  ? 'https://panel.stage.k8s.flixdev.com'
  : 'https://panel.sexflix.com';

// Performer Moderation
window.performerModeration = page.includes(`${url}/performer/moderation/`);

// Video Moderation
window.moderationURL = page.includes(`${url}/video/multiple-moderation`);

// VR moderation
window.vrmoderationURL = page.includes(`${url}/vr/moderation/video`);

// Stop Words Moderation
window.stopwordsModerationURL = page.includes(
  `${url}/video/stop-words-moderation`
);

// Photo Moderation
window.photoModerationURL = page.includes(
  `${url}/performer/moderation/photo/moderation`
);

// Published Video Alert
window.publishedMultiple = page.includes(`${url}/video/multiple-moderation`);

// From Admin To SP Tickets
window.editingProducerURL = page.includes(`${url}/producer/manage`);
window.editingUserURL = page.includes(`${url}/user/manage`);

// Review Page
window.reviewPage = page.includes(`${url}/video/moderation/reviewer-stats`);

// SP Panel
window.supportPalPage = page.includes('https://support.faphouse.com/');

// Single Modeation
window.singleModeration = page.includes(`${url}/video/moderation`);
