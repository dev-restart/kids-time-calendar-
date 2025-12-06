<script lang="ts">
    // Props: value in minutes
    // If value is negative, it's subtraction.
    let { value, type = "10min" }: { value: number; type: string } = $props();

    function handleDragStart(event: DragEvent) {
        if (!event.dataTransfer) return;
        event.dataTransfer.setData(
            "application/json",
            JSON.stringify({ minutes: value, type }),
        );
        event.dataTransfer.effectAllowed = "copy";
    }
</script>

<div
    draggable="true"
    ondragstart={handleDragStart}
    role="button"
    aria-label="{value > 0 ? 'Add' : 'Subtract'} {Math.abs(value)} minutes"
    tabindex="0"
    class="
		w-16 h-16 md:w-24 md:h-24 rounded-2xl flex flex-col items-center justify-center gap-1 cursor-grab active:cursor-grabbing shadow-[0_8px_20px_rgba(0,0,0,0.1)] transition-all hover:-translate-y-1 hover:shadow-[0_12px_24px_rgba(0,0,0,0.15)] border-2 border-white/50 backdrop-blur-sm select-none
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
