import { breakpoints } from '@guardian/source/foundations';
import type { Meta, StoryObj } from '@storybook/react';
import { discussionApiUrl } from '../../fixtures/manual/discussionApiUrl';
import {
	audioTrails,
	galleryTrails,
	videoTrails,
} from '../../fixtures/manual/trails';
import { ArticleDesign, ArticleDisplay, Pillar } from '../lib/articleFormat';
import type { DCRContainerPalette, DCRFrontCard } from '../types/front';
import { FrontSection } from './FrontSection';
import { ScrollableFeature } from './ScrollableFeature.importable';

const imageUrls = [
	'https://media.guim.co.uk/2d214bdf3ed8e014360e8fde41b471973e4bad44/948_2222_2703_3378/800.jpg',
	'https://media.guim.co.uk/ebdbdcf43ae69f4e8e85cd94f8cb67faeaef5d4a/1087_735_988_1235/800.jpg',
	'https://media.guim.co.uk/9bd0b0432950315837ba204e5d5b2250b3e75744/204_838_4422_5524/801.jpg',
	'https://media.guim.co.uk/f30ec00394386361d3b4b278984f27b32dab4d42/328_2337_5032_6290/800.jpg',
	'https://media.guim.co.uk/1a99dd52b89bc67ee384b337d8793f1303080010/154_958_2405_3006/800.jpg',
	'https://media.guim.co.uk/49e438dd362c146523d6006b4054e8b5a9ffb44b/2077_322_3325_4157/800.jpg',
];

const frontCard = {
	url: '',
	format: {
		display: ArticleDisplay.Standard,
		design: ArticleDesign.Standard,
		theme: Pillar.News,
	},
	headline: 'HeadlineText',
	kickerText: 'Kicker',
	webPublicationDate: new Date(Date.now() - 60 * 60 * 1000).toString(),
	image: {
		src: 'https://media.guim.co.uk/6537e163c9164d25ec6102641f6a04fa5ba76560/0_210_5472_3283/master/5472.jpg',
		altText: 'alt text',
	},
	showQuotedHeadline: false,
	showLivePlayable: false,
	isExternalLink: false,
	discussionApiUrl: 'https://discussion.theguardian.com/discussion-api/',
	byline: 'Byline text',
	showByline: true,
	dataLinkName: 'data-link-name',
	isImmersive: false,
} satisfies DCRFrontCard;

const trails = new Array(6)
	.fill(frontCard)
	.map((trail: DCRFrontCard, index: number) => ({
		...trail,
		image: {
			src: imageUrls[index] as string,
			altText: '',
		},
		format: {
			...frontCard.format,
			theme: index, // Uses index to cycle through each theme enum value
		},
		isNewsletter: index === 2, // Check that we see the Newsletter pill on a card.
	}));

const meta = {
	component: ScrollableFeature,
	title: 'Components/ScrollableFeature',
	parameters: {
		chromatic: {
			viewports: [
				breakpoints.mobile,
				breakpoints.tablet,
				breakpoints.wide,
			],
		},
	},
	args: {
		trails,
		containerPalette: undefined,
		absoluteServerTimes: true,
		imageLoading: 'eager',
		aspectRatio: '4:5',
		collectionId: 1,
	},
	render: (args) => (
		<FrontSection
			title="Scrollable feature"
			discussionApiUrl={discussionApiUrl}
			editionId="UK"
			containerLevel="Secondary"
		>
			<ScrollableFeature {...args} />
		</FrontSection>
	),
} satisfies Meta<typeof ScrollableFeature>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {};

export const Media = {
	args: {
		trails: [galleryTrails[0], galleryTrails[1], audioTrails[0]],
	},
} satisfies Story;

export const MoreMedia = {
	args: {
		trails: [audioTrails[1], videoTrails[0], videoTrails[1]],
	},
} satisfies Story;

export const WithPrimaryContainer = {
	render: (args) => (
		<FrontSection
			title="Scrollable feature"
			discussionApiUrl={discussionApiUrl}
			editionId="UK"
			containerLevel="Primary"
		>
			<ScrollableFeature {...args} />
		</FrontSection>
	),
} satisfies Story;

const containerPalettes = [
	'InvestigationPalette',
	'LongRunningPalette',
	'SombrePalette',
	'BreakingPalette',
	'EventPalette',
	'EventAltPalette',
	'LongRunningAltPalette',
	'SombreAltPalette',
	'SpecialReportAltPalette',
	'Branded',
] as const satisfies readonly Omit<
	DCRContainerPalette,
	'MediaPalette' | 'PodcastPalette'
>[];

export const WithSpecialPaletteVariations = {
	parameters: {
		/** We only want one breakpoint snapshotted for special palette variations */
		chromatic: { viewports: [breakpoints.desktop] },
	},
	render: (args) => (
		<>
			{containerPalettes.map((containerPalette) => (
				<FrontSection
					title={containerPalette}
					discussionApiUrl={discussionApiUrl}
					editionId="UK"
					key={containerPalette}
					containerPalette={containerPalette}
					containerLevel="Secondary"
				>
					<ScrollableFeature
						{...args}
						containerPalette={containerPalette}
					/>
				</FrontSection>
			))}
		</>
	),
} satisfies Story;
