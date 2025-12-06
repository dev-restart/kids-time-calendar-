<script lang="ts">
	import { timeStore } from "$lib/stores/timeStore.svelte";

	let { size = 300 } = $props();

	let svgElement: SVGSVGElement;
	let isDragging = $state<"hour" | "minute" | null>(null);

	// Calculate angles based on time
	let minuteAngle = $derived(timeStore.minutes * 6); // 360 / 60 = 6 deg/min
	let hourAngle = $derived(
		(timeStore.hours % 12) * 30 + timeStore.minutes * 0.5,
	); // 360 / 12 = 30 deg/hr + 0.5 deg/min

	// Numbers on the clock face
	const numbers = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

	function getAngle(event: PointerEvent) {
		const rect = svgElement.getBoundingClientRect();
		const cx = rect.left + rect.width / 2;
		const cy = rect.top + rect.height / 2;

		const clientX = event.clientX;
		const clientY = event.clientY;

		const dx = clientX - cx;
		const dy = clientY - cy;

		// Atan2 returns angle in radians from -PI to PI
		// Arguments are (y, x)
		// We want 0 at 12 o'clock (-y direction), so we rotate our coord system
		// Usual atan2(y,x) is 0 at 3 o'clock.
		// Let's use standard atan2 logic then convert.

		let theta = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
		// +90 to shift 0 from 3 o'clock to 12 o'clock?
		// At 12 o'clock: dx=0, dy=-1. atan2(-1, 0) = -90. -90+90 = 0. Correct.
		// At 3 o'clock: dx=1, dy=0. atan2(0, 1) = 0. 0+90 = 90. Correct.

		if (theta < 0) theta += 360;
		return theta;
	}

	function handleStart(hand: "hour" | "minute", event: PointerEvent) {
		// Prevent default browser behavior (scrolling) immediatley
		event.preventDefault();

		// *** BODY SCROLL LOCK ***
		// Freeze the entire page to prevent ANY scrolling during drag
		document.body.style.overflow = "hidden";

		// Lock the pointer to the target element
		(event.target as Element).setPointerCapture(event.pointerId);

		isDragging = hand;
		updateTime(event);
	}

	function handleMove(event: PointerEvent) {
		if (!isDragging) return;
		event.preventDefault();
		updateTime(event);
	}

	function handleEnd(event: PointerEvent) {
		if (!isDragging) return;

		// *** BODY SCROLL UNLOCK ***
		document.body.style.overflow = "";

		// Release capture
		if (
			event.target instanceof Element &&
			event.target.hasPointerCapture(event.pointerId)
		) {
			event.target.releasePointerCapture(event.pointerId);
		}

		isDragging = null;
	}

	function updateTime(event: PointerEvent) {
		const angle = getAngle(event);
		if (isDragging === "minute") {
			// Snap to nearest minute (6 degrees)
			const snappedAngle = Math.round(angle / 6) * 6;
			const newMinute = (snappedAngle / 6) % 60;

			let currentMinuteAngle = timeStore.minutes * 6;
			let delta = snappedAngle - (currentMinuteAngle % 360);

			// Correct for wrap around physics (e.g. 350 -> 10 deg)
			if (delta > 180) delta -= 360;
			if (delta < -180) delta += 360;

			// Convert delta degrees to minutes
			const minuteDelta = Math.round(delta / 6);

			if (minuteDelta !== 0) {
				timeStore.addMinutes(minuteDelta);
			}
		} else if (isDragging === "hour") {
			// Dragging hour hand
			let currentHourAngle =
				(timeStore.hours % 12) * 30 + timeStore.minutes * 0.5; // Mod 360 effectively
			let delta = angle - (currentHourAngle % 360);
			if (delta > 180) delta -= 360;
			if (delta < -180) delta += 360;

			const minuteDelta = Math.round(delta / 0.5); // 0.5 deg per minute
			if (minuteDelta !== 0) {
				timeStore.addMinutes(minuteDelta);
			}
		}
	}

	// Drop Zone Handlers
	let isDragOver = $state(false);

	function handleDragOver(event: DragEvent) {
		event.preventDefault(); // allow drop
		event.dataTransfer!.dropEffect = "copy";
		isDragOver = true;
	}

	function handleDragLeave() {
		isDragOver = false;
	}

	function handleDrop(event: DragEvent) {
		event.preventDefault();
		isDragOver = false;

		const data = event.dataTransfer?.getData("application/json");
		if (data) {
			try {
				const { minutes } = JSON.parse(data);
				if (typeof minutes === "number") {
					timeStore.addMinutes(minutes);
				}
			} catch (e) {
				console.error("Invalid drop data", e);
			}
		}
	}
</script>

