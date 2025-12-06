<script lang="ts">
    import { timeStore } from "$lib/stores/timeStore.svelte";

    let barElement: HTMLDivElement;
    let isDragging = $state(false);

    // Calculate position percentage (0-100%)
    let progressPercent = $derived(
        ((timeStore.minutes + timeStore.hours * 60) / 1440) * 100,
    );

    function updateTimeFromEvent(event: PointerEvent) {
        if (!barElement) return;

        const rect = barElement.getBoundingClientRect();
        let offsetX = event.clientX - rect.left;

        // Clamp width
        if (offsetX < 0) offsetX = 0;
        if (offsetX > rect.width) offsetX = rect.width;

        const ratio = offsetX / rect.width;
        const totalMinutes = Math.round(ratio * 1440);

        timeStore.setDayMinutes(totalMinutes);
    }

    function handleStart(event: PointerEvent) {
        event.preventDefault();
        (event.target as Element).setPointerCapture(event.pointerId);
        document.body.style.overflow = "hidden";
        isDragging = true;
        updateTimeFromEvent(event);
    }

    function handleMove(event: PointerEvent) {
        if (!isDragging) return;
        event.preventDefault();
        updateTimeFromEvent(event);
    }

    function handleEnd(event: PointerEvent) {
        if (!isDragging) return;
        document.body.style.overflow = "";
        if (
            event.target instanceof Element &&
            event.target.hasPointerCapture(event.pointerId)
        ) {
            event.target.releasePointerCapture(event.pointerId);
        }
        isDragging = false;
    }
</script>

<div class="w-full px-4 py-6 select-none">
    <div class="relative h-12">
        <!-- Main Bar Track -->
        <div
            bind:this={barElement}
            class="relative w-full h-full bg-slate-200 rounded-full overflow-hidden cursor-pointer shadow-inner border-2 border-slate-300"
            style="touch-action: none;"
            role="slider"
            aria-label="Time slider"
            aria-valuenow={timeStore.hours * 60 + timeStore.minutes}
            aria-valuemin={0}
            aria-valuemax={1440}
            tabindex="0"
            onpointerdown={handleStart}
            onpointermove={handleMove}
            onpointerup={handleEnd}
            onpointercancel={handleEnd}
        >
            <!-- Day/Night Indicators (Background) -->
            <!-- Night: 0-6h (0-25%), Day: 6-18h (25-75%), Night: 18-24h (75-100%) -->
            <div
                class="absolute top-0 left-0 w-full h-full flex pointer-events-none"
            >
                <div
                    class="w-[25%] h-full bg-slate-700/30 border-r border-slate-300/50"
                ></div>
                <!-- Midnight to 6am -->
                <div class="w-[50%] h-full bg-sky-300/20"></div>
                <!-- 6am to 6pm -->
                <div
                    class="w-[25%] h-full bg-slate-700/30 border-l border-slate-300/50"
                ></div>
                <!-- 6pm to Midnight -->
            </div>

            <!-- Progress Fill (Past time) -->
            <div
                class="absolute top-0 left-0 h-full bg-primary/20 transition-all duration-75 ease-out"
                style="width: {progressPercent}%;"
            ></div>

            <!-- Hour Markers -->
            <div
                class="absolute top-0 left-0 w-full h-full pointer-events-none"
            >
                {#each Array(25) as _, i}
                    <div
                        class="absolute top-0 h-full border-l border-slate-400/50 flex flex-col justify-end items-center pb-1 text-[10px] font-bold text-slate-500"
                        style="left: {(i / 24) * 100}%;"
                    >
                        <!-- Only show labels for some hours to avoid clutter -->
                        {#if i % 3 === 0}
                            <span class="transform -translate-x-1/2">{i}</span>
                        {:else}
                            <div
                                class="h-2 w-px bg-slate-400/50 transform -translate-x-1/2"
                            ></div>
                        {/if}
                    </div>
                {/each}
            </div>
        </div>

        <!-- Current Time Knob -->
        <div
            class="absolute top-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg border-2 border-primary cursor-grab active:cursor-grabbing flex items-center justify-center pointer-events-none z-10 transition-all duration-75 ease-out"
            style="left: {progressPercent}%; transform: translate(-50%, -50%);"
        >
            <div class="w-2 h-2 rounded-full bg-primary"></div>
        </div>
    </div>
</div>
