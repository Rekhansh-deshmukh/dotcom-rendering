import { css } from '@emotion/react';
import {
	article17,
	between,
	from,
	headlineBold17,
	headlineBold24,
	headlineBold28,
	space,
	textEgyptian17,
	textSansBold17,
	textSansBold20,
	until,
} from '@guardian/source/foundations';
import { type EditionId, getEditionFromId } from '../lib/edition';
import { palette as schemePalette } from '../palette';
import type { DCRContainerLevel } from '../types/front';
import { localisedTitle } from './Localisation';

type Props = {
	title?: string;
	description?: string;
	fontColour?: string;
	url?: string;
	showDateHeader?: boolean;
	editionId?: EditionId;
	lightweightHeader?: boolean;
	containerLevel?: DCRContainerLevel;
};

const linkStyles = css`
	text-decoration: none;
`;

const headerStyles = css`
	${headlineBold24};
	padding-bottom: ${space[1]}px;
	padding-top: 6px;
	overflow-wrap: break-word; /*if a single word is too long, this will break the word up rather than have the display be affected*/
`;

const primaryTitleStyles = css`
	${headlineBold28};
`;
const secondaryTitleStyles = css`
	${textSansBold17};
	${from.tablet} {
		${textSansBold20};
	}
`;

const headerStylesWithUrl = css`
	:hover {
		text-decoration: underline;
	}
`;

const descriptionStyles = css`
	${textEgyptian17};
	line-height: 1.15;
	font-weight: 500;
	color: ${schemePalette('--section-description')};
	p {
		/* Handle paragraphs in the description */
		margin-bottom: ${space[3]}px;
	}
	a {
		color: inherit;
		text-decoration: none;
	}
`;

const bottomMargin = css`
	margin-bottom: ${space[2]}px;
`;

const marginStyles = css`
	margin-left: 0;
`;

const dateTextStyles = css`
	${headlineBold17};
	color: ${schemePalette('--section-date')};
	${until.tablet} {
		display: none;
	}
`;

const dateStyles = css`
	${between.tablet.and.leftCol} {
		display: flex;
		flex-direction: row;
		span:last-child {
			margin-left: ${space[1]}px;
		}
	}
`;

/**
 * ContainerTitle
 *
 * For the date header to be shown, a valid editionId must be passed, as the
 * date is based off of the edition timezone.
 */
export const ContainerTitle = ({
	title,
	lightweightHeader,
	description,
	url,
	showDateHeader,
	editionId,
	fontColour = schemePalette('--article-section-title'),
	containerLevel,
}: Props) => {
	if (!title) return null;

	const now = new Date();

	const { timeZone } = getEditionFromId(editionId ?? 'UK');

	return (
		<div css={marginStyles}>
			{url ? (
				<a
					css={[linkStyles, bottomMargin]}
					href={url}
					data-link-name="section heading"
				>
					<h2
						style={{ color: fontColour }}
						css={[
							headerStylesWithUrl,
							headerStyles,
							lightweightHeader && article17,
							containerLevel === 'Primary' && primaryTitleStyles,
							containerLevel === 'Secondary' &&
								secondaryTitleStyles,
						]}
					>
						{localisedTitle(title, editionId)}
					</h2>
				</a>
			) : (
				<h2
					style={{ color: fontColour }}
					css={[
						headerStyles,
						lightweightHeader && article17,
						containerLevel === 'Primary' && primaryTitleStyles,
						containerLevel === 'Secondary' && secondaryTitleStyles,
					]}
				>
					{localisedTitle(title, editionId)}
				</h2>
			)}
			{!!description && (
				<div
					css={[descriptionStyles, bottomMargin]}
					dangerouslySetInnerHTML={{ __html: description }}
				/>
			)}
			{showDateHeader && editionId && (
				<div css={dateStyles}>
					<span css={dateTextStyles}>
						{now.toLocaleString('en-GB', {
							weekday: 'long',
							timeZone,
						})}
					</span>
					<span
						css={[
							css`
								display: block;
							`,
							dateTextStyles,
							bottomMargin,
						]}
					>
						{now.toLocaleString('en-GB', {
							day: 'numeric',
							month: 'long',
							year: 'numeric',
							timeZone,
						})}
					</span>
				</div>
			)}
		</div>
	);
};
