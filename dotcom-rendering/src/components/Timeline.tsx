import { css, type SerializedStyles } from '@emotion/react';
import { isUndefined } from '@guardian/libs';
import {
	between,
	from,
	headlineBold20,
	headlineBold24,
	headlineMedium20,
	headlineMedium24,
	space,
	textSans15,
	textSansBold15,
	textSansBold17,
} from '@guardian/source/foundations';
import { ArticleDesign, type ArticleFormat } from '../lib/articleFormat';
import type { NestedArticleElement } from '../lib/renderElement';
import { slugify } from '../model/enhance-H2s';
import { palette } from '../palette';
import type {
	DCRSectionedTimelineBlockElement,
	DCRTimelineBlockElement,
	DCRTimelineEvent,
	FEElement,
} from '../types/content';
import { Heading } from './Heading';
import { Subheading } from './Subheading';

// ----- Helpers ----- //

const isValidString = (str?: string): boolean =>
	!isUndefined(str) && str.trim() !== '';

const hasShowcaseRole = (element?: FEElement): boolean => {
	if (isUndefined(element)) return false;
	return 'role' in element && element.role === 'showcase';
};

// ----- EventHeader ----- //

const timelineBulletStyles = css`
	position: relative;
	::before {
		content: '';
		position: absolute;
		display: block;
		width: 12px;
		height: 12px;
		border: 1px solid ${palette('--timeline-event-border')};
		border-radius: 100%;
		background-color: ${palette('--timeline-bullet')};
		left: -16.5px;
		top: -10px;

		${between.tablet.and.leftCol} {
			left: -26.5px;
		}
	}
`;

const smallDateStyles = css`
	display: block;
	${textSansBold15}

	${from.desktop} {
		${textSansBold17}
	}
`;

const titleWeight = ({ design }: ArticleFormat): 'bold' | 'medium' => {
	switch (design) {
		case ArticleDesign.Feature:
		case ArticleDesign.Interview:
		case ArticleDesign.Recipe:
		case ArticleDesign.Review:
			return 'bold';
		default:
			return 'medium';
	}
};

const titleStyles = (format: ArticleFormat): SerializedStyles => css`
	${titleWeight(format) === 'bold' ? headlineBold20 : headlineMedium20}

	${from.desktop} {
		${titleWeight(format) === 'bold' ? headlineBold24 : headlineMedium24}
	}
`;

const headingStyles = css`
	margin-top: 4px;
`;

type EventHeaderProps = {
	event: DCRTimelineEvent;
	ArticleElementComponent: NestedArticleElement;
	sectioned: boolean;
	smallDates: boolean;
	format: ArticleFormat;
};

const EventHeader = ({
	event,
	ArticleElementComponent,
	format,
	sectioned,
	smallDates,
}: EventHeaderProps) => {
	const heading = (
		<Heading
			css={[
				headingStyles,
				!hasShowcaseRole(event.main) && timelineBulletStyles,
			]}
			level={sectioned ? 3 : 2}
		>
			<span css={smallDates ? smallDateStyles : titleStyles(format)}>
				{event.date}
			</span>
			{isValidString(event.title) ? (
				<span css={titleStyles(format)}>{event.title}</span>
			) : null}
		</Heading>
	);

	if (!isUndefined(event.main) && hasShowcaseRole(event.main)) {
		return (
			<header>
				<ArticleElementComponent
					index={0}
					element={event.main}
					format={format}
					isTimeline={true}
					isMainMedia={true}
				/>
				{heading}
			</header>
		);
	} else if (!isUndefined(event.main)) {
		return (
			<header>
				{heading}
				<ArticleElementComponent
					index={0}
					element={event.main}
					format={format}
					isTimeline={true}
					isMainMedia={true}
				/>
			</header>
		);
	} else {
		return heading;
	}
};

// ----- TimelineEvent ----- //

