import { css } from '@emotion/react';
import {
	between,
	from,
	headlineBold20,
	palette as sourcePalette,
	space,
	textSans15,
	until,
} from '@guardian/source/foundations';
import type { FootballTeam } from '../footballMatch';
import { ArticleDesign, type ArticleFormat } from '../lib/articleFormat';
import { palette as themePalette } from '../palette';
import type { ColourName } from '../paletteDeclarations';
import { Distribution } from './Distribution';
import { Doughnut } from './Doughnut';
import { GoalAttempts } from './GoalAttempts';
import { GridItem } from './GridItem';
import { Hide } from './Hide';
import { Lineup } from './Lineup';

type MatchStatsData = {
	home: FootballTeam;
	away: FootballTeam;
};

type MatchSummaryProps = MatchStatsData & {
	usage: 'MatchSummary';
};

type ArticleProps = MatchStatsData & {
	usage: 'Article';
	format: ArticleFormat;
};

type Props = ArticleProps | MatchSummaryProps;

const StatsGrid = ({
	children,
	format,
	backgroundColour,
}: {
	children: React.ReactNode;
	format?: ArticleFormat;
	backgroundColour: ColourName;
}) => {
	switch (format?.design) {
		case ArticleDesign.LiveBlog:
		case ArticleDesign.DeadBlog: {
			return (
				<div
					css={css`
						/* IE Fallback */
						display: flex;
						flex-direction: column;

						background-color: ${themePalette(backgroundColour)};
						@supports (display: grid) {
							display: grid;

							${until.desktop} {
								grid-template-columns: 49% 49%;
								column-gap: 2%;
								grid-template-areas:
									'title          .'
									'possession     attempts'
									'possession     corners'
									'possession     fouls'
									'subtitle       .'
									'home           away';
							}

							${from.desktop} {
								grid-template-columns: 100%;
								column-gap: 0%;
								grid-template-areas:
									'title'
									'possession'
									'attempts'
									'corners'
									'fouls'
									'subtitle'
									'home'
									'away';
							}
							${until.phablet} {
								grid-template-columns: 50% 50%;
								column-gap: 0%;
								grid-template-areas:
									'title			title'
									'possession		possession'
									'attempts		attempts'
									'corners		corners'
									'fouls			fouls'
									'subtitle		subtitle'
									'home			away';
							}
						}
					`}
				>
					{children}
				</div>
			);
		}
		default: {
			return (
				<div
					css={css`
						/* IE Fallback */
						display: flex;
						flex-direction: column;

						background-color: ${themePalette(backgroundColour)};
						@supports (display: grid) {
							display: grid;

							${from.wide} {
								grid-template-columns: 49% 49%;
								column-gap: 2%;
								grid-template-areas:
									'title          .'
									'possession     attempts'
									'possession     corners'
									'possession     fouls'
									'subtitle       .'
									'home           away';
							}

							${until.wide} {
								grid-template-columns: 49% 49%;
								column-gap: 2%;
								grid-template-areas:
									'title          .'
									'possession     attempts'
									'possession     corners'
									'possession     fouls'
									'subtitle       .'
									'home           away';
							}

							${until.phablet} {
								grid-template-columns: 50% 50%;
								column-gap: 0%;
								grid-template-areas:
									'title			title'
									'possession		possession'
									'attempts		attempts'
									'corners		corners'
									'fouls			fouls'
									'subtitle		subtitle'
									'home			away';
							}
						}
					`}
				>
					{children}
				</div>
			);
		}
	}
};

const StretchBackground = ({
	showStats,
	children,
	backgroundColour,
}: {
	showStats: boolean;
	children: React.ReactNode;
	backgroundColour: ColourName;
}) => (
	<div
		css={css`
			clear: left;
			position: relative;
			flex-grow: 1;
			padding: ${space[2]}px 10px;
			${from.mobileLandscape} {
				margin-left: ${space[3]}px;
			}
			/* We use min-height to help reduce our CLS value */
			min-height: ${showStats ? '800px' : '570px'};
			background-color: ${themePalette(backgroundColour)};

			${from.leftCol} {
				::before {
					content: '';
					position: absolute;
					top: 0;
					bottom: 0;
					/* stretch left */
					left: -100vw;
					right: 0;
					background-color: ${themePalette(backgroundColour)};
					z-index: -1;
				}
			}
		`}
	>
		{children}
	</div>
);

const ShiftLeft = ({
	children,
	format,
}: {
	children: React.ReactNode;
	format?: ArticleFormat;
}) => {
	switch (format?.design) {
		case ArticleDesign.LiveBlog:
		case ArticleDesign.DeadBlog: {
			return <div>{children}</div>;
		}
		default: {
			return (
				<div
					css={css`
						${from.leftCol} {
							position: absolute;
							left: -160px;
						}
						${from.wide} {
							position: absolute;
							left: -240px;
						}
					`}
				>
					{children}
				</div>
			);
		}
	}
};

const Center = ({ children }: { children: React.ReactNode }) => (
	<div
		css={css`
			display: flex;
			justify-content: center;
		`}
	>
		{children}
	</div>
);

const RightBorder = ({ children }: { children: React.ReactNode }) => (
	<h4
		css={css`
			${from.phablet} {
				border-right: 1px solid ${sourcePalette.neutral[86]};
			}
			margin-right: 10px;
			padding-right: 10px;
			${from.desktop} {
				margin-right: 0;
				padding-right: 0;
				border-right: 0;
			}
		`}
	>
		{children}
	</h4>
);

