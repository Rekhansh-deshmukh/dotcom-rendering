import { css } from '@emotion/react';
import { from } from '@guardian/source/foundations';
import type { Meta, StoryObj } from '@storybook/react';
import { ArticleDesign, ArticleDisplay, Pillar } from '../../lib/articleFormat';
import type { MainMedia } from '../../types/mainMedia';
import { HighlightsCard } from './HighlightsCard';

const mainGallery: MainMedia = {
	type: 'Gallery',
	count: '10',
};

const meta = {
	component: HighlightsCard,
	title: 'Components/Masthead/HighlightsCard',
	render: (args) => (
		<CardWrapper>
			<HighlightsCard {...args} />
		</CardWrapper>
	),
	args: {
		linkTo: '',
		headlineText: 'Underground cave found on moon could be ideal base',
		format: {
			display: ArticleDisplay.Standard,
			design: ArticleDesign.Standard,
			theme: Pillar.Sport,
		},
		kickerText: 'News',
		byline: 'Georges Monbiot',
		mainMedia: mainGallery,
		image: {
			src: 'https://media.guim.co.uk/6537e163c9164d25ec6102641f6a04fa5ba76560/0_210_5472_3283/master/5472.jpg',
			altText: 'alt text',
		},
		imageLoading: 'eager',
	},
} satisfies Meta<typeof HighlightsCard>;

export default meta;

type Story = StoryObj<typeof HighlightsCard>;

const CardWrapper = ({ children }: { children: React.ReactNode }) => {
	return (
		<div
			css={css`
				width: 150px;
				flex-basis: 100%;
				${from.tablet} {
					width: 300px;
					flex-basis: 1;
				}
				margin: 10px;
				position: relative;
			`}
		>
			{children}
		</div>
	);
};

export const Default = {};

export const WithAvatar: Story = {
	args: {
		avatarUrl:
			'https://uploads.guim.co.uk/2017/10/06/George-Monbiot,-L.png',
	},
	name: 'With Avatar',
};

export const WithMediaIcon: Story = {
	args: {
		format: {
			design: ArticleDesign.Audio,
			display: ArticleDisplay.Standard,
			theme: Pillar.Culture,
		},
	},
	parameters: {},
	name: 'With Media Icon',
};

export const WithLiveKicker: Story = {
	args: {
		format: {
			display: ArticleDisplay.Standard,
			design: ArticleDesign.LiveBlog,
			theme: Pillar.News,
		},
	},
	parameters: {},
	name: 'With Live Kicker',
};

export const WithStarRating: Story = {
	args: {
		format: {
			display: ArticleDisplay.Standard,
			design: ArticleDesign.Standard,
			theme: Pillar.Culture,
		},
		starRating: 4,
	},
	parameters: {},
	name: 'With Star Rating',
};

export const WithPodcastSeriesImage: Story = {
	args: {
		format: {
			display: ArticleDisplay.Standard,
			design: ArticleDesign.Audio,
			theme: Pillar.Sport,
		},
		mainMedia: {
			type: 'Audio',
			duration: '31:16',
			podcastImage: {
				src: 'https://uploads.guim.co.uk/2024/08/01/FootballWeekly_FINAL_3000_(1).jpg',
				altText: 'Football Weekly',
			},
		},
	},

	parameters: {},
	name: 'With Podcast Series Image',
};