const eventStyles = css`
	border: 1px solid ${palette('--timeline-event-border')};
	padding: 0 10px ${space[6]}px 10px;
	margin-bottom: ${space[5]}px;
	position: relative;

	${from.tablet} {
		padding-left: ${space[5]}px;
		padding-right: ${space[5]}px;
		margin-left: -21px;
		margin-right: -21px;
	}
	${from.leftCol} {
		padding-left: 10px;
		padding-right: 10px;
		margin-left: -11px;
		margin-right: -11px;
	}
`;

const labelStyles = css`
	border: 1px solid ${palette('--timeline-event-border')};
	border-bottom: none;
	padding: 3px 10px 4px 10px;
	display: inline-block;
	${textSans15}

	${from.tablet} {
		padding-left: ${space[5]}px;
		padding-right: ${space[5]}px;
		margin-left: -21px;
		margin-right: -21px;
	}
	${from.leftCol} {
		padding-left: 10px;
		padding-right: 10px;
		margin-left: -11px;
		margin-right: -11px;
	}
`;

const immersiveMainElementEventStyles = css`
	padding-top: 0;
`;

type TimelineEventProps = {
	event: DCRTimelineEvent;
	ArticleElementComponent: NestedArticleElement;
	sectioned: boolean;
	smallDates: boolean;
	format: ArticleFormat;
};

const TimelineEvent = ({
	event,
	ArticleElementComponent,
	sectioned,
	smallDates,
	format,
}: TimelineEventProps) => {
	return (
		<>
			{isValidString(event.label) && (
				<div css={labelStyles}>{event.label}</div>
			)}
			<section
				css={[
					eventStyles,
					hasShowcaseRole(event.main)
						? immersiveMainElementEventStyles
						: undefined,
				]}
			>
				<EventHeader
					event={event}
					ArticleElementComponent={ArticleElementComponent}
					sectioned={sectioned}
					smallDates={smallDates}
					format={format}
				/>
				{event.body.map((element, index) => (
					<ArticleElementComponent
						// eslint-disable-next-line react/no-array-index-key -- This is only rendered once so we can safely use index to suppress the warning
						key={index}
						index={index}
						element={element}
						forceDropCap="off"
						format={format}
						isTimeline={true}
						isMainMedia={false}
					/>
				))}
			</section>
		</>
	);
};

// ----- Timeline ----- //

type Props = {
	timeline: DCRTimelineBlockElement | DCRSectionedTimelineBlockElement;
	ArticleElementComponent: NestedArticleElement;
	format: ArticleFormat;
};

export const Timeline = ({
	timeline,
	format,
	ArticleElementComponent,
}: Props) => {
	switch (timeline._type) {
		case 'model.dotcomrendering.pageElements.DCRTimelineBlockElement': {
			const someEventsHaveTitles = timeline.events.some((event) =>
				isValidString(event.title),
			);

			return (
				<>
					{timeline.events.map((event) => (
						<TimelineEvent
							event={event}
							ArticleElementComponent={ArticleElementComponent}
							sectioned={false}
							key={event.date}
							smallDates={someEventsHaveTitles}
							format={format}
						/>
					))}
				</>
			);
		}
		case 'model.dotcomrendering.pageElements.DCRSectionedTimelineBlockElement': {
			const someEventsHaveTitles = timeline.sections.some((section) =>
				section.events.some((event) => isValidString(event.title)),
			);

			return (
				<>
					{timeline.sections.map((section) => (
						<section key={section.title}>
							<Subheading
								format={format}
								topPadding={false}
								id={slugify(section.title)}
							>
								{section.title}
							</Subheading>
							{section.events.map((event) => (
								<TimelineEvent
									event={event}
									ArticleElementComponent={
										ArticleElementComponent
									}
									sectioned={true}
									key={event.date}
									smallDates={someEventsHaveTitles}
									format={format}
								/>
							))}
						</section>
					))}
				</>
			);
		}
	}
};