const H3 = ({ children }: { children: React.ReactNode }) => (
	<h3
		css={css`
			${headlineBold20}
		`}
	>
		{children}
	</h3>
);

const H4 = ({ children }: { children: React.ReactNode }) => (
	<h4
		css={css`
			${textSans15}
		`}
	>
		{children}
	</h4>
);

const DecideDoughnut = ({
	home,
	away,
	format,
}: {
	home: FootballTeam;
	away: FootballTeam;
	format?: ArticleFormat;
}) => {
	const sections = [
		{
			value: home.possession,
			label: home.codename,
			color: home.colours,
		},
		{
			value: away.possession,
			label: away.codename,
			color: away.colours,
		},
	].reverse();
	switch (format?.design) {
		case ArticleDesign.LiveBlog:
		case ArticleDesign.DeadBlog: {
			return (
				<>
					{/* This represents the stats component being within the main body on a liveblog */}
					<div
						css={css`
							${from.mobileMedium} {
								display: none;
							}
						`}
					>
						<Doughnut sections={sections} size={200} />
					</div>
					<div
						css={css`
							display: none;
							${between.mobileMedium.and.desktop} {
								display: block;
							}
						`}
					>
						<Doughnut sections={sections} size={300} />
					</div>
					{/* This represents the stats component being within the left column on a liveblog */}
					<div
						css={css`
							${until.desktop} {
								display: none;
							}
						`}
					>
						<Doughnut sections={sections} size={200} />
					</div>
				</>
			);
		}
		default:
			return <Doughnut sections={sections} />;
	}
};

/*
	Some leagues do not return match stats - see
	https://github.com/guardian/frontend/blob/e046d4144d0001059156f402fd5cf1af29ee9f0c/sport/app/football/controllers/MatchController.scala#L23
*/
function teamHasStats({ shotsOff, shotsOn, fouls, corners }: FootballTeam) {
	return !(shotsOff === 0 && shotsOn === 0 && fouls === 0 && corners === 0);
}

export const MatchStats = (props: Props) => {
	const { home, away, usage } = props;
	const showStats = teamHasStats(home) && teamHasStats(away);
	const showLineups = home.players.length > 0 && away.players.length > 0;

	const format = usage === 'Article' ? props.format : undefined;
	const backgroundColour =
		usage === 'Article'
			? '--match-stats-background'
			: '--article-background';

	return (
		<StretchBackground
			showStats={showStats}
			backgroundColour={backgroundColour}
		>
			<StatsGrid format={format} backgroundColour={backgroundColour}>
				{showStats && (
					<>
						<GridItem area="title" element="aside">
							<ShiftLeft format={format}>
								{/* Don't show the right border if this text was
                        shifted into the left column */}
								<Hide when="above" breakpoint="desktop">
									<RightBorder>
										<H3>Match Stats</H3>
									</RightBorder>
								</Hide>
								<Hide when="below" breakpoint="desktop">
									<H3>Match Stats</H3>
								</Hide>
							</ShiftLeft>
						</GridItem>

						<GridItem area="possession">
							<RightBorder>
								<H4>Possession</H4>
								<Center>
									<DecideDoughnut
										home={home}
										away={away}
										format={format}
									/>
								</Center>
							</RightBorder>
							<br />
						</GridItem>
						<GridItem area="attempts">
							<H4>Attempts</H4>
							<GoalAttempts
								left={{
									onTarget: home.shotsOn,
									offTarget: home.shotsOff,
									color: home.colours,
								}}
								right={{
									onTarget: away.shotsOn,
									offTarget: away.shotsOff,
									color: away.colours,
								}}
								backgroundColour={backgroundColour}
							/>
						</GridItem>
						<GridItem area="corners">
							<H4>Corners</H4>
							<Distribution
								left={{
									value: home.corners,
									color: home.colours,
								}}
								right={{
									value: away.corners,
									color: away.colours,
								}}
							/>
						</GridItem>
						<GridItem area="fouls">
							<H4>Fouls</H4>
							<Distribution
								left={{
									value: home.fouls,
									color: home.colours,
								}}
								right={{
									value: away.fouls,
									color: away.colours,
								}}
							/>
							<br />
						</GridItem>
					</>
				)}
				{showLineups && (
					<>
						<GridItem area="subtitle">
							<ShiftLeft format={format}>
								{/* Don't show the right border if this text was
                        shifted into the left column */}
								<Hide when="above" breakpoint="desktop">
									<RightBorder>
										<H3>Lineups</H3>
									</RightBorder>
								</Hide>
								<Hide when="below" breakpoint="desktop">
									<H3>Lineups</H3>
								</Hide>
							</ShiftLeft>
						</GridItem>
						<GridItem area="home">
							<RightBorder>
								<H4>{home.name}</H4>
								<Lineup
									players={home.players.filter(
										(player) => !player.substitute,
									)}
								/>
								<br />
								<H4>Substitutes</H4>
								<Lineup
									players={home.players.filter(
										(player) => player.substitute,
									)}
								/>
								<br />
							</RightBorder>
						</GridItem>
						<GridItem area="away">
							<H4>{away.name}</H4>
							<Lineup
								players={away.players.filter(
									(player) => !player.substitute,
								)}
							/>
							<br />
							<H4>Substitutes</H4>
							<Lineup
								players={away.players.filter(
									(player) => player.substitute,
								)}
							/>
							<br />
						</GridItem>
					</>
				)}
			</StatsGrid>
		</StretchBackground>
	);
};