<svelte:window />

<div
	class="relative flex items-center justify-center select-none transition-transform duration-200 {isDragOver
		? 'scale-110'
		: ''}"
	style="width: {size}px; height: {size}px;"
	role="application"
	aria-label="Clock Face with Drag and Drop"
	ondragover={handleDragOver}
	ondragleave={handleDragLeave}
	ondrop={handleDrop}
>
	<svg
		bind:this={svgElement}
		id="clock-drop-zone"
		viewBox="0 0 300 300"
		class="w-full h-full drop-shadow-2xl pointer-events-auto"
		style="touch-action: none;"
	>
		<!-- Defs for Gradients -->
		<defs>
			<radialGradient
				id="clockGradient"
				cx="50%"
				cy="50%"
				r="50%"
				fx="50%"
				fy="50%"
			>
				<stop offset="0%" stop-color="#ffffff" />
				<stop offset="90%" stop-color="#f0f9ff" />
				<stop offset="100%" stop-color="#e0f2fe" />
			</radialGradient>
			<filter id="innerShadow">
				<feOffset dx="0" dy="2" />
				<feGaussianBlur stdDeviation="3" result="offset-blur" />
				<feComposite
					operator="out"
					in="SourceGraphic"
					in2="offset-blur"
					result="inverse"
				/>
				<feFlood
					flood-color="black"
					flood-opacity="0.2"
					result="color"
				/>
				<feComposite
					operator="in"
					in="color"
					in2="inverse"
					result="shadow"
				/>
				<feComposite operator="over" in="shadow" in2="SourceGraphic" />
			</filter>
		</defs>

		<!-- Clock Face Background -->
		<circle
			cx="150"
			cy="150"
			r="140"
			fill="url(#clockGradient)"
			stroke="white"
			stroke-width="8"
			filter="url(#innerShadow)"
		/>

		<!-- Minute Ticks -->
		{#each Array.from({ length: 60 }) as _, i}
			<line
				x1="150"
				y1="25"
				x2="150"
				y2={i % 5 === 0 ? 40 : 30}
				transform="rotate({i * 6} 150 150)"
				stroke={i % 5 === 0 ? "#cbd5e1" : "#e2e8f0"}
				stroke-width={i % 5 === 0 ? 4 : 2}
				stroke-linecap="round"
			/>
		{/each}

		<!-- Numbers -->
		{#each numbers as hour, i}
			<text
				x={150 + 105 * Math.sin(((i + 1) * Math.PI) / 6)}
				y={150 - 105 * Math.cos(((i + 1) * Math.PI) / 6)}
				text-anchor="middle"
				dominant-baseline="middle"
				class="text-3xl font-jua fill-slate-600 font-bold select-none pointer-events-none"
				style="font-size: 28px;"
			>
				{hour}
			</text>
		{/each}

		<!-- Hour Hand Area -->
		<g transform="rotate({hourAngle} 150 150)">
			<!-- Hand -->
			<line
				x1="150"
				y1="150"
				x2="150"
				y2="50"
				stroke="var(--color-time-hour)"
				stroke-width="12"
				stroke-linecap="round"
			/>
			<!-- Interactive Hit Area (Larger) -->
			<line
				x1="150"
				y1="150"
				x2="150"
				y2="50"
				stroke="transparent"
				stroke-width="60"
				class="cursor-grab active:cursor-grabbing pointer-events-auto"
				style="touch-action: none;"
				onpointerdown={(e) => handleStart("hour", e)}
				onpointermove={handleMove}
				onpointerup={handleEnd}
				onpointercancel={handleEnd}
				role="button"
				aria-label="Drag Hour Hand"
				tabindex="0"
			/>
		</g>

		<!-- Minute Hand Area -->
		<g transform="rotate({minuteAngle} 150 150)">
			<!-- Hand -->
			<line
				x1="150"
				y1="150"
				x2="150"
				y2="40"
				stroke="var(--color-time-minute)"
				stroke-width="8"
				stroke-linecap="round"
			/>
			<!-- Interactive Hit Area (Larger) -->
			<line
				x1="150"
				y1="150"
				x2="150"
				y2="20"
				stroke="transparent"
				stroke-width="50"
				class="cursor-grab active:cursor-grabbing pointer-events-auto"
				style="touch-action: none;"
				onpointerdown={(e) => handleStart("minute", e)}
				onpointermove={handleMove}
				onpointerup={handleEnd}
				onpointercancel={handleEnd}
				role="button"
				aria-label="Drag Minute Hand"
				tabindex="0"
			/>
		</g>

		<!-- Center Cap -->
		<circle cx="150" cy="150" r="8" fill="#475569" />
	</svg>
</div>
