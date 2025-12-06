<script lang="ts">
    // Props: value in minutes
    // If value is negative, it's subtraction.
    import { timeStore } from "$lib/stores/timeStore.svelte";

    let { type, value }: { type: string; value: number } = $props();

    let isTouching = $state(false);
    let touchPos = $state({ x: 0, y: 0 });
    let ghostRef: HTMLDivElement;

    function handleDragStart(e: DragEvent) {
        if (e.dataTransfer) {
            e.dataTransfer.setData("text/plain", JSON.stringify({ value }));
            e.dataTransfer.effectAllowed = "copy";
        }
    }

    // --- Touch Logic for Mobile ---
    function handleTouchStart(e: TouchEvent) {
        // Prevent default to stop scrolling
        // But only if we intend to drag.
        e.preventDefault();

        const touch = e.touches[0];
        isTouching = true;
        touchPos = { x: touch.clientX, y: touch.clientY };
    }

    function handleTouchMove(e: TouchEvent) {
        if (!isTouching) return;
        e.preventDefault(); // Stop scrolling
        const touch = e.touches[0];
        touchPos = { x: touch.clientX, y: touch.clientY };
    }

    function handleTouchEnd(e: TouchEvent) {
        if (!isTouching) return;
        const touch = e.changedTouches[0];

        // Hide ghost temporarily so we can see what's under it
        if (ghostRef) ghostRef.style.display = "none";

        // Check drop target
        const target = document.elementFromPoint(touch.clientX, touch.clientY);

        // Restore ghost (though it will disappear since isTouching becomes false)
        if (ghostRef) ghostRef.style.display = "block";

        if (target) {
            const dropZone = target.closest("#clock-drop-zone");
            if (dropZone) {
                timeStore.addMinutes(value);
                // Optional: Feedback?
            }
        }

        isTouching = false;
    }
</script>

<!-- Ghost Element (Only visible when dragging on mobile) -->
{#if isTouching}
    <div
        bind:this={ghostRef}
        class="fixed z-[9999] pointer-events-none opacity-80"
        style="left: {touchPos.x}px; top: {touchPos.y}px; transform: translate(-50%, -50%);"
    >
        <div
            class="
            w-16 h-16 rounded-2xl flex flex-col items-center justify-center gap-1 shadow-2xl border-2 border-white
            {value > 0
                ? 'bg-gradient-to-br from-cyan-400 to-blue-500 text-white'
                : 'bg-gradient-to-br from-rose-400 to-red-500 text-white'}
        "
        >
            <span
                class="font-bold font-jua text-sm drop-shadow-md whitespace-nowrap"
            >
                {#if type === "hour"}
                    1시간
                {/if}
                {#if type === "10min"}
                    10분
                {/if}
                {#if type === "5min"}
                    5분
                {/if}
                {#if type === "1min"}
                    1분
                {/if}
            </span>
        </div>
    </div>
{/if}

<div
    draggable="true"
    ondragstart={handleDragStart}
    ontouchstart={handleTouchStart}
    ontouchmove={handleTouchMove}
    ontouchend={handleTouchEnd}
    role="button"
    aria-label="{value > 0 ? 'Add' : 'Subtract'} {Math.abs(value)} minutes"
    tabindex="0"
    class="
		w-16 h-16 md:w-24 md:h-24 rounded-2xl flex flex-col items-center justify-center gap-1 cursor-grab active:cursor-grabbing shadow-[0_8px_20px_rgba(0,0,0,0.1)] transition-all hover:-translate-y-1 hover:shadow-[0_12px_24px_rgba(0,0,0,0.15)] border-2 border-white/50 backdrop-blur-sm select-none touch-none
		{value > 0
        ? 'bg-gradient-to-br from-cyan-400 to-blue-500 text-white'
        : 'bg-gradient-to-br from-rose-400 to-red-500 text-white'}
	"
>
    <span
        class="font-bold font-jua text-sm md:text-xl drop-shadow-md whitespace-nowrap"
    >
        {#if type === "hour"}
            1시간
        {/if}
        {#if type === "10min"}
            10분
        {/if}
        {#if type === "5min"}
            5분
        {/if}
        {#if type === "1min"}
            1분
        {/if}
    </span>
    <span
        class="text-[0.6rem] md:text-xs opacity-90 font-bold bg-black/10 px-2 py-0.5 rounded-full whitespace-nowrap"
    >
        {value > 0 ? "+" : ""}{value}m
    </span>
</div>
