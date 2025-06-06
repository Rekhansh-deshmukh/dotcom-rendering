import assert from 'node:assert/strict';
import { images } from '../../fixtures/generated/images';
import type { FEElement } from '../../src/types/content';
import { enhanceTimeline } from './enhanceTimeline';

const identity = <A>(a: A): A => a;

const elementsWithNoSections: FEElement[] = [
	{
		_type: 'model.dotcomrendering.pageElements.TimelineBlockElement',
		elementId: 'mock-id',
		sections: [
			{
				title: '',
				events: [
					{
						title: 'mock event title',
						date: '1st January 2024',
						body: [],
						// Showcase image
						main: images[0],
					},
					{
						title: 'mock event title',
						date: '5th January 2024',
						body: [],
						// Half width image
						main: images[3],
					},
					{
						title: 'mock event title',
						date: '8th January 2024',
						body: [],
						// Media atom (no role)
						main: {
							_type: 'model.dotcomrendering.pageElements.MediaAtomBlockElement',
							elementId: 'mock-id',
							id: 'mock-id',
							assets: [],
						},
					},
					{
						title: 'mock event title',
						date: '10th January 2024',
						// Inline image
						body: [images[1]],
						main: images[0],
					},
					{
						title: 'mock event title',
						date: '15th January 2024',
						// Showcase image
						body: [images[0]],
						main: images[0],
					},
					{
						title: 'mock event title',
						date: '15th January 2024',
						// Media atom (no role)
						body: [
							{
								_type: 'model.dotcomrendering.pageElements.MediaAtomBlockElement',
								elementId: 'mock-id',
								id: 'mock-id',
								assets: [],
							},
						],
						main: images[0],
					},
				],
			},
		],
	},
];

const elementsWithOneSection: FEElement[] = [
	{
		_type: 'model.dotcomrendering.pageElements.TimelineBlockElement',
		elementId: 'mock-id',
		sections: [
			{
				title: 'Section 1',
				events: [
					{
						title: 'mock event title',
						date: '1st January 2024',
						body: [],
						// Showcase image
						main: images[0],
					},
					{
						title: 'mock event title',
						date: '5th January 2024',
						body: [],
						// Half width image
						main: images[3],
					},
				],
			},
		],
	},
];

const elementsWithMultipleSections: FEElement[] = [
	{
		_type: 'model.dotcomrendering.pageElements.TimelineBlockElement',
		elementId: 'mock-id',
		sections: [
			{
				title: 'Section 1',
				events: [
					{
						title: 'Event 1 title',
						date: '1st January 2024',
						body: [],
					},
					{
						title: 'Event 2 title',
						date: '5th January 2024',
						body: [],
					},
				],
			},
			{
				title: 'Section 2',
				events: [
					{
						title: 'Event 3 title',
						date: '1st March 2024',
						body: [],
					},
					{
						title: 'Event 4 title',
						date: '5th March 2024',
						body: [],
					},
				],
			},
		],
	},
];

describe('enhanceTimeline', () => {
	it('keeps a main media with a role that is valid', () => {
		const enhanced = enhanceTimeline(identity)(elementsWithNoSections);
		assert.equal(
			enhanced[0]?._type,
			'model.dotcomrendering.pageElements.DCRTimelineBlockElement',
		);

		const timelineEvent = enhanced[0].events[0];
		assert.notEqual(timelineEvent, undefined);
		expect(timelineEvent?.main).toBeDefined();
	});

	it('drops a main media with a role that is not valid', () => {
		const enhanced = enhanceTimeline(identity)(elementsWithNoSections);
		assert.equal(
			enhanced[0]?._type,
			'model.dotcomrendering.pageElements.DCRTimelineBlockElement',
		);

		const timelineEvent = enhanced[0].events[1];
		assert.notEqual(timelineEvent, undefined);
		expect(timelineEvent?.main).toBeUndefined();
	});

	it('keeps a main media without a role', () => {
		const enhanced = enhanceTimeline(identity)(elementsWithNoSections);
		assert.equal(
			enhanced[0]?._type,
			'model.dotcomrendering.pageElements.DCRTimelineBlockElement',
		);

		const timelineEvent = enhanced[0].events[2];
		assert.notEqual(timelineEvent, undefined);
		expect(timelineEvent?.main).toBeDefined();
	});
	it('keeps a body element with a role that is valid', () => {
		const enhanced = enhanceTimeline(identity)(elementsWithNoSections);
		assert.equal(
			enhanced[0]?._type,
			'model.dotcomrendering.pageElements.DCRTimelineBlockElement',
		);

		const timelineEvent = enhanced[0].events[3];
		assert.notEqual(timelineEvent, undefined);
		expect(timelineEvent?.body).toEqual([images[1]]);
	});

	it('drops a body element with a role that is not valid', () => {
		const enhanced = enhanceTimeline(identity)(elementsWithNoSections);
		assert.equal(
			enhanced[0]?._type,
			'model.dotcomrendering.pageElements.DCRTimelineBlockElement',
		);

		const timelineEvent = enhanced[0].events[4];
		assert.notEqual(timelineEvent, undefined);
		expect(timelineEvent?.body).toEqual([]);
	});

	it('keeps a body element without a role', () => {
		const enhanced = enhanceTimeline(identity)(elementsWithNoSections);
		assert.equal(
			enhanced[0]?._type,
			'model.dotcomrendering.pageElements.DCRTimelineBlockElement',
		);

		const timelineEvent = enhanced[0].events[5];
		assert.notEqual(timelineEvent, undefined);
		expect(timelineEvent?.body).toEqual([
			{
				_type: 'model.dotcomrendering.pageElements.MediaAtomBlockElement',
				elementId: 'mock-id',
				id: 'mock-id',
				assets: [],
			},
		]);
	});

	it('enhances a timeline with one section appropriately', () => {
		const enhanced = enhanceTimeline(identity)(elementsWithOneSection);
		assert.equal(
			enhanced[0]?._type,
			'model.dotcomrendering.pageElements.DCRSectionedTimelineBlockElement',
		);

		const timelineSection = enhanced[0].sections[0];
		assert.notEqual(timelineSection, undefined);
		expect(timelineSection?.title).toEqual('Section 1');
	});

	it('enhances a timeline with multiple sections appropriately', () => {
		const enhanced = enhanceTimeline(identity)(
			elementsWithMultipleSections,
		);
		assert.equal(
			enhanced[0]?._type,
			'model.dotcomrendering.pageElements.DCRSectionedTimelineBlockElement',
		);

		const timelineSections = enhanced[0].sections;
		expect(timelineSections).toHaveLength(2);
	});
});
