/**
 * @file
 * This file was largely copied from src/components/Nav/ExpandedMenu/ExpandedMenu.tsx
 */
import { css } from '@emotion/react';
import { from, textSans20, until } from '@guardian/source/foundations';
import type { EditionId } from '../../../../lib/edition';
import { getZIndex } from '../../../../lib/getZIndex';
import type { NavType } from '../../../../model/extract-nav';
import { palette as themePalette } from '../../../../palette';
import { expandedMenuId, navInputCheckboxId } from '../constants';
import { Sections } from './Sections';

const collapsedMenuStyles = css`
	${until.desktop} {
		/* the negative translateX makes the nav hide to the side */
		transform: translateX(-110%);
		transition: transform 0.4s cubic-bezier(0.23, 1, 0.32, 1);
		bottom: 0;
		height: 100%;
		overflow: auto;
		position: fixed;
		right: 0;
		will-change: transform;
	}
	${from.desktop} {
		display: none;
	}
`;

export const expandedMenuStyles = css`
	${until.desktop} {
		/* menu appears from left of screen on mobile when translateX is set to 0% */
		transform: translateX(0%);
	}
	${from.desktop} {
		display: block;
		overflow: visible;
	}
`;

const wrapperMainMenuStyles = css`
	z-index: ${getZIndex('expanded-veggie-menu-wrapper')};
	left: 0;
	top: 0;

	${collapsedMenuStyles}

	/*
	IMPORTANT NOTE:
	we need to specify the adjacent path to the a (current) tag
	to apply styles to the nested tabs due to the fact we use ~
	to support NoJS

	The following styles apply if the menu is open (checkbox is checked)
	*/
	${`#${navInputCheckboxId}`}:checked ~ div & {
		${expandedMenuStyles}
	}
`;

const mainMenuStyles = css`
	background-color: ${themePalette('--masthead-nav-background')};
	${textSans20};
	z-index: ${getZIndex('expanded-veggie-menu')};
	left: 0;
	top: 0;
	box-sizing: border-box;

	position: absolute;
	margin-right: 28px;
	box-shadow: 28px 0 rgba(0, 0, 0, 0.4);
	${from.mobileLandscape} {
		margin-right: 40px;
		box-shadow: 40px 0 rgba(0, 0, 0, 0.4);
	}
	${from.tablet} {
		margin-right: 100px;
		box-shadow: 100px 0 rgba(0, 0, 0, 0.4);
	}
	${from.desktop} {
		box-shadow: none;
		position: absolute;
		padding-bottom: 0;
		padding-top: 0;
		top: 0;
		left: 0;
		right: 0;
		width: 100%;
		@supports (width: 100vw) {
			left: 50%;
			right: 50%;
			width: 100vw;
			margin-left: -50vw;
			margin-right: -50vw;
		}
	}
`;

type Props = {
	editionId: EditionId;
	nav: NavType;
	hasPageSkin?: boolean;
};

/**
 * Entrypoint for the expanded navigation (via burger menu) to open the
 * secondary pillar links, other Guardian links as well as
 * non journalistic links for support asks and other marketing.
 */
export const ExpandedNav = ({ nav, editionId, hasPageSkin }: Props) => {
	return (
		<div
			id={expandedMenuId}
			data-testid="expanded-menu"
			css={wrapperMainMenuStyles}
		>
			<div
				css={css`
					${from.desktop} {
						position: relative;
					}
				`}
			>
				<div css={mainMenuStyles}>
					<Sections
						editionId={editionId}
						nav={nav}
						hasPageSkin={hasPageSkin}
					/>
				</div>
			</div>
		</div>
	);
};
