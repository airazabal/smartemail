import {
	trigger, state, animate, style,
	transition, group, keyframes
} from '@angular/core';

/**
 * These animation functions will only work with ngIf. It will not work
 * with [hidden] as of 4.2.3. Not sure if AngularJs will make it work
 * with [hidden] in the future....
 */

/**
 * Fade In/Out Animation
 * @param duration in ms. Optional. Animation duration. Ex: 500 or 1s
 */
export function fade(duration: number = 500) {
	return trigger('itemFadeAnimation', [
		state('in', style({ position: '' })),
		state('out', style({ position: 'absolute' })),
		transition('void => *', [ // enter
			style({ opacity: 0, position: '' }),
			animate(duration + 'ms ease-in', style({ opacity: 1 }))
		]),
		transition('* => void', [ // leave
			style({ opacity: 1, position: 'absolute' }),
			animate(duration + 'ms ease-in', style({ opacity: 0 }))
		])
	]);
}

/**
 * Wipe up/down
 * @param duration animation duration. Default: 500ms
 */
export function shrink(duration: number = 500) {
	return trigger('shrinkOut', [ 
		state('in', style({ height: '*' })),
		transition('* => void', [ // leave
			style({ height: '*', overflow: 'hidden' }),
			animate(duration + 'ms ease-in-out', style({ height: 0 }))
		]),
		transition('void => *', [ // enter
			style({ height: 0, overflow: 'hidden' }),
			animate(duration + 'ms ease-in-out', style({ height: '*' }))
		])
	]);
}

/**
 * Wipe left/right
 * @param duration animation duration. Default: 500ms
 */
export function sideWipe(duration: number = 500) {
	return trigger('sideWipe', [ 
		state('in', style({ width: '*' })),
		transition('* => void', [ // leave
			style({ width: '*', overflow: 'hidden' }),
			animate(duration + 'ms ease-in-out', style({ width: 0 }))
		]),
		transition('void => *', [ // enter
			style({ width: 0, overflow: 'hidden' }),
			animate(duration + 'ms ease-in-out', style({ width: '*' }))
		])
	]);
}

/**
 * Stagger shrink animation. Shrink in /out.
 * @param duration in ms. Default: 300.
 * @param outDuration in ms. Default: 100. 
 */
export function staggerShrink(duration: number = 300) {
	return trigger('itemStaggerShrinkAnimation', [
		state('in', style({ width: 120, transform: 'translateX(0)', opacity: 1 })),
		transition('void => *', [
			style({ width: 10, transform: 'translateX(50px)', opacity: 0 }),
			group([
				animate(duration+'ms 0.1s ease', style({
					transform: 'translateX(0)',
					width: 120
				})),
				animate('0.3s ease', style({
					opacity: 1
				}))
			])
		]),
		transition('* => void', [
			group([
				animate(duration+'ms ease', style({
					transform: 'translateX(50px)',
					width: 10
				})),
				animate(duration + 'ms 0.2s ease', style({
					opacity: 0
				}))
			])
		])
	]);
}

/**
 * Stagger animation. Swipe in from right. Swipe out to the left.
 * @param duration in ms. Default: 300.
 * @param outDuration in ms. Default: 100. 
 */
export function stagger(duration: number = 300, outDuration: number = 100) {
	return trigger('itemStaggerAnimation', [
		state('in', style({ transform: 'translateX(0)' })),
		transition('void => *', [
			animate(duration, keyframes([
				style({ opacity: 0, transform: 'translateX(-100%)', offset: 0 }),
				style({ opacity: 1, transform: 'translateX(15px)', offset: 0.3 }),
				style({ opacity: 1, transform: 'translateX(0)', offset: 1.0 })
			]))
		]),
		transition('* => void', [
			animate(outDuration, keyframes([
				style({ opacity: 1, transform: 'translateX(0)', offset: 0 }),
				style({ opacity: 1, transform: 'translateX(-15px)', offset: 0.7 }),
				style({ opacity: 0, transform: 'translateX(100%)', offset: 1.0 })
			]))
		])
	]);
}
